import Duck, { constructLocalized } from 'extensible-duck'
import { createSelector } from 'reselect'

export default new Duck({
  store: 'fruits',
  initialState: {
    items: [
      { name: 'apple', value: 1.2 },
      { name: 'orange', value: 0.95 }
    ]
  },
  reducer: (state, action, duck) => {
    switch(action.type) {
      // do reducer stuff
      default: return state
    }
  },
  creators: ({ types: { FETCH, UPDATE, POST } }) => ({
    getCatalogos    : query => ({ type: FETCH, query }),
    updateVariations: payload => ({ type: UPDATE, payload }),
    preCreateProduct: data => ({ type: POST, data })
  }),
  selectors: constructLocalized({
    items: state => state.items, // gets the items from state
    subTotal: new Duck.Selector(selectors => state =>
      // Get another derived state reusing previous selector. In this case items selector
      // Can compose multiple such selectors if using library like reselect. Recommended!
      // Note: The order of the selectors definitions matters
      selectors
        .items(state)
        .reduce((computedTotal, item) => computedTotal + item.value, 0)
    ),
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
  })
})