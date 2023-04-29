import { createStore, applyMiddleware } from 'redux'
import thunkMiddleWare from 'redux-thunk'

const initialState = {
  favoriteAnimal: 'wolf',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FAVORITE_ANIMAL':
      return { ...state, favoriteAnimal: action.payload }
    default:
      return state
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleWare))

const setFavoriteAnimal = (favoriteAnimal) => {
  return {
    type: 'FAVORITE_ANIMAL',
    payload: favoriteAnimal,
  }
}

export { store, setFavoriteAnimal }
