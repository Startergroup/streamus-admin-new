<template>
  <div
    v-for="(item, index) in form"
    :key="index"
    :class="[
      'tw-column-start tw-gap-[6px] tw-relative',
      item.props?.wrapperClasses
    ]"
  >
    <span
      v-if="item.props?.label"
      class="tw-text-sm tw-font-normal tw-text-sky/white"
    >
      {{ item.props?.label }}
    </span>

    <input-text
      v-if="item.props?.component === componentTypes.INPUT_TEXT"
      :model-value="item.value"
      :invalid="Object.hasOwn(errors, item.name)"
      :name="item.name"
      :pt="inputPt"
      class="tw-bg-ink/darker tw-w-full"
      @update:model-value="$emit('update:form-data', { property: item.name, value: $event })"
    />

    <input-number
      v-if="item.props?.component === componentTypes.INPUT_NUMBER"
      :model-value="item.value"
      :invalid="Object.hasOwn(errors, item.name)"
      :name="item.name"
      :class="[
        'tw-w-full [&_input]:tw-bg-ink/darker tw-min-h-[40px]',
        { '[&_input]:tw-border [&_input]:tw-border-red-400': Object.hasOwn(errors, item.name) }
      ]"
      @update:model-value="$emit('update:form-data', { property: item.name, value: $event })"
    />

    <textarea-prime
      v-if="item.props?.component === componentTypes.TEXTAREA"
      :model-value="item.value"
      :invalid="Object.hasOwn(errors, item.name)"
      :name="item.name"
      :pt="textareaPt"
      :auto-resize="true"
      class="tw-w-full tw-bg-ink/darker tw-min-h-[140px] tw-resize-none"
      @update:model-value="$emit('update:form-data', { property: item.name, value: $event })"
    />

    <file-upload
      v-if="item.props?.component === componentTypes.UPLOAD"
      :model-value="item.value"
      :name="`${item.name}[]`"
      text="Картинка"
      @upload:file="onUploadImage({ file: $event, property: item.name })"
    />

    <color-picker
      v-if="item.props?.component === componentTypes.COLOR_PICKER"
      :model-value="item.value"
      :inline="false"
      :pt="{ input: { class: 'tw-h-9 tw-w-[116px]' } }"
      @update:model-value="$emit('update:form-data', { property: item.name, value: $event })"
    />

    <span
      v-if="Object.hasOwn(errors, item.name)"
      class="tw-text-sm tw-font-normal tw-text-red-400 tw-absolute tw-left-0 -tw-bottom-6"
    >
      {{ errors[item.name] }}
    </span>
  </div>
</template>

<script>
import ColorPicker from 'primevue/colorpicker'
import FileUpload from '@/components/file-upload.vue'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import TextareaPrime from 'primevue/textarea'
import Toast from '@/components/toast/toast-template.vue'

import componentTypes from '@/constants/component-types'
import { inputPt, textareaPt } from '@/pt-options'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'

export default {
  name: 'quiz-base-fields',
  components: {
    ColorPicker,
    FileUpload,
    InputNumber,
    InputText,
    TextareaPrime
  },
  props: {
    /**
     * @param { { [key]: string } } - Объект ошибок при валидации
     */
    errors: {
      type: Object,
      default: () => ({}),
      required: true
    },
    /**
     * @param { { name: string, value: any, props: {} }[] }
     */
    form: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  emits: ['update:form-data'],
  setup (_props, { emit }) {
    const store = useStore()
    const toast = useToast()

    const onUploadImage = async ({ file, property }) => {
      try {
        const { path = null, success = false } = await store.dispatch('common/uploadFile', file)

        if (success) {
          emit('update:form-data', { property, value: path })
          toast({
            component: Toast,
            props: {
              title: 'Успешно',
              message: 'Изображение было загружено'
            }
          }, {
            timeout: 5000
          })
        }
      } catch (error) {
        toast({
          component: Toast,
          props: {
            title: 'Ошибка',
            message: 'Изображение не было загружено'
          }
        }, {
          timeout: 5000
        })
      }
    }

    return {
      componentTypes,
      inputPt,
      onUploadImage,
      textareaPt
    }
  }
}
</script>
