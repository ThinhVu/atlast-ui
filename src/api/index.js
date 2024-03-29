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
  axiosOpts = {headers: {Authorization: `bearer ${token}`}};
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

export const dbAPI = {
  getDbs: async () => exec(axios.get(`${API_URL}/database`, axiosOpts)),
  createDb: async (name) => exec(axios.post(`${API_URL}/database`, {name}, axiosOpts)),
  removeDb: async (dbId) => exec(axios.delete(`${API_URL}/database/${dbId}`, axiosOpts)),
  getApiKeys: async (dbId) => exec(axios.get(`${API_URL}/api-key/${dbId}`, axiosOpts)),
  createApiKey: async (dbId) => exec(axios.post(`${API_URL}/api-key/${dbId}`, {}, axiosOpts)),
  enableApiKey: async (dbId, apiKey) => exec(axios.put(`${API_URL}/api-key/${dbId}/${apiKey}`, {enable: true} ,axiosOpts)),
  disableApiKey: async (dbId, apiKey) => exec(axios.put(`${API_URL}/api-key/${dbId}/${apiKey}`, {enable: false} ,axiosOpts)),
  getDbCollection: async(dbId) => exec(axios.get(`${API_URL}/explore/${dbId}`,axiosOpts)),
  createNewCollection: async(dbId, colName) => exec(axios.post(`${API_URL}/explore/${dbId}`,{colName} ,axiosOpts))
}

export const paymentAPI = {
  getCurrentBalance: async() => exec(axios.get(`${API_URL}/payment`, axiosOpts)),
  depositMoney: async (amount) => exec(axios.post(`${API_URL}/payment/deposit`, {amount}, axiosOpts)),
  updateBalance: async (amount) => exec(axios.post(`${API_URL}/payment`, {amount}, axiosOpts)),
  getPaymentHistory: async () => exec(axios.get(`${API_URL}/payment/history`, axiosOpts)),
  updatePaymentHistory: async (value) => exec(axios.post(`${API_URL}/payment/history`, {value}, axiosOpts)),
}

export const webhookAPI = {
  listDbWebHook: async(dbId) => exec(axios.get(`${API_URL}/db-webhook/${dbId}`, axiosOpts)),
  createDbWebHook: async(dbId, data) => exec(axios.post(`${API_URL}/db-webhook/${dbId}`, data, axiosOpts)),
  updateDbWebHook: async(webhookId, change) => exec(axios.post(`${API_URL}/db-webhook/${webhookId}`, change, axiosOpts)),
  deleteDbWebHook: async(webhookId) => exec(axios.delete(`${API_URL}/db-webhook/${webhookId}`, axiosOpts)),
}