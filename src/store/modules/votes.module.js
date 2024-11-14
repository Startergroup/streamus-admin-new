import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    votes: []
  },
  actions: {
    async createVote ({ state }, { presentations, tabId, tabName }) {
      await Api.post(`${API_VERSION}/vote`, {
        data: {
          presentations,
          tab_id: tabId,
          tab_name: tabName
        }
      })
    },
    async generateReport ({ state }, id) {
      return await Api.get(`${API_VERSION}/vote/report`, {
        vote_id: id
      })
    },
    async getVotes ({ state }, params = {}) {
      state.votes = await Api.get(`${API_VERSION}/vote`, params).then(res => res?.data || [])
    },
    async removeVote ({ state }, id) {
      await Api.delete(`${API_VERSION}/vote`, {
        data: {
          vote_id: id
        }
      })
    }
  }
}
