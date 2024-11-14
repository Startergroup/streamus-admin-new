import axios from 'axios'
import store from '../store'
import router from '../router'
import { BASE_URL } from './api.config'

class Api {
  #client

  constructor () {
    this.#client = axios.create({ baseURL: BASE_URL })
  }

  async execute (method, url, { params = {}, data = {} }) {
    const result = await this.#client({
      method,
      headers: {
        Authorization: `Bearer ${store.state.auth.token}`
      },
      url,
      params,
      data
    }).catch((error) => {
      if (error.response.status === 403) {
        store.commit('auth/setToken', null)
        router.push('/auth')
      }

      throw new Error(error)
    })

    return result?.data
  }

  get (url, params = {}) {
    return this.execute('get', url, { params })
  }

  post (url, { params = {}, data = {} }) {
    return this.execute('post', url, { params, data })
  }

  put (url, { params = {}, data = {} }) {
    return this.execute('put', url, { params, data })
  }

  delete (url, { data = {} }) {
    return this.execute('delete', url, { data })
  }
}

export default new Api()
