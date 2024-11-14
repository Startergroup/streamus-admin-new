<template>
  <div class="tw-column-start">
    <div class="tw-column-start tw-flex tw-flex-col tw-gap-1">
      <span class="tw-text-sm tw-font-bold tw-text-sky/white">{{ title }}</span>

      <span class="tw-text-sm tw-font-normal tw-text-sky/white">{{ message }}</span>
    </div>

    <div class="tw-flex tw-gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'toast-template',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    icon: {
      type: Object,
      default: () => ({
        name: 'fi-rr-check1',
        width: 10,
        height: 10,
        viewBoxSize: [16, 16],
        fill: 'white'
      })
    },
    bgIconColor: {
      type: String,
      default: 'tw-bg-orange tw-border-[#FFD6CC]',
      required: false
    }
  },
  emits: ['close']
}
</script>
