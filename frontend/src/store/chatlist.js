import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatuserlist: [],
  conversationLoad: false,
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
  },
});

export const { setChatList, setConversationLoad } = chatlistSlice.actions;
export default chatlistSlice.reducer;
