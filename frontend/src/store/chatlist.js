import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatuserlist: [],
};

const chatlistSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    setChatList(state, action) {
      state.chatuserlist = action.payload;
    },
  },
});

export const { setChatList } = chatlistSlice.actions;
export default chatlistSlice.reducer;
