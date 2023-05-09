import { BehaviorSubject, Subject, Observable } from "rxjs";
import { scan, map, distinctUntilKeyChanged } from "rxjs/operators";



// export type State<T> = {
    
//     [key: string]: Observable<keyof T>
// }

type Reducer<T> = (state: T, action: any) => any;

export class Store<T> {
    private initialState: T;
    private store: BehaviorSubject<T>
    private stateUpdate: Subject<T> = new Subject<T>();
    
    constructor(initialState: T) {
        this.initialState = initialState;
        this.store = new BehaviorSubject(initialState);
        this.stateUpdate.pipe(
            scan((acc:T, curr:T): T => { return { ...acc, ...curr }}, this.initialState)
        ).subscribe(this.store);
    }

    selectState(key: keyof T) {
        return this.store.pipe(
            distinctUntilKeyChanged(key),
            map((state:T) => state[key])
        )
    }

    updateState(newState: T) {
        this.stateUpdate.next(newState);
    }

    getState() {
        return this.store.getValue();
    }

    stateChanges() {
        return this.store.asObservable();
    }
}