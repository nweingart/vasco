import { createStore, applyMiddleware } from 'redux'
import thunkMiddleWare from 'redux-thunk'

const initialState = {
  favoriteAnimal: 'wolf',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DELIVERY_RECEIPTS':
      return { ...state, deliveryReceipts: action.payload }
    case 'SET_DELIVERY_PHOTOS':
      return { ...state, deliveryPhotos: action.payload }
    case 'SET_DELIVERY_DATE':
      return { ...state, deliveryDate: action.payload }
    case 'SET_DELIVERY_PROJECT':
      return { ...state, deliveryProject: action.payload }
    case 'SET_DELIVERY_VENDOR':
      return { ...state, deliveryVendor: action.payload }
    case 'SET_DELIVERY_NOTES':
      return { ...state, deliveryNotes: action.payload }
    case 'SET_EMAIL_RECEIPTS':
      return { ...state, emailReceipts: action.payload }
    case 'SET_MAILING_LIST':
      return { ...state, mailingList: action.payload }
    case 'DELIVERY_STATUS':
      return { ...state, deliveryStatus: action.payload }
    case 'SET_RECEIPT_DOWNLOAD_URLS':
      return { ...state, receiptDownloadURLs: action.payload }
    case 'SET_PHOTO_DOWNLOAD_URLS':
      return { ...state, photoDownloadURLs: action.payload }
    case 'STATUS_FILTER':
      return { ...state, statusFilter: action.payload }
    case 'DATE_FILTER': {
      return { ...state, dateFilter: action.payload }
    }
    default:
      return state
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleWare))


const setDeliveryReceipts = (receipts) => {
  return {
    type: 'SET_DELIVERY_RECEIPTS',
    payload: receipts,
  }
}
const setDeliveryPhotos = (photos) => {
  return {
    type: 'SET_DELIVERY_PHOTOS',
    payload: photos,
  }
}

const setDeliveryDate = (date) => {
  return {
    type: 'SET_DELIVERY_DATE',
    payload: date,
  }
}
const setDeliveryProject = (project) => {
  return {
    type: 'SET_DELIVERY_PROJECT',
    payload: project,
  }
}

const setDeliveryVendor = (vendor) => {
  return {
    type: 'SET_DELIVERY_VENDOR',
    payload: vendor,
  }
}

const setDeliveryNotes = (notes) => {
  return {
    type: 'SET_DELIVERY_NOTES',
    payload: notes,
  }
}

const setEmailReceipts = (emailReceipts) => {
  return {
    type: 'SET_EMAIL_RECEIPTS',
    payload: emailReceipts,
  }
}

const setMailingList = (mailingList) => {
  return {
    type: 'SET_MAILING_LIST',
    payload: mailingList,
  }
}

const setDeliveryStatus = (deliveryStatus) => {
  return {
    type: 'DELIVERY_STATUS',
    payload: deliveryStatus,
  }
}

const setReceiptsDownloadUrls = (receiptDownloadUrls) => {
  return {
    type: 'SET_RECEIPT_DOWNLOAD_URLS',
    payload: receiptDownloadUrls,
  }
}

const setPhotoDownloadUrls = (photoDownloadUrls) => {
  return {
    type: 'SET_PHOTO_DOWNLOAD_URLS',
    payload: photoDownloadUrls,
  }
}

const setStatusFilter = (statusFilter) => {
  return {
    type: 'STATUS_FILTER',
    payload: statusFilter,
  }
}

const setDateFiler = (dateFilter) => {
  return {
    type: 'DATE_FILTER',
    payload: dateFilter,
  }
}

export {
  store,
  setDeliveryReceipts,
  setDeliveryPhotos,
  setDeliveryDate,
  setDeliveryProject,
  setDeliveryVendor,
  setDeliveryNotes,
  setDeliveryStatus,
  setEmailReceipts,
  setMailingList,
  setReceiptsDownloadUrls,
  setPhotoDownloadUrls,
  setStatusFilter,
  setDateFiler,
}
