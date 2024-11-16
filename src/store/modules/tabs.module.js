import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    tabs: []
  },
  mutations: {},
  actions: {
    async createTab ({ state }, { name, url, order }) {
      await Api.post(`${API_VERSION}/tab`, {
        data: { name, url, order }
      })
    },
    async getTabs ({ state }) {
      state.tabs = await Api.get(`${API_VERSION}/tabs`, {}).then(res => res.data) || {}
    },
    async removeTab ({ state }, id) {
      await Api.delete(`${API_VERSION}/tab`, {
        data: {
          tab_id: id
        }
      })
    },
    async updateTab ({ state }, { tab_id, name, url, order, schedule = '' }) {
      await Api.put(`${API_VERSION}/tab`, {
        data: {
          tab_id,
          name,
          order,
          schedule,
          url
        }
      })
    }
  }
}
