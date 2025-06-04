import Api from '@/api/api'
import bcrypt from 'bcryptjs'
import { AUTH_DATA } from '@/constants/storages'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    token: null,
    user: null
  },
  getters: {
    isLogged (state) {
      return Boolean(state.token)
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem(AUTH_DATA, token)
    },
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    async checkToken () {
      return await Api.get(`${API_VERSION}/admin/check_token`)
    },
    async login ({ state, commit }, { username, password }) {
      const { data: { salt } } = await Api.post(`${API_VERSION}/admin/check_user`, {
        data: {
          login: username
        }
      }) || {}

      if (!salt) {
        return { success: false }
      }

      const passHash = bcrypt.hashSync(password, salt)
      const { accessToken = null, success = false, user } = await Api.post(`${API_VERSION}/admin/login`, {
        data: {
          login: username,
          pass: passHash
        }
      }) || {}

      if (!success) {
        return { success: false }
      }

      commit('setToken', accessToken)
      commit('setUser', user)

      return {
        success: true
      }
    }
  }
}
