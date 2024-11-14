import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    settings: null
  },
  mutations: {},
  actions: {
    async getSettings ({ state }) {
      const { data = null } = await Api.get(`${API_VERSION}/settings`) || {}
      state.settings = data
    },
  }
}
