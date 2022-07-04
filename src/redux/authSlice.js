import {createSlice} from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user:  user? user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,

}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers: () => {
        
    }
   
})

export default authSlice.reducer;