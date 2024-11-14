<template>
  <vue-final-modal
    class="tw-flex tw-items-center tw-justify-center"
    content-transition="fade"
    content-class="tw-column-start tw-w-full tw-max-w-[640px] tw-bg-ink/darker dark:tw-bg-ink/darker tw-rounded-lg tw-px-6 tw-py-10 tw-gap-6 tw-relative"
    overlay-transition="fade"
    @closed="$emit('update:model-value', false)"
  >
    <template #default>
      <form
        class="tw-column-start tw-w-full tw-gap-8"
        @submit.prevent="onSubmit"
      >
        <h2 class="tw-text-xl tw-font-medium tw-text-sky/white">
          Добавление ключа
        </h2>

        <div class="tw-flex tw-items-center tw-w-full tw-gap-3">
          <div
            v-for="(item, index) in form"
            :key="index"
            class="tw-column-start tw-w-full tw-gap-1"
          >
            <input-text
              :name="item.name"
              :model-value="item.value"
              :class="[
                'tw-min-h-[40px] tw-w-full',
                { '[&_input]:tw-border [&_input]:tw-border-red-400': Object.hasOwn(errors, item.name) }
              ]"
              :placeholder="item.props.placeholder"
              @update:model-value="item.value = $event"
            />

            <span
              v-if="Object.hasOwn(errors, item.name)"
              class="tw-text-sm tw-font-normal tw-text-red-400"
            >
              {{ errors[item.name] }}
            </span>
          </div>
        </div>

        <button-prime
          type="submit"
          class="tw-ml-auto"
          label="Сгенерировать"
        />
      </form>

      <div
        class="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-rounded-full tw-cursor-pointer tw-absolute tw-top-6 tw-right-6"
        @click="$emit('update:model-value', false)"
      >
        <icon-base
          :icon="icons['x-close-big']"
          :width="10"
          :height="10"
          :view-box-size="[12, 12]"
          classes="tw-h-4 tw-w-4 dark:[&_path]:tw-stroke-white"
        />
      </div>
    </template>
  </vue-final-modal>
</template>

<script>
import ButtonPrime from 'primevue/button'
import IconBase from '@/components/icon-base.vue'
import InputText from 'primevue/inputnumber'
import { VueFinalModal } from 'vue-final-modal'

import icons from '@/utils/icons'
import * as yup from 'yup'
import { getForm } from '@/composables/form.composables'

export default {
  name: 'generate-codes-modal',
  components: {
    ButtonPrime,
    IconBase,
    InputText,
    VueFinalModal
  },
  props: {
    onCreateCode: {
      type: Function,
      default: () => {
        console.debug('No event handler')
      }
    }
  },
  emits: ['update:model-value'],
  setup (props, { emit }) {
    const { form, errors, handleSubmit } = getForm({
      items: [
        {
          name: 'code',
          props: {
            placeholder: 'Введите ключ'
          }
        }
      ],
      initialValues: {},
      validationSchema: yup.object().shape({
        'code': yup.string().required('Это обязательное поле')
      })
    })
    const onSubmit = handleSubmit(async ({ code }) => {
      await props.onCreateCode(code)
      emit('update:model-value', false)
    })

    return {
      errors,
      form,
      icons,
      onSubmit
    }
  }
}
</script>
