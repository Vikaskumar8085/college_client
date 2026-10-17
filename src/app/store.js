import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import recordReducer from "../features/records/recordSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    records: recordReducer,
  },
});

export default store;
