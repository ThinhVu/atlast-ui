import axios from 'axios';
import {API_URL} from '@/constants';
import {user as appUser} from '@/app-state';

function getRespData({data, error}) {
  if (error) {
    throw error
  }
  if (typeof (data) === 'object' && data.data) {
    return data.data
  }
  return data
}

async function exec(promise) {
  try {
    const rs = getRespData(await promise)
    if (window.__debug)
      console.log(rs.data)
    return rs;
  } catch (e) {
    console.log(e)
  }
}

let axiosOpts = {};

async function _saveAuthSession({user, token}) {
  axiosOpts = {headers: {Authorization: `Bearer ${token}`}};
  window.localStorage.setItem('access_token', token);
  appUser.value = user
}

export const userAPI = {
  signUp: async (email, password) => {
    const {data} = await axios.post(`${API_URL}/user/sign-up`, {email, password})
    await _saveAuthSession(data)
    return data
  },
  signIn: async (email, password) => {
    const {data} = await axios.post(`${API_URL}/user/sign-in`, {email, password})
    await _saveAuthSession(data)
    return data
  },
  auth: async token => {
    const {data} = await axios.get(`${API_URL}/user/auth`, {headers: {Authorization: `bearer ${token}`}})
    await _saveAuthSession(data)
    return data
  },
  signOut: async () => exec(axios.post(`${API_URL}/user/sign-out`), {}, axiosOpts),
  changePassword: async (change) => exec(axios.put(`${API_URL}/user/change-password`, change, axiosOpts)),
}

export const dbClusterAPI = {
  getSharedClusters: () => exec(axios.get(`${API_URL}/cluster/shared`, axiosOpts)),
  getMineClusters: () => exec(axios.get(`${API_URL}/cluster/mine`, axiosOpts)),
}

export const dbAPI = {
  getDbs: async () => exec(axios.get(`${API_URL}/database`, axiosOpts)),
  createDb: async (alias, clusterId) => exec(axios.post(`${API_URL}/database`, {alias, clusterId}, axiosOpts)),
  removeDb: async (dbId) => exec(axios.delete(`${API_URL}/database/${dbId}`, axiosOpts)),
  getApiKeys: async (dbId) => exec(axios.get(`${API_URL}/api-key/${dbId}`, axiosOpts)),
  createApiKey: async (dbId) => exec(axios.post(`${API_URL}/api-key/${dbId}`, {}, axiosOpts)),
  enableApiKey: async (dbId, apiKey) => exec(axios.put(`${API_URL}/api-key/${dbId}/${apiKey}`, {enable: true} ,axiosOpts)),
  disableApiKey: async (dbId, apiKey) => exec(axios.put(`${API_URL}/api-key/${dbId}/${apiKey}`, {enable: false} ,axiosOpts)),
  getDbCollection: async (dbId) => exec(axios.get(`${API_URL}/explore/${dbId}`, axiosOpts)),
  createNewCollection: async (dbId, colName) => exec(axios.post(`${API_URL}/explore/${dbId}`, {colName}, axiosOpts)),
  deleteCollection: async (dbId, colName) => exec(axios.delete(`${API_URL}/explore/${dbId}/${colName}`, axiosOpts))
}

export const paymentAPI = {
  getCurrentBalance: async() => exec(axios.get(`${API_URL}/payment`, axiosOpts)),
  getPaymentHistory: async () => exec(axios.get(`${API_URL}/payment/history`, axiosOpts)),
  pay: async (details) => exec(axios.post(`${API_URL}/payment/pay`, details, axiosOpts)),
}

export const webhookAPI = {
  listDbWebHook: async(dbId, colName) => exec(axios.get(`${API_URL}/db-webhook/${dbId}/${colName}`, axiosOpts)),
  createDbWebHook: async(dbId, colName, to) => exec(axios.post(`${API_URL}/db-webhook/${dbId}/${colName}`, {to}, axiosOpts)),
  updateDbWebHook: async(dbId, colName, id, to) => exec(axios.put(`${API_URL}/db-webhook/${dbId}/${colName}/${id}`, {to: to}, axiosOpts)),
  deleteDbWebHook: async(id) => exec(axios.delete(`${API_URL}/db-webhook/${id}`, axiosOpts)),
  enableWebHook: async (id) => exec(axios.put(`${API_URL}/db-webhook/${id}`, {enable: true} ,axiosOpts)),
  disableWebHook: async (id) => exec(axios.put(`${API_URL}/db-webhook/${id}`, {enable: false} ,axiosOpts)),
}

export const collAPI = {
  countDocs: async (dbId, col) => exec(axios.get(`${API_URL}/user-collection/${dbId}/${col}`, axiosOpts)),
  getDocs: async(dbId, col, page) => exec(axios.get(`${API_URL}/user-collection/${dbId}/${col}/${page}`, axiosOpts)),
  createDoc: async(dbId, col, doc) => exec(axios.post(`${API_URL}/user-collection/${dbId}/${col}`, {doc}, axiosOpts)),
  updateDoc: async(dbId, col, id, doc) => exec(axios.put(`${API_URL}/user-collection/${dbId}/${col}/${id}`, doc, axiosOpts)),
  deleteDoc: async(dbId, col, id) => exec(axios.delete(`${API_URL}/user-collection/${dbId}/${col}/${id}`, axiosOpts)),
}

export const supportAPI = {
  createThread: async () => {},
  sendMessage: async () => {},
  loadMessages: async () => {}
}

export const orderAPI = {
  createOrder: async (order) => exec(axios.post(`${API_URL}/order`, order, axiosOpts)),
  getOrders: async () => exec(axios.get(`${API_URL}/order`, axiosOpts)),
  getOrder: async (orderId) => exec(axios.get(`${API_URL}/order/${orderId}`, axiosOpts)),
  cancelOrder: async (orderId) => exec(axios.put(`${API_URL}/order/${orderId}/cancel`, {}, axiosOpts)),
}