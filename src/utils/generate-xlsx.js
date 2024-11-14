import exceljs from 'exceljs'
import { saveAs } from 'file-saver'

class GenerateXlsx {
  constructor (headers = null, items = null) {
    this.headers = headers
    this.items = items
  }

  createFilename (name) {
    return `${name}_${new Date().toLocaleString().slice(0, 10)}.xlsx`
  }

  createSimpleSheet (key = 'key') {
    const formattedCells = this.items.map(item => this.headers.map(header => item[header[key]]))

    return {
      columns: this.headers,
      cells: formattedCells
    }
  }

  async generateXlsx (filename, worksheetName = 'List 1', { columns, cells }) {
    const workbook = new exceljs.Workbook()
    const worksheet = workbook.addWorksheet(worksheetName)

    worksheet.columns = columns
    worksheet.addRows(cells)

    const file = await workbook.xlsx.writeBuffer()
    const fileType = 'application/vnd.openxmlformats-officedocuments.spreadsheetml.sheet'
    const blob = new Blob([file], { type: fileType })

    await saveAs(blob, filename)
  }
}
export default GenerateXlsx
