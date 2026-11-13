import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client.js';

const AUTH_KEY = 'designer-marketplace-user';

function loadSavedUser() {
  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUser(user) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearUser() {
  window.localStorage.removeItem(AUTH_KEY);
}

const persistedUser = loadSavedUser();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedUser,
    isAuthenticated: Boolean(persistedUser),
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveUser(action.payload);
    },
    setToken(state, action) {
      if (!state.user) state.user = {};
      state.user.token = action.payload;
      state.isAuthenticated = Boolean(state.user);
      saveUser(state.user);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      clearUser();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminLogin.fulfilled, (state, action) => {
      const token = action.payload?.token;
      if (token) {
        const newUser = { ...(state.user || {}), token, login: 'admin', name: 'Administrator', role: 'admin' };
        state.user = newUser;
        state.isAuthenticated = true;
        saveUser(newUser);
      }
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const payload = action.payload || {};
      const token = payload.token;
      const user = payload.user || { login: payload.login || 'user', name: payload.name || payload.login || 'User', role: payload.role || 'user' };
      if (token) {
        const newUser = { ...user, token };
        state.user = newUser;
        state.isAuthenticated = true;
        saveUser(newUser);
      }
    });
  },
});

export const adminLogin = createAsyncThunk('auth/adminLogin', async (payload, thunkAPI) => {
 
  const body = await client.post('/admin/login', payload);
  
  return body;
});

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, thunkAPI) => {
  
  const body = await client.post('/login', payload);
  return { ...body, login: payload.login };
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
