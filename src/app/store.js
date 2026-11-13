import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import designersReducer from '../features/designers/designersSlice.js';
import projectsReducer from '../features/projects/projectsSlice.js';
import ordersReducer from '../features/orders/ordersSlice.js';
import statsReducer from '../features/stats/statsSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    designers: designersReducer,
    projects: projectsReducer,
    orders: ordersReducer,
    stats: statsReducer,
  },
});

export default store;
