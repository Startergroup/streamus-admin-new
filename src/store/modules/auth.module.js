import Api from '@/api/api'
import bcrypt from 'bcryptjs'
import { AUTH_DATA } from '@/constants/storages'

export default {
  namespaced: true,
  state: {
    token: null,
    username: ''
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
    }
  },
  actions: {
    async checkToken () {
      return await Api.get('v2/admin/check_token')
    },
    async login ({ state, commit }, { username, password }) {
      const { salt } = await Api.post('v2/admin/check_user', {
        data: {
          login: username
        }
      }) || {}

      if (!salt) {
        return { success: false }
      }

      const passHash = bcrypt.hashSync(password, salt)
      const { accessToken = null, success = false } = await Api.post('v2/admin/auth', {
        data: {
          login: username,
          pass: passHash
        }
      }) || {}

      if (!success) {
        return { success: false }
      }

      commit('setToken', accessToken)

      return {
        success: true
      }
    }
  }
}
