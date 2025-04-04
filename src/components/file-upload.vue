<template>
  <label v-if="isEmpty(filename)">
    <input
      type="file"
      class="tw-hidden"
      @change="onUploadFile"
    >

    <span class="p-button p-component tw-max-h-9">
      <slot name="button">
        <span class="tw-text-base tw-font-medium tw-text-ink/darker">
          {{ text }}
        </span>
      </slot>
    </span>
  </label>

  <div
    v-else
    class="tw-flex tw-items-center tw-gap-3 p-button p-component tw-max-h-9"
  >
    <span class="tw-text-base tw-font-medium tw-text-ink/darker">
      {{ filename }}
    </span>

    <icon-base
      :icon="icons['x-close-big']"
      :width="14"
      :height="14"
      :view-box-size="[12, 12]"
      stroke="#202325"
      stroke-width="1.66667"
      stroke-linejoin="round"
      stroke-linecap="round"
      @click="onRemoveFile"
    />
  </div>
</template>

<script>
import IconBase from '@/components/icon-base.vue'

import icons from '@/utils/icons'
import { ref, toRefs, watch } from 'vue'
import { isEmpty } from 'lodash'

export default {
  name: 'file-upload',
  components: {
    IconBase
  },
  props: {
    /**
     * @param file - имя файла, а не сам файл
     */
    file: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  emits: ['upload:file', 'remove:file'],
  setup (props, { emit }) {
    const { file } = toRefs(props)

    const filename = ref(null)
    const onUploadFile = ({ target = null } = {}) => {
      if (!target) return

      const files = target?.files && target.files[0]

      if (!files) return

      filename.value = files?.name === filename.value ? null : files?.name
      emit('upload:file', files)
    }
    const onRemoveFile = () => {
      emit('remove:file')
      filename.value = ''
    }

    watch(
      () => file.value,
      (value) => {
        if (isEmpty(value)) return
        filename.value = value
      },
      { immediate: true }
    )

    return {
      filename,
      icons,
      isEmpty,
      onRemoveFile,
      onUploadFile
    }
  }
}
</script>
