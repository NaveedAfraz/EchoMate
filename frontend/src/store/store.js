import { configureStore } from "@reduxjs/toolkit";
import chatlistReducer from "./chatlist";
import messagesReducer from "./messages";
const store = configureStore({  
  reducer: {
    chatlist: chatlistReducer,
    messages: messagesReducer,
  },
});

export default store;
