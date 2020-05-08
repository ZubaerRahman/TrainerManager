import { combineReducers } from "redux";
import auth from "./auth";
import trainers from "./trainers";

export default combineReducers({ auth, trainers });
