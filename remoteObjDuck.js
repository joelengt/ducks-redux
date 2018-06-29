import Duck from 'extensible-duck'
import axios from 'axios'

export default function createDuck({ namespace, store, path, initialState={} }) {
  return new Duck({
    namespace, store,

    consts: { statuses: [ 'NEW', 'LOADING', 'READY', 'SAVING', 'SAVED' ] },

    types: [
      'UPDATE',
      'FETCH', 'FETCH_PENDING',  'FETCH_FULFILLED',
      'POST',  'POST_PENDING',   'POST_FULFILLED',
    ],

    reducer: (state, action, { types, statuses, initialState }) => {
      switch(action.type) {
        case types.UPDATE:
          return { ...state, obj: { ...state.obj, ...action.payload } }
        case types.FETCH_PENDING:
          return { ...state, status: statuses.LOADING }
        case types.FETCH_FULFILLED:
          return { ...state, obj: action.payload.data, status: statuses.READY }
        case types.POST_PENDING:
        case types.PATCH_PENDING:
          return { ...state, status: statuses.SAVING }
        case types.POST_FULFILLED:
        case types.PATCH_FULFILLED:
          return { ...state, status: statuses.SAVED }
        default:
          return state
      }
    },

    creators: ({ types }) => ({
      update: (fields) => ({ type: types.UPDATE, payload: fields }),
      get:        (id) => ({ type: types.FETCH, payload: axios.get(`${path}/${id}`),
      post:         () => ({ type: types.POST, payload: axios.post(path, obj) }),
      patch:        () => ({ type: types.PATCH, payload: axios.patch(`${path}/${id}`, obj) })
    }),

    initialState: ({ statuses }) => ({ obj: initialState || {}, status: statuses.NEW, entities: [] })
  })
}