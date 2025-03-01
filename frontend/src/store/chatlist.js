import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatuserlist: [],
  conversationLoad: false,
  conversationID: null,
  isGroup: false,
};

const chatlistSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    setChatList(state, action) {
      state.chatuserlist = action.payload;
    },
    setConversationLoad(state, action) {
      state.conversationLoad = action.payload;
    },
    setConversationID(state, action) {
      // console.log(action.payload.conversationID);
      state.conversationID = action.payload.conversationID;
    },
    setgroup(state, action) {
      console.log(action.payload, "...");

      state.isGroup = action.payload;
    },
  },
});

export const { setChatList, setConversationLoad, setConversationID, setgroup } =
  chatlistSlice.actions;
export default chatlistSlice.reducer;
