import React from 'react'
import Duck from './Duck'

@connect(state => ({
  items: Duck.selectors.items(state),
  subTotal: Duck.selectors.subTotal(state)
}))
export default class HomeView extends React.Component {
  render(){
    // make use of sliced state here in props
    // ...
  }
}