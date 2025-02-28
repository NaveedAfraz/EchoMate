import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  loading: false,
  error: null,
  onlineUsers: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessage(state, action) {
      // console.log(action.payload, "action.payload");
      state.messages = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload.filter(
        (user, index, self) => self.indexOf(user) === index
      );
    },
  },
});

export const { setMessage, setLoading, setError, setOnlineUsers } =
  messagesSlice.actions;
export default messagesSlice.reducer;
