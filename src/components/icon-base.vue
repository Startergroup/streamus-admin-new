<template>
  <div
    class="tw-inline-block"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
      :viewBox="`0 0 ${viewBoxSize[0]} ${viewBoxSize[1]}`"
      role="presentation"
      :class="classes"
    >
      <title :lang="lang">
        {{ title }}
      </title>

      <g
        v-if="isIconFromArray"
        :fill="fill"
      >
        <path
          v-for="path in getIcon"
          :key="path"
          :d="path"
          :fill="fill"
          :stroke="stroke"
          :stroke-width="strokeWidth"
          :stroke-linecap="strokeLinecap"
          :stroke-linejoin="strokeLinejoin"
        />
      </g>

      <g
        v-else
        :fill="fill"
        v-html="getIcon"
      />
    </svg>
  </div>
</template>

<script>
import { computed, toRefs, ref } from 'vue'

export default {
  name: 'icon-base',
  props: {
    classes: {
      type: [String, Array],
      default: () => []
    },
    /**
     * Цвет заливки
     */
    fill: {
      type: String,
      default: 'currentColor'
    },
    /**
     * Высота иконки
     */
    height: {
      type: [Number, String],
      default: 18
    },
    hoverIcon: {
      type: [String, Array, null],
      default: null
    },
    /**
     * Иконка
     */
    icon: {
      type: [String, Array],
      default: ''
    },
    lang: {
      type: String,
      default: 'eng'
    },
    /**
     * Цвет обводки
     */
    stroke: {
      type: String,
      default: ''
    },
    strokeLinecap: {
      type: String,
      default: ''
    },
    strokeLinejoin: {
      type: String,
      default: ''
    },
    /**
     * Ширина обводки
     */
    strokeWidth: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    viewBoxSize: {
      type: Array,
      default: () => [24, 24]
    },
    /**
     * Ширина иконки
     */
    width: {
      type: [Number, String],
      default: 18
    }
  },
  setup (props) {
    const { icon, hoverIcon } = toRefs(props)

    const isHover = ref(false)
    const isIconFromArray = computed(() => Array.isArray(icon.value))
    const getIcon = computed(() => {
      if (!hoverIcon.value) {
        return icon.value
      }

      return isHover.value ? hoverIcon.value : icon.value
    })

    return {
      getIcon,
      isHover,
      isIconFromArray
    }
  }
}
</script>
