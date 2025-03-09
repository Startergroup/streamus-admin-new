import { createStore } from 'vuex'
import Api from '@/api/api'
import {API_VERSION, BASE_URL} from '@/api/api.config'

import auth from './modules/auth.module'
import codes from './modules/codes.module'
import settings from './modules/settings.module'
import schedule from './modules/schedule.module'
import tabs from './modules/tabs.module'

export default createStore({
  actions: {
    async uploadFile ({ _state }, file) {
      try {
        const formData = new FormData()

        formData.append('file', file)

        const { success, data: { name, path } } = await Api.post(`${API_VERSION}/file`, {
          data: formData
        })

        if (!success) return null

        return {
          success,
          name,
          path
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  modules: {
    auth,
    codes,
    schedule,
    settings,
    tabs
  }
})
