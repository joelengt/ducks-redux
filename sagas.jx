import { call, put, takeEvery } from 'redux-saga/effects'
import { toast } from 'react-toastify'

import detalle from 'reducers/sample/categorias/detalle'
import detalle2 from 'reducers/sample/bloques/index'
import detallePaginasLita from 'reducers/sample/paginas/index'

import { Get, Post, Put, Delete } from 'lib/Request'

const { types } = detalle

function* getSample({ idRow }) {
  try {
    yield put({ type: types.FETCH_PENDING })
    const payload = yield call(Get, `sample/${idRow}`)
    const products = [ ...payload.item.products_display ]

    yield put({
      type   : types.FETCH_FULFILLED,
      payload: {
        ...payload.item,
        mode_visibility: payload.item.display_mode,
        category_static_block: payload.item.category_static_block,
        category_page_block  : payload.item.category_page_block,
        category_page_url    : '',
        products
      }
    })

    yield put({ type: detalle2.types.FETCH }) // fetch static block list
    yield put({ type: detallePaginasLita.types.FETCH }) // fetch static pages list

    yield put({ type: types.GET_PRODUCTS_LIST }) // get table list products
  } catch (e) {
    switch (e.type) {
      case 'cancel':
        yield put({ type: types.FETCH_CANCEL })
        break
      default:
        const message = e.response.data.message || ''
        yield put({ type: types.FETCH_FAILURE, error: message })
        break
    }
  }
}

function* createSample(action) {
  try {
    yield put({ type: types.POST_PENDING })
    const payload = yield call(Post, 'sample/', action.dataForm)
    yield put({
      type: types.POST_FULFILLED,
      id  : payload.item.id
    })
    toast.success('Guardado correctamente', {
      position       : toast.POSITION.TOP_CENTER,
      hideProgressBar: true
    })
  } catch (e) {
    switch (e.type) {
      case 'cancel':
        yield put({ type: types.POST_CANCEL })
        break
      default:
        const { message = '', errors } = e.response.data
        let currentMessage = message

        if(errors) currentMessage = errors.message

        toast.error(`Error al crear: ${currentMessage}`, {
          position       : toast.POSITION.TOP_CENTER,
          hideProgressBar: true
        })

        yield put({ type: types.POST_FAILURE, error: currentMessage })
        break
    }
  }
}

function* updateSample(action) {
  try {
    yield put({ type: types.PUT_PENDING })
    yield call(Put, `sample/${action.dataForm.id}`, action.dataForm)
    yield put({ type: types.PUT_FULFILLED })
    toast.success('Actualizado correctamente', {
      position       : toast.POSITION.TOP_CENTER,
      hideProgressBar: true
    })
  } catch (e) {
    switch (e.type) {
      case 'cancel':
        yield put({ type: types.PUT_CANCEL })
        break
      default:
        const { message = '', errors } = e.response.data
        let currentMessage = message

        if(errors) currentMessage = errors.message

        toast.error(`Error al actualizar: ${currentMessage}`, {
          position       : toast.POSITION.TOP_CENTER,
          hideProgressBar: true
        })

        yield put({ type: types.PUT_FAILURE, error: currentMessage })
        break
    }
  }
}

function* deleteSample(action) {
  try {
    yield put({ type: types.DELETE_PENDING })
    yield call(Delete, `sample/${action.idRow}/`)
    yield put({ type: types.DELETE_FULFILLED })
    toast.success('Eliminado correctamente', {
      position       : toast.POSITION.TOP_CENTER,
      hideProgressBar: true
    })
  } catch (e) {
    switch (e.type) {
      case 'cancel':
        yield put({ type: types.DELETE_CANCEL })
        break
      default:
        const message = e.response.data.message || ''
        yield put({ type: types.DELETE_FAILURE, error: e.message })
        toast.error(`Error al eliminar: ${message}`, {
          position       : toast.POSITION.TOP_CENTER,
          hideProgressBar: true
        })
        break
    }
  }
}

export default [
  takeEvery(types.FETCH, getSample),
  takeEvery(types.DELETE, deleteSample),
  takeEvery(types.POST, createSample),
  takeEvery(types.PUT, updateSample)
]
