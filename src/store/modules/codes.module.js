import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    codes: []
  },
  mutations: {
    setCodes (state, codes) {
      state.codes = codes
    }
  },
  actions: {
    async createCode ({ commit }, code) {
      await Api.post(`${API_VERSION}/code`, {
        data: {
          code: code.toString(),
          email: null,
          last_activity: null,
          name: null
        }
      })
    },
    async generateCodes ({ state }, { count, length }) {
      await Api.get(`${API_VERSION}/codes/generate`, {
        key_count: count,
        key_length: length
      })
    },
    async getCodes ({ state }) {
      state.codes = await Api.get(`${API_VERSION}/codes`, {}).then(res => res.data) || {}
    },
    async removeAllCodes () {
      await Api.delete(`${API_VERSION}/codes`, {})
    },
    async removeCode ({ state }, id) {
      await Api.delete(`${API_VERSION}/code`, {
        data: {
          code_id: id
        }
      })
    }
  }
}
