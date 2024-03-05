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
    try {
      const data = await exec(axios.post(`${API_URL}/user/sign-up`, {email, password}))
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.error('Token missed!');
      }
      return data.token;
    } catch (e) {
      console.error(e)
    }
  },
  signIn: async (email, password) => {
    try {
      const data = await exec(axios.post(`${API_URL}/user/sign-in`, {email, password}))
      console.log('data', data)
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.log('signIn failed')
      }
      return data.token;
    } catch (e) {
      console.error(e)
    }
  },
  auth: async token => {
    try {
      const data = await exec(axios.get(`${API_URL}/user/auth`, {headers: {Authorization: `bearer ${token}`}}));
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.log('Auth failed')
      }
      return data.token;
    } catch (e) {
      return null;
    }
  },
  signOut: async () => exec(axios.post(`${API_URL}/user/sign-out`), {}, axiosOpts),
  changePassword: async (change) => exec(() => axios.put(`${API_URL}/user/change-password`, change, axiosOpts)),
}

export const dbAPI = {
  getDbs: async () => exec(axios.get(`${API_URL}/database`, axiosOpts)),
  createDb: async (name) => exec(axios.post(`${API_URL}/database`, {name}, axiosOpts)),
  removeDb: async (dbId) => exec(axios.delete(`${API_URL}/database/${dbId}`, axiosOpts)),
  getApiKeys: async (dbId) => exec(axios.get(`${API_URL}/api-key/${dbId}`, axiosOpts)),
  createApiKey: async (dbId) => exec(axios.post(`${API_URL}/api-key/${dbId}`, {}, axiosOpts)),
  enableApiKey: async (dbId, apiKey) => exec(axios.put(`${API_URL}/api-key/${dbId}/${apiKey}`, {enable: true} ,axiosOpts)),
  disableApiKey: async (dbId, apiKey) => exec(axios.put(`${API_URL}/api-key/${dbId}/${apiKey}`, {enable: false} ,axiosOpts))
}