import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/auth_reducer';
import friendReducer from './reducers/friend_reducer';

// Placeholder reducers for chatReducer, groupReducer
const chatReducer = (state = {}, action) => state;
const groupReducer = (state = {}, action) => state;

const AppReducers = combineReducers({
  authReducer,
  friendReducer,
  chatReducer,
  groupReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['friendReducer', 'chatReducer', 'groupReducer'],
  whitelist: ['authReducer'],
};

const persistedReducer = persistReducer(persistConfig, AppReducers);

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

let store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);
let persistor = persistStore(store);

export { store, persistor };
