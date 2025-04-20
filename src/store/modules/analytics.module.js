import Api from '@/api/api'
import GenerateXlsx from '@/utils/generate-xlsx'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  actions: {
    async downloadAnalyticsById () {
      try {
        const { success = false, views = [] } = await Api.get(`${API_VERSION}/analytics/section-views`)

        if (!success) {
          return
        }

        const columns = [
          { header: 'ID Секции', key: 'tab_id' },
          { header: 'Название секции', key: 'tab_name' },
          { header: 'Кол-во просмотров', key: 'views' }
        ]
        const xlsx = new GenerateXlsx(columns, views)
        const sheet = xlsx.createSimpleSheet()
        const filename = xlsx.createFilename('Отчет о просмотрах')

        await xlsx.generateXlsx(filename, 'Отчет о просмотрах', sheet)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
