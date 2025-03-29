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
          Добавление голосования
        </h2>

        <div class="tw-column-start tw-items-center tw-w-full tw-gap-4">
          <div
            v-for="(item, index) in form"
            :key="index"
            class="tw-column-start tw-w-full tw-gap-4"
          >

            <div
              v-if="item.props?.component === componentTypes.INPUT_TEXT"
              class="tw-column-start tw-w-full tw-gap-2"
            >
              <input-text
                v-for="(input, key) in item.value"
                :key="key"
                :name="item.name"
                :model-value="input.name"
                :class="[
                  'tw-min-h-[40px] tw-w-full',
                  { 'tw-border tw-border-red-400': !input?.name.length }
                ]"
                :placeholder="item.props.placeholder"
                @update:model-value="input.name = $event"
              />
            </div>

            <div
              v-if="item.props?.component === componentTypes.SELECT_BUTTON"
              class="tw-column-start tw-w-full tw-gap-3"
            >
              <h2 class="tw-text-lg tw-font-medium tw-text-sky/white">{{ item.props?.label }}</h2>

              <div class="tw-column-start tw-w-full tw-gap-1">
                <select-button
                  v-model="item.value"
                  :options="tabs"
                  option-label="name"
                  :option-value="null"
                />

                <span
                  v-if="Object.hasOwn(errors, item.name)"
                  class="tw-text-sm tw-font-normal tw-text-red-400"
                >
                  {{ errors[item.name] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-items-center tw-justify-end tw-w-full tw-gap-3">
          <button-prime
            type="submit"
            class="tw-ml-auto"
            label="Сохранить"
          />

          <button-prime
            outlined
            class=""
            label="Добавить доклад"
            @click="onAppendPresentation"
          />
        </div>
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
          stroke="#FFF"
          stroke-width="1.66667"
          stroke-linejoin="round"
          stroke-linecap="round"
          classes="tw-h-4 tw-w-4 dark:[&_path]:tw-stroke-white"
        />
      </div>
    </template>
  </vue-final-modal>
</template>

<script>
import ButtonPrime from 'primevue/button'
import IconBase from '@/components/icon-base.vue'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import { VueFinalModal } from 'vue-final-modal'

import componentTypes from '@/constants/component-types'
import icons from '@/utils/icons'
import * as yup from 'yup'
import { getForm } from '@/composables/form.composables'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'create-code-modal',
  components: {
    ButtonPrime,
    IconBase,
    InputText,
    SelectButton,
    VueFinalModal
  },
  props: {
    onCreateVote: {
      type: Function,
      default: () => {
        console.debug('No event handler')
      }
    }
  },
  emits: ['update:model-value'],
  setup (props, { emit }) {
    const store = useStore()

    onMounted(async () => {
      await store.dispatch('tabs/getTabs')
    })

    const tabs = computed(() => store.state.tabs?.tabs || [])

    const { form, errors, handleSubmit } = getForm({
      items: [
        {
          name: 'section',
          props: {
            component: componentTypes.SELECT_BUTTON,
            label: 'Выберите секцию'
          }
        },
        {
          name: 'presentations',
          props: {
            component: componentTypes.INPUT_TEXT,
            placeholder: 'Название доклада'
          }
        }
      ],
      initialValues: {
        presentations: [{ name: '' }]
      },
      validationSchema: yup.object().shape({
        section: yup.object().required('Выберите хотя бы одну секцию'),
        presentations: yup.array().required('Это обязательное поле')
      })
    })
    const onSubmit = handleSubmit(async ({ presentations, section }) => {
      if (presentations.some(item => !item.name.length)) return

      await props.onCreateVote({
        presentations,
        tabId: section?.tab_id,
        tabName: section?.name
      })
      emit('update:model-value', false)
    })

    const onAppendPresentation = () => {
      form.value.presentations.value.push({ name: '' })
    }

    return {
      componentTypes,
      errors,
      form,
      icons,
      onAppendPresentation,
      onSubmit,
      tabs
    }
  }
}
</script>
