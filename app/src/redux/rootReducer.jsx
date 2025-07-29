import { combineReducers } from 'redux';
import { contactReducer } from './reducer';

const rootReducer = combineReducers({
    contactReducer,
})

export default rootReducer;