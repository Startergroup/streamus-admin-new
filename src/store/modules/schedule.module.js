import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    schedule: {},
    schedules: [],
    votes: []
  },
  actions: {
    async createSchedule ({ state }, { date = null, section: { section_name, section_id, }, lectures = [] }) {
      if (!(date && lectures.length)) {
        return
      }

      await Api.post(`${API_VERSION}/schedule`, {
        data: {
          date,
          section_name,
          section_id,
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
    async getVoteReport ({ state }, { start, end }) {
      return await Api.get(`${API_VERSION}/vote/report`, { start, end })
    },
    async getVoteReportBySection ({ state }, id) {
      return await Api.get(`${API_VERSION}/vote/report-by-section`, { id })
    },
    async updateSchedule ({ state }, { schedule_id = null, date = null, section: { section_name, section_id, }, lectures = null }) {
      await Api.put(`${API_VERSION}/schedule`, {
        data: {
          schedule_id,
          date,
          section_name,
          section_id,
          lectures
        }
      })
    }
  }
}
