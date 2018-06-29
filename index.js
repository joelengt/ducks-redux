import React, { Component } from 'react'
import { connect } from 'react-redux'

import catalogosDucks from 'reducers/productos/catalogos'
import familiasDucks from 'reducers/productos/familias'

class Catalogos extends Component {
  state = {
    isShowModal: false,
    isShowModalToCreateProduct: false,
    filterHead: {},
    filterChilds: []
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      history,
      detalle: { id, status, product_seo, name, description },
      match: {
        params: { idRow }
      }
    } = nextProps

    let nextState = {}

    if (status === 'READY') {
      let seo = {
        seo_title: isEmpty(product_seo.title) ? nextProps.detalle.name.value : product_seo.title,
        seo_meta_description: isEmpty(product_seo.meta_description) ? nextProps.detalle.description.value : product_seo.meta_description,
        seo_url: isEmpty(product_seo.url) ? '' : product_seo.url,
        product_title: name.value,
        product_meta_description: description.value
      }

      nextState = { ...nextState, ...seo }
    }

    // Valida si es crear o duplicar y id existe => esto pasa despues de haberle dado clic en guardar
    if ((idRow === 'crear' || idRow === 'duplicar') && status === 'SAVED' && id) history.replace(`/productos/catalogos/${id}`)

    if (status === 'DELETED') history.replace('/productos/catalogos')

    return Object.keys(nextState).length === 0 ? null : nextState
  }

  shouldComponentUpdate(nextProps) {
    const {
      catalogos: { search, filters, status, id },
      match: { url },
      history
    } = nextProps

    if (!filters.equals(this.props.catalogos.filters)) nextProps.getCatalogos({ search, filters })

    // Cuando la respuesta del crear el producto es correcta
    if (status === 'SAVED' && id) history.push(`${url}/${id}`)

    return true
  }

  componentDidMount() {
    const { getCatalogos, getFamilias } = this.props

    getCatalogos()
    getFamilias()
  }

  componentWillUnmount() {
    this.props.clearFilter()
  }

  isToFormatDate(string) {
    if (isEmpty(string)) return ''

    return this.getDateFormat(string)
  }

  isAttributesVariationsPicked(attributes) {
    if (!attributes.length) return false

    const isPicked = attributes.filter(({ selected }) => selected)
    if (isPicked.length) return true

    return false
  }

  render() {
    const {
      history,
      match: {
        params: { idRow }
      },
      detalle: {
        id,
        name,
        is_send_express,
      }
    } = this.props

    const {
      isShowModal,
      product_title,
      product_meta_description
    } = this.state

    return (
      <div>
        {status === 'LOADING' ? (
            <Loading />
          ) : status === 'READY' || status === 'SAVED' ? (
          <div>
          <div>
            {idRow !== 'crear'
              && idRow !== 'duplicar' && (
              <div
                className='header__go-back'
                onClick={() => {
                  history.replace('/productos/catalogos')
                }}>
                <i className='material-icons md-18'>keyboard_arrow_left</i>
                <button className='btn btn-secondary space-btw-btn' onClick={() => this.setState({ isShowModalToDelete: true })}>
                  Eliminar
                </button>
                <button
                  className='btn btn-secondary space-btw-btn'
                  onClick={() => {
                    this.props.updateForm({ status: 'READY' })
                    this.setState({ isShowModalToDuplicate: true })
                  }}>
                    Duplicar
                </button>
              </div>
            )}
          </div>
        <div>
        <article>
          {variations.attributes.map(
            ({ id, attribute: { name }, options, selected }) =>
              selected ? (
                <div className='products-variations__row' key={id}>
                  <div className='values-row__name'>
                    <p className='values-row__textname'>{name}</p>
                  </div>
                  <div className='values-row__content'>
                    {options.map(option => (
                      <div className={`tag values-row__tag ${option.selected ? 'active' : ''}`} key={option.id}>
                        <div className='values-row__tag-content'>
                          <div className='product__checkbox values-row__tag-check'>
                            <div className='checkbox-default'>
                              <label className='checkbox-default__container'>
                                <input
                                  checked={option.selected}
                                  onChange={e => {
                                    const selected = e.currentTarget.checked
                                    selected
                                      ? this.props.toggleCheckboxValue(option.id, selected)
                                      : this.evaluateVariationOnRemoveCheck(option.id, selected, 'values')
                                    this.props.rehydrateAttributeList()
                                  }}
                                  type='checkbox' />
                                <span className='checkbox-default__clicked' />
                              </label>
                            </div>
                          </div>
                          <p className='values-row__tag-name'>{option.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
          )}
        </article>
        </div>
          <Modal isShow={isShowModalToDuplicate} onChange={isShow => this.setState({ isShowModalToDuplicate: isShow })}>
            <Modal.Header>
              <h3>¿Está seguro que desea duplicar este producto?</h3>
            </Modal.Header>
            <Modal.Footer>
              <Button className='btn btn-secondary' onClick={() => this.setState({ isShowModalToDuplicate: false })}>
                Cancelar
              </Button>
              <Button
                className='btn btn-primary'
                onClick={() => {
                  this.props.updateForm({ status: 'READY' })
                  this.props.duplicateProduct(id)
                  this.setState({ isShowModalToDuplicate: false })
                }}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
            </div>
          ) : null
      </div>
    )
  }

  _handleCheckedAttribute = ev => {
    const { attributes } = this.state

    const targetValue = parseInt(ev.target.value, 10)

    this.setState({
      attributes: ev.target.checked ? [...attributes, targetValue] : attributes.filter(id => id !== targetValue)
    })
  }

  _handleChangeModal = isShow => {
    this.setState(
      {
        isShowModalToCreateProduct: isShow
      },
      () => {
        if (!isShow) this._handleClickCloseModal()
      }
    )
  }
}

export default connect(
  ({ catalogos, familias }) => ({
    catalogos,
    familias,
    getValues: catalogosDucks.selectors.getValues(catalogos),
    subtotal: catalogosDucks.selectors.subtotal(catalogos),
    shopItems: catalogosDucks.selectors.shopItems(catalogos)
  }),
  {
    getCatalogos: catalogosDucks.creators.getCatalogos,
    clearFilter: catalogosDucks.creators.clearFilter,
    toggleCheckedRows: catalogosDucks.creators.toggleCheckedRows,
    deleteCheckedRows: catalogosDucks.creators.deleteCheckedRows,
    getDataForPath: catalogosDucks.creators.getDataForPath,
    toggleItemFilter: catalogosDucks.creators.toggleItemFilter,
    submitItem: catalogosDucks.creators.submitItem,
    updateVariations: catalogosDucks.creators.updateVariations,
    preCreateProduct: catalogosDucks.creators.preCreateProduct,
    getFamilias: familiasDucks.creators.getFamilias
  }
)(Catalogos)
