import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    active_chat_id: null,
    chats: [],
    messages: []
  },
  mutations: {
    SET_CHAT_ID (state, id) {
      state.active_chat_id = id
    },
    SET_CHAT_MESSAGES (state, messages) {
      state.messages = messages
    }
  },
  actions: {
    async getChats ({ state }) {
      try {
        const { success = false, data = {} } = await Api.get(`${API_VERSION}/chats`) || {}

        if (!success) return

        state.chats = data?.chats || []
      } catch (error) {
        console.error(error)
      }
    },
    async removeMessage ({ state }, { chat_id, uuid }) {
      try {
        await Api.delete(`${API_VERSION}/chat/message`, {
          data: {
            chat_id,
            uuid
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
