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
    async updateSettings ({ state }, { title_ru, subtitle_ru, title_en, subtitle_en, favicon = null }) {
      await Api.put(`${API_VERSION}/settings`, {
        data: {
          settings_id: state.settings.settings_id,
          title_ru,
          subtitle_ru,
          title_en,
          subtitle_en,
          favicon
        }
      })
    }
  }
}
