import table from '../../Extensions/table'
import filter from '../../Extensions/filter'
import Duck from 'extensible-duck'
import createDuck from './remoteObjDuck.js'
import { createSelector } from 'reselect'

export default createDuck({ namespace: 'my-app',store: 'user', path: '/users' })
  .extend({
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
  })
  .extend(table)
  .extend(filter)
  .extend({
    initialState: (duck, previousState) => ({
      variations: [],
      ...previousState
    }),
    creators: ({ types: { FETCH, UPDATE, POST } }) => ({
      getCatalogos    : query => ({ type: FETCH, query }),
      updateVariations: payload => ({ type: UPDATE, payload }),
      preCreateProduct: data => ({ type: POST, data })
    }),
    selectors: {
      getItems     : state => state.catalogos.items,
      getChekedRows: state => state.catalogos.checkedRows,
      getValues    : catalogos => catalogos.items.map(({ id }) => ({ id })),
      getValuesPlus: catalogos => catalogos.items.map(({ id }) => ({ id, slug: `A${ id }` })),
      subtotal     : new Duck.Selector(selectors => state =>
        selectors.getValues(state)
          .filter(item => item.id === 7)
          // .shopItems(state).reduce((acc, item) => acc + item.value, 0)
      ),
      shopItems: new Duck.Selector(selectors =>
        createSelector(
          selectors.getValues,
          selectors.getValuesPlus,
          (ids, idsPlus) =>
            [ ...idsPlus ].concat(
              ids.map(({ id }) => ({ id: id * 3, slug: `B${ id }` }))
            )
        ))
    }
  })