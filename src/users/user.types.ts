export type User = {
  name: string;
  age: number;
}
export type UserKeys = keyof User; // "name" | "age";
export type UserTypes = User[UserKeys]; // string | number

  export interface UserState {
    user: User ;
    users: User[];
  }

// state

  
  const initialState: UserState = {
    user: {name: 'new User', age: 0},
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