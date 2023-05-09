import { Store } from '../store/observable.store';
import { UserState, User } from './user.types';

const initialUser: User = {
    name: 'John',
    age: 30
}
export const userStore = new Store<User>(initialUser);
