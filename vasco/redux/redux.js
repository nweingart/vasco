import { createStore, applyMiddleware } from 'redux'
import thunkMiddleWare from 'redux-thunk'

const initialState = {
  favoriteAnimal: 'wolf',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PHOTOS':
      return { ...state, photos: action.payload }
    case 'SET_RECEIPTS':
      return { ...state, receipts: action.payload }
    default:
      return state
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleWare))


const setPhotos = (photos) => {
  return {
    type: 'SET_PHOTOS',
    payload: photos,
  }
}

const setReceipts = (receipts) => {
  return {
    type: 'SET_RECEIPTS',
    payload: receipts,
  }
}


export { store, setPhotos, setReceipts }
