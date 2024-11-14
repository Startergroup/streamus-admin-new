<template>
  <div class="tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-min-w-9 tw-min-h-9 tw-cursor-pointer tw-absolute tw-top-2 tw-right-2 tw-p-0 tw-opacity-100">
    <icon-base
      :icon="icons['x-close-big']"
      :width="10"
      :height="10"
      :view-box-size="[12, 12]"
    />
  </div>
</template>

<script>
import IconBase from '@/components/icon-base.vue'

import icons from '@/utils/icons'

export default {
  name: 'toast-close-button',
  components: {
    IconBase
  },
  setup () {
    return {
      icons
    }
  }
}
</script>
