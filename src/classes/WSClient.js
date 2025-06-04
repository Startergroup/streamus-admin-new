class WSClient {
  /**
   * @param { string } url - WebSocket server URL
   * @param { object } [options] - Доп опции:
   * - reconnectionInterval: интервал переподключения в мс (по дефолту 3000)
   * - maxReconnectionAttempts: максимальное кол-во попыток переподключения (по умолчанию 5)
   */
  constructor (url, options = {}) {
    this.url = url
    this.options = {
      reconnectionInterval: 3000,
      maxReconnectionAttempts: 5,
      ...options
    }
    this.socket = null
    this.reconnectionAttempts = 0
    this.messageListeners = new Set()
    this.eventListeners = {
      open: new Set(),
      close: new Set(),
      error: new Set()
    }
  }

  /**
   * Подключение к серверу
   */
  connect () {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = (event) => {
      console.debug('Websocket connected')
      this.reconnectionAttempts = 0
      this._emitEvent('open', event)
    }

    this.socket.onmessage = (event) => {
      let data

      try {
        data = JSON.parse(event.data)
      } catch (error) {
        data = event?.data
      }

      this._notifyMessageListeners(data)
    }

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected')
      this._emitEvent('close', event)
      this._handleReconnect()
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      this._emitEvent('error', error)
    }
  }

  /**
   * Отправка сообщений
   * @param { any } data - Данные для отправки
   */
  send (data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = typeof data === 'object' ? JSON.stringify(data) : data
      this.socket.send(message)
    } else {
      console.error('WebSocket is not connected')
    }
  }

  /**
   * Закрытие соединения
   */
  disconnect () {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  /**
   * Добавление слушателя сообщений
   * @param { function } callback
   */
  onMessage (callback) {
    this.messageListeners.add(callback)
  }

  /**
   * Удаление слушателя сообщений
   * @param { function } callback
   */
  offMessage (callback) {
    this.messageListeners.delete(callback)
  }

  /**
   * Добавление слушателя событий
   * @param { 'open' | 'close' | 'error' } event
   * @param { function } callback
   */
  on (event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].add(callback)
    }
  }

  /**
   * Удаление слушателя событий
   * @param { 'open' | 'close' | 'error'} event
   * @param { function } callback
   */
  off (event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].delete(callback)
    }
  }

  // Приватные методы
  _notifyMessageListeners (data) {
    this.messageListeners.forEach(callback => callback(data))
  }

  _emitEvent (event, data) {
    this.eventListeners[event].forEach(callback => callback(data))
  }

  _handleReconnect () {
    if (this.reconnectionAttempts < this.options.maxReconnectionAttempts) {
      this.reconnectionAttempts++
      console.log(`Attempting to reconnect (${this.reconnectionAttempts}/${this.options.maxReconnectionAttempts})...`)
      setTimeout(() => this.connect(), this.options.reconnectionInterval)
    } else {
      console.log('Max reconnect attempts reached')
    }
  }
}

export default WSClient
