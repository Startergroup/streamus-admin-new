import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    schedule: {},
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
    },
    async deleteLecture ({ state }, id) {
      await Api.delete(`${API_VERSION}/lecture`, {
        data: {
          id
        }
      })
    },
    async deleteSchedule ({ state }, id) {
      await Api.delete(`${API_VERSION}/schedule`, {
        data: {
          id
        }
      })
    },
    async getScheduleById ({ state }, id) {
      const { schedule = {} } = await Api.get(`${API_VERSION}/schedule`, {
        id
      }) || {}

      state.schedule = schedule
    },
    async getSchedules ({ state }) {
      const { schedules = [] } = await Api.get(`${API_VERSION}/schedules`) || {}
      state.schedules = schedules
    },
    async updateSchedule ({ state }, { schedule_id = null, date = null, lectures = null }) {
      await Api.put(`${API_VERSION}/schedule`, {
        data: {
          schedule_id,
          date,
          lectures
        }
      })
    }
  }
}
