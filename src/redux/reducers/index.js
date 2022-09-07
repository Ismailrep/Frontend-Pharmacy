import { combineReducers } from "redux";
import adminReducer from "./admin";
import userReducer from "./users";

export default combineReducers({
  admin: adminReducer,
  user: userReducer,
});
