import UserReducer from './reducers/UserReducer';
import DataJaimeReducer from './reducers/DataJaimeReducer';
import { combineReducers } from "redux";
const rootReducers = combineReducers({ user: UserReducer,data:DataJaimeReducer});
export default rootReducers;