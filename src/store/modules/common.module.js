import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
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
  }
}
