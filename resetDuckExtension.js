export default {
  types: [ 'RESET' ],
  reducer: (state, action, { types, statuses, initialState }) => {
    switch(action.type) {
      case types.RESET:
        return { ...initialState, obj: { ...initialState.obj, ...action.payload } }
      default:
        return state
    }
  },
  creators: ({ types }) => ({
    reset: (fields) => ({ type: types.RESET, payload: fields }),
  })
}
