import { combineReducers } from "redux";
import adminReducer from "./admin";

export default combineReducers({
  admin: adminReducer,
});
