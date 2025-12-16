import {createSlice}  from '@reduxjs/toolkit';

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
};

// amazonq-ignore-next-line
const profileSLice = createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setUser(state, value) {
            state.user = value.payload;
            localStorage.setItem("user", JSON.stringify(value.payload));
        },
      setLoading(state, value) {
      state.loading = value.payload;
     },
    },
});

export const {setUser, setLoading}=profileSLice.actions;
export default profileSLice.reducer;