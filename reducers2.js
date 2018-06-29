
import { combineReducers } from 'redux'
import Duck from './Duck'

export default combineReducers({ [Duck.store]: Duck.reducer })