import { configureStore } from "@reduxjs/toolkit";
import chatlistReducer from "./chatlist";
const store = configureStore({  
  reducer: {
    chatlist: chatlistReducer,
  },
});

export default store;
