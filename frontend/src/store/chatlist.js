import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatuserlist: [],
  conversationLoad: false,
  conversationID: null,
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
  },
});

export const { setChatList, setConversationLoad, setConversationID } =
  chatlistSlice.actions;
export default chatlistSlice.reducer;
