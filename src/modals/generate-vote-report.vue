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
          Отчет по голосованиям
        </h2>

        <pre>{{ errors }}</pre>

        <calendar
          v-model="form.date.value"
          :placeholder="form.date.props.placeholder"
          :selection-mode="form.date.props.selectionMode"
          :date-format="form.date.props.dateFormat"
          class="tw-w-full"
        />

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
import Calendar from 'primevue/calendar'
import IconBase from '@/components/icon-base.vue'
import { VueFinalModal } from 'vue-final-modal'

import * as yup from 'yup'
import icons from '@/utils/icons'
import { getForm } from '@/composables/form.composables'

export default {
  name: 'generate-vote-report',
  components: {
    ButtonPrime,
    Calendar,
    IconBase,
    VueFinalModal
  },
  props: {
    onGenerateReport: {
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
          name: 'date',
          props: {
            dateFormat: 'dd.mm.yy',
            placeholder: 'Диапозон дат',
            selectionMode: 'range'
          }
        }
      ],
      initialValues: {
        date: [new Date(), new Date()]
      },
      validationSchema: yup.object().shape({
        date: yup.array().required('Это обязательное поле')
      })
    })
    const onSubmit = handleSubmit(async ({ date }) => {
      await props.onGenerateReport(date)
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
