<template>
  <div class="tw-column-start tw-w-auto tw-min-w-[240px] tw-px-4 tw-py-3 tw-gap-4 tw-rounded-md tw-bg-ink/dark tw-relative">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <span class="tw-text-base tw-font-medium tw-text-primary/light">
        {{ sender }}
      </span>

      <span class="tw-text-sm tw-font-normal tw-text-sky/light">
        {{ dayjs(timestamp).format('HH:mm') }}
      </span>
    </div>

    <p class="tw-text-base tw-font-normal tw-text-sky/white">
      {{ text }}
    </p>

    <div
      :class="[
        'tw-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-rounded-full tw-bg-red-400',
        'tw-absolute -tw-top-3 -tw-right-3 tw-cursor-pointer',
        'tw-transition-all tw-duration-300 hover:tw-bg-red-500'
      ]"
      @click="onRemoveMessage({ chat_id: chatId, uuid })"
    >
      <icon-base
        :icon="icons['fi-rr-trash']"
        :width="16"
        :height="16"
        :view-box-size="[16, 16]"
      />
    </div>
  </div>
</template>

<script>
import IconBase from '@/components/icon-base.vue'

import dayjs from 'dayjs'
import icons from '@/utils/icons'
import { useStore } from 'vuex'

export default {
  name: 'message',
  components: {
    IconBase
  },
  props: {
    chatId: {
      type: Number,
      required: true
    },
    sender: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    timestamp: {
      type: String,
      required: true
    },
    uuid: {
      type: String,
      default: '',
      required: true
    }
  },
  setup () {
    const store = useStore()

    const onRemoveMessage = async ({ chat_id, uuid }) => {
      await store.dispatch('chats/removeMessage', {
        chat_id,
        uuid
      })
    }

    return {
      dayjs,
      icons,
      onRemoveMessage
    }
  }
}
</script>
