import { combineReducers } from 'redux'
import userDuck from './userDuck'

export default combineReducers({ [userDuck.store]: userDuck.reducer })