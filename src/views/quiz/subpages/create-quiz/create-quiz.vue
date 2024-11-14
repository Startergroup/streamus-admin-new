<template>
  <form
    class="tw-column-start tw-w-full tw-gap-12"
    @submit.stop="onSubmit"
  >
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-white">Создание квиза</h2>

      <div class="tw-flex tw-items-center tw-gap-4">
        <button-prime
          label="Сохранить"
          type="submit"
        />

        <router-link :to="{ name: 'quiz-list' }">
          <template #default>
            <button-prime
              outlined
              label="Отменить"
            />
          </template>
        </router-link>
      </div>
    </div>

    <div class="tw-flex tw-items-start tw-flex-wrap tw-w-full tw-gap-8">
      <div
        v-for="(item, index) in form"
        :key="index"
        :class="[
          'tw-column-start tw-gap-1',
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
          v-model="item.value"
          :invalid="Object.hasOwn(errors, item.name)"
          :name="item.name"
          :pt="inputPt"
          class="tw-bg-ink/darker tw-w-full"
        />

        <input-number
          v-if="item.props?.component === componentTypes.INPUT_NUMBER"
          v-model="item.value"
          :invalid="Object.hasOwn(errors, item.name)"
          :name="item.name"
          :class="[
            'tw-w-full [&_input]:tw-bg-ink/darker tw-min-h-[40px]',
            { '[&_input]:tw-border [&_input]:tw-border-red-400': Object.hasOwn(errors, item.name) }
          ]"
        />

        <textarea-prime
          v-if="item.props?.component === componentTypes.TEXTAREA"
          v-model="item.value"
          :invalid="Object.hasOwn(errors, item.name)"
          :name="item.name"
          :pt="textareaPt"
          :auto-resize="true"
          class="tw-w-full tw-bg-ink/darker tw-min-h-[140px] tw-resize-none"
        />

        <div
          v-if="item.props?.component === componentTypes.UPLOAD"
          class="tw-column-start tw-w-full tw-gap-2"
        >
          <file-upload
            :model-value="item.value"
            :name="`${item.name}[]`"
            mode="basic"
            :maxFileSize="1000000"
            @upload="onUpload"
          />

          <span
            v-if="Object.hasOwn(errors, item.name)"
            class="tw-text-sm tw-font-normal tw-text-red-400"
          >
            {{ errors[item.name] }}
          </span>
        </div>

        <color-picker
          v-if="item.props?.component === componentTypes.COLOR_PICKER"
          v-model="item.value"
          :inline="false"
          :pt="{ input: { class: 'tw-h-10 tw-w-10' } }"
        />

        <div
          v-if="item.props?.component === componentTypes.QUIZ_QUESTIONS"
          class="tw-column-start tw-w-full tw-gap-4"
        >
          <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
            <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">Вопросы</h2>

            <button-prime
              label="Добавить вопрос"
              outlined
              @click="appendQuestion"
            />
          </div>

          <pre>{{ item.value }}</pre>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import ButtonPrime from 'primevue/button'
import ColorPicker from 'primevue/colorpicker'
import FileUpload from 'primevue/fileupload'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import TextareaPrime from 'primevue/textarea'

import componentTypes from '@/constants/component-types'
import { inputPt, textareaPt } from '@/pt-options'
import * as yup from 'yup'
import { getForm } from '@/composables/form.composables'

export default {
  name: 'create-quiz',
  components: {
    ButtonPrime,
    ColorPicker,
    FileUpload,
    InputNumber,
    InputText,
    TextareaPrime
  },
  setup () {
    const { form, errors, handleSubmit } = getForm({
      items: [
        {
          name: 'quiz-name',
          props: {
            component: componentTypes.INPUT_TEXT,
            label: 'Название квиза',
            wrapperClasses: 'tw-w-[calc(50%-16px)]'
          }
        },
        {
          name: 'quiz-duration',
          props: {
            component: componentTypes.INPUT_NUMBER,
            label: 'Длительность квиза (в минутах)',
            wrapperClasses: 'tw-w-[calc(50%-16px)]'
          }
        },
        {
          name: 'introduction-text',
          props: {
            component: componentTypes.TEXTAREA,
            label: 'Текст приветствия',
            wrapperClasses: 'tw-w-full'
          }
        },
        {
          name: 'agreement-text',
          props: {
            component: componentTypes.TEXTAREA,
            label: 'Текст соглашения',
            wrapperClasses: 'tw-w-full'
          }
        },
        {
          name: 'quiz-bg-color',
          props: {
            component: componentTypes.COLOR_PICKER,
            label: 'Цвет фона квиза',
            wrapperClasses: 'tw-w-auto'
          }
        },
        {
          name: 'introduction-logo',
          props: {
            component: componentTypes.UPLOAD,
            label: 'Логотип для окна приветствия',
            wrapperClasses: 'tw-w-auto'
          }
        },
        {
          name: 'quiz-logo',
          props: {
            component: componentTypes.UPLOAD,
            label: 'Логотип для квиза',
            wrapperClasses: 'tw-w-auto'
          }
        },
        {
          name: 'questions',
          props: {
            component: componentTypes.QUIZ_QUESTIONS,
            wrapperClasses: 'tw-w-full'
          }
        }
      ],
      initialValues: {
        'quiz-bg-color': '#A78BFA',
        questions: []
      },
      validationSchema: yup.object().shape({
        'quiz-name': yup.string().required(),
        'introduction-text': yup.string().required(),
        'agreement-text': yup.string().required(),
        'quiz-duration': yup.number().required(),
        'introduction-logo': yup.string().required(),
        'quiz-logo': yup.string().required(),
        'quiz-bg-color': yup.string().required(),
        'questions': yup.array().required()
      })
    })
    const onUpload = (event) => {
      console.debug(event)
    }
    const onSubmit = handleSubmit((values) => {
      console.debug(values)
    })

    const appendQuestion = () => {
      form.value.questions.value.push({
        img: '',
        content: '',
        answers: [],
        free_answer: false
      })
    }

    return {
      appendQuestion,
      componentTypes,
      errors,
      form,
      inputPt,
      onSubmit,
      onUpload,
      textareaPt
    }
  }
}
</script>
