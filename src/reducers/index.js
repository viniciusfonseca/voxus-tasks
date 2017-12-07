import { combineReducers } from 'redux';

import session from './sessionReducer';
import queues from './queuesReducer'
import user from './userReducer'

const appReducer = combineReducers({
  queues,
  user
});

const rootReducer = (state, action) => {
  if (action.type === 'DESTROY_SESSION') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

export * from './sessionReducer';
