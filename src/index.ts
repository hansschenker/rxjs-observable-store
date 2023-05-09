import hh from "hyperscript-helpers";
// virtual-dom
import { h, diff, patch, VNode } from "virtual-dom";
import createElement from "virtual-dom/create-element";
import { User } from "./users/user.types";
import { BehaviorSubject, scan } from "rxjs";
// hyperscript-helpers call h from virtual-dom
const { div, button, input, label } = hh(h);


// import { userStore } from "./users/user.store";

// userStore.selectState('name').subscribe(name => console.log(name));
// userStore.selectState('age').subscribe(age => console.log(age));

// userStore.updateState({ name: 'Jane', age: 25 });

// state
export interface UserState {
    user: User ;
    users: User[];
  }

  
  const initialState: UserState = {
    user: {name: 'new User', age: 40},
    users: []
  };
  
  interface AddAction {
    type: "ADD";
    user: User;
  }
  interface DeleteAction {
    type: "DELETE";
    id: number;
  }
  interface UpdateAction {
    type: "UPDATE";
    user: Partial<User>;
  }
  interface ListAction {
    type: "LIST";
    users: User;
  }
  
  export type Action = AddAction | DeleteAction | UpdateAction | ListAction;
  
  // view
  type View = (state: UserState) => VNode;
  
  function view(model: UserState) {
    return div([
      div({ className: "mv2" }, `Count: ${model.user.name}`),
      div({ className: "mv2" }, `By: ${model.user.age}`),
      label({ className: "mv2" }, "Step by:"),
      input(
        {
          id: "step-by",
          className: "w-10",
          onchange: (e:InputEvent) => actions$.next({ type: "ADD", user:{age: parseInt((e.target as HTMLInputElement).value),name:"John"} }),
        },
        "+"
      ),
      button(
        {
          className: "pv1 ph2 mr2",
          onclick: () => actions$.next({ type: "DELETE", id: 1 }),
        },
        "+"
      ),
      button(
        {
          className: "pv1 ph2 mr2",
          onclick: () => actions$.next({ type: "UPDATE", user:{name:'new user', age:11} }),
        },
        "-"
      ),
      button(
        {
          className: "pv1 ph2",
        //   onclick: () => actions$.next({ type: "INITIALIZE", by: 0 }),
        },
        "Reset"
      ),
    ]);
  }
  
  // update
  type Update = (state: UserState, action: Action) => UserState;

  function initStepByInput() {
    const stepInput = document.getElementById("step-by") as HTMLInputElement;
    stepInput.value = "0";
  }
  function update(state: UserState, action: Action): UserState {
    switch (action.type) {
      case "ADD":
        initStepByInput();
        return { ...initialState };
      case "UPDATE":
        return { ...initialState, user: state.user };
      case "DELETE":
        // return { ...initialState, state: state.user?.age };
      case "LIST":
        // return { ...state, count: state.count - state.by };

      default:
        return state;
    }
  }
  // action subject
  const actions$ = new BehaviorSubject<Action>({ type: "ADD", user: { name: 'John', age: 30 } });
  
  // model stream
  const stateChange$ = actions$.pipe(
    scan< Action,UserState>((state, action) => update(state, action), initialState)
  );
  
  // app state change handled by virtual dom and rxjs state change
  function app(
    initialState: UserState,
    update: Update,
    view: View,
    node: HTMLElement
  ) {
    // initial virtual node
    let currentView = view(initialState);
  
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);
  
    stateChange$.subscribe((state) => {
      // updated virtual node
      const updatedView = view(state);
      const patches = diff(currentView, updatedView);
      // apply patches to real dom
      rootNode = patch(rootNode, patches);
      // update current virtual node with updated virtual node
      currentView = updatedView;
    });
  }
  
  
  // mount app
  const rootNode = document.getElementById("app") as HTMLDivElement;
  app(initialState, update, view, rootNode);