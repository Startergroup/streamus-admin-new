<template>
  <tab-view
    :active-index="active_chat_index"
    class="tw-w-full"
    :pt="tabViewPT"
    @update:active-index="onChangeActiveChat"
  >
    <tab-panel
      v-for="chat in chats"
      :key="chat?.id"
      :header="chat?.tab_name"
      :pt="tabPanelPT"
    >
      <div class="tw-column-start tw-w-full tw-gap-6">
        <message
          v-for="message in messages"
          :key="message?.uuid"
          :chat-id="chat?.id"
          :sender="message?.sender?.name"
          :sender-id="message?.sender_id"
          :text="message?.text"
          :timestamp="message?.timestamp"
          :uuid="message?.uuid"
        />
      </div>
    </tab-panel>
  </tab-view>
</template>

<script>
import Message from './components/message.vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import WSClient from '@/classes/WSClient'
import { API_VERSION, BASE_URL } from '@/api/api.config'
import { useStore } from 'vuex'
import { onMounted, onUnmounted, ref, computed } from 'vue'

export default {
  name: 'chats',
  components: {
    Message,
    TabPanel,
    TabView
  },
  setup () {
    const store = useStore()

    const user = computed(() => store.state.auth.user)

    const wsClient = new WSClient(`${BASE_URL}/${API_VERSION}/chat/message`)

    const chats = computed(() => store.state.chats?.chats.map(chat => ({
      ...chat,
      tab_name: store.state.tabs.tabs.find(tab => tab?.tab_id === chat?.tab_id)?.name
    })))
    const active_chat_index = ref(0)
    const onChangeActiveChat = (index) => {
      active_chat_index.value = index
      wsClient.send({
        init: true,
        tab_id: chats.value[active_chat_index.value]?.tab_id,
        user_id: user.value?.user_id
      })
    }

    const messages = computed(() => store.state.chats?.messages || [])

    const tabViewPT = {
      inkbar: 'tw-bg-primary/base',
      nav: 'tw-bg-transparent',
      navcontainer: 'tw-w-full tw-rounded-md tw-bg-ink/dark tw-overflow-hidden',
      root: 'tw-column-start tw-w-full tw-gap-4',
      panelcontainer: 'tw-w-full tw-max-h-[90vh] tw-min-h-[90vh] tw-overflow-y-auto tw-p-8 tw-rounded-md'
    }
    const tabPanelPT = computed(() => ({
      headeraction: ({ context }) => ({
        class: [
          'tw-transition-all tw-duration-300 tw-rounded-none',
          { 'tw-bg-primary/base': context.active }
        ]
      })
    }))

    onMounted(async () => {
      await store.dispatch('chats/getChats')
      await store.dispatch('tabs/getTabs')

      wsClient.connect()
      wsClient.on('open', () => {
        wsClient.send({
          init: true,
          tab_id: chats.value[active_chat_index.value]?.tab_id,
          user_id: user.value?.user_id
        })
      })
      wsClient.onMessage((data) => {
        if (data?.init) {
          store.commit('chats/SET_CHAT_ID', data?.id)
          store.commit('chats/SET_CHAT_MESSAGES', data?.messages || [])

          return
        }

        store.commit('chats/SET_CHAT_MESSAGES', data || [])
      })
    })

    onUnmounted(() => {
      wsClient.disconnect()
    })

    return {
      active_chat_index,
      chats,
      messages,
      onChangeActiveChat,
      tabPanelPT,
      tabViewPT
    }
  }
}
</script>
