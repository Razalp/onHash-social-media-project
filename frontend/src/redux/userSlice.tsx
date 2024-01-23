import {createSlice} from '@reduxjs/toolkit'

const initialState={
    id:null,
    username:null,
    email:null,
    isAdmin:null,
    isAuthenticated:false

}

const authSlice=createSlice({
    name:'userDetails',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.id=action.payload.id;
            state.username=action.payload.username;
            state.email=action.payload.email;
            state.isAdmin=action.payload.role;
            state.isAuthenticated=true;
            localStorage.setItem('userDetails', JSON.stringify(state));
        },

        logout:(state)=>{
            state.id=null;
            state.username=null;
            state.email=null;
            state.isAdmin=null;
            state.isAuthenticated=false
        }
    }
})

export const{login,logout}=authSlice.actions
export default authSlice.reducer