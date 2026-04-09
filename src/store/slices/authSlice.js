import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import * as api from "../../services/api"

export const registerUser = createAsyncThunk("registerUser", async (data, {rejectwithValue})=>{
    try {
        const res = await api.register(data);

        const {token, user} = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        return user;
        
    } catch (error) {
        return rejectwithValue(error.response?.data?.message || "Registeration failed");
    }
})  ;


//load persisted user from localstorage

const storedUser = (()=>{
    try {
        return JSON.parse.apply(localStorage.getItem('user'));
    } catch (error) {
        return null;
    }
})();


const authSlice = createSlice({
    name : "auth",
    initialState : {
        user : storedUser,
        loading : false,
        error : null
    },

    reducers : {
        logout : (state)=>{
            state.user = null;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },

        clearError : (state) =>{
            state.error = null
        },
        setUser : (state, action)=>{state.user = action.payload},
    },

    extraReducers:(builder) =>{
        builder.addCase(registerUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
            
        })
        .addCase(registerUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
});


export const {logout, clearError, setUser} = authSlice.actions;
export default authSlice.reducer;