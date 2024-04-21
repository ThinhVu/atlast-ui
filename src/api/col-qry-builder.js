import '@tvux/hmmjs/src/builder.browser'
import axios from 'axios'
import jsonFn from 'json-fn'
import {API_URL} from "@/constants";

const getOpts = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }})

function collQryBuilder(dbId, dataSource) {
  const _db = HmmBuilder(async payload => {
    try {
      const {data} = await axios.post(`${API_URL}/execute-db-cmd/${dbId}`, jsonFn.stringify(payload), getOpts())
      dataSource.value = data
      return data
    } catch (e) {
      console.error(e)
      const errMsg = e.response.data.error
      console.error(errMsg)
    }
  })
  const db = new Proxy({}, {
    get(__target, prop) {
      return _db(prop)
    }
  })
  window.db = db
}
export default collQryBuilder
