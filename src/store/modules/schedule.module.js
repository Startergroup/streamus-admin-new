import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    schedules: []
  },
  actions: {
    async createSchedule ({ state }, { date = null, lectures = [] }) {
      if (!(date && lectures.length)) {
        return
      }

      await Api.post(`${API_VERSION}/schedule`, {
        data: {
          date,
          lectures
        }
      })
    }
  }
}
