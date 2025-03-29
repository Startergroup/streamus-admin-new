<template>
  <form
    class="tw-column-start tw-w-full tw-gap-12"
    @submit.stop="onSubmit"
  >
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-white">
        Создание квиза
      </h2>

      <div class="tw-flex tw-items-center tw-gap-4">
        <button-prime
          label="Сохранить"
          type="submit"
        />

        <router-link :to="{ name: 'quizzes' }">
          <template #default>
            <button-prime
              outlined
              label="Отменить"
            />
          </template>
        </router-link>
      </div>
    </div>

    <div class="tw-flex tw-items-end tw-flex-wrap tw-w-full tw-gap-8">
      <quiz-base-fields
        :form="form"
        :errors="errors"
        @update:form-data="onUpdateFormData"
      />

      <quiz-question-module />
    </div>
  </form>
</template>

<script>
import ButtonPrime from 'primevue/button'
import QuizBaseFields from './modules/quiz-base-fields.vue'
import QuizQuestionModule from './modules/quiz-question-module.vue'
import Toast from '@/components/toast/toast-template.vue'

import * as yup from 'yup'
import componentTypes from '@/constants/component-types'
import { getForm } from '@/composables/form.composables'
import { useStore } from 'vuex'
import { onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'create-quiz',
  components: {
    ButtonPrime,
    QuizBaseFields,
    QuizQuestionModule
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const toast = useToast()

    const isEditable = computed(() => Object.hasOwn(route.params, 'id'))

    onMounted(async () => {
      if (isEditable.value) {
        if (!store.state.quiz.quizzes.length) {
          await store.dispatch('quiz/getQuizzes')
        }

        const targetQuiz = store.state.quiz.quizzes.find(quiz => parseInt(quiz.quiz_id) === parseInt(route.params.id))
        store.commit('quiz/setQuiz', targetQuiz)

        for (const key in form.value) {
          form.value[key].value = targetQuiz[key]
        }
      } else {
        store.commit('quiz/initializeQuiz')
      }
    })

    const { form, errors, handleSubmit } = getForm({
      items: [
        {
          name: 'name',
          props: {
            component: componentTypes.INPUT_TEXT,
            label: 'Название квиза',
            wrapperClasses: 'tw-w-[calc(50%-16px)]'
          }
        },
        {
          name: 'duration',
          props: {
            component: componentTypes.INPUT_NUMBER,
            label: 'Длительность квиза (в минутах)',
            wrapperClasses: 'tw-w-[calc(50%-16px)]'
          }
        },
        {
          name: 'agreement',
          props: {
            component: componentTypes.TEXTAREA,
            label: 'Текст соглашения',
            wrapperClasses: 'tw-w-full'
          }
        },
        {
          name: 'background',
          props: {
            component: componentTypes.COLOR_PICKER,
            label: 'Цвет фона квиза',
            wrapperClasses: 'tw-w-auto'
          }
        },
        {
          name: 'logo',
          props: {
            component: componentTypes.UPLOAD,
            label: 'Логотип для квиза',
            wrapperClasses: 'tw-w-auto'
          }
        },
        {
          name: 'introduction_img',
          props: {
            component: componentTypes.UPLOAD,
            label: 'Логотип для окна приветствия',
            wrapperClasses: 'tw-w-auto'
          }
        },
        {
          name: 'introduction_text',
          props: {
            component: componentTypes.TEXTAREA,
            label: 'Текст приветствия',
            wrapperClasses: 'tw-w-full'
          }
        }
      ],
      initialValues: {
        background: '#219ab8',
        logo: '',
        introduction_img: ''
      },
      validationSchema: yup.object().shape({
        name: yup.string().required('Required'),
        agreement: yup.string(),
        introduction_text: yup.string().required('Required'),
        duration: yup.number().required('Required'),
        introduction_img: yup.string(),
        logo: yup.string().required('Required'),
        background: yup.string().required('Required')
      })
    })
    const onUpdateFormData = ({ property = null, value = null }) => {
      if (property === null || value === null) return

      form.value[property].value = value
      store.commit('quiz/updateQuizProperty', { property, value })
    }
    const onSubmit = handleSubmit(async () => {
      try {
        if (isEditable.value) {
          const { success } = await store.dispatch('quiz/updateQuiz')

          if (success) {
            toast({
              component: Toast,
              props: {
                title: 'Успешно',
                message: 'Квиз был сохранен'
              }
            }, {
              timeout: 5000
            })
            await router.push({ name: 'quizzes' })
          } else {
            throw new Error('Ошибка')
          }
        } else {
          const { success } = await store.dispatch('quiz/createQuiz')

          if (success) {
            toast({
              component: Toast,
              props: {
                title: 'Успешно',
                message: 'Квиз был сохранен'
              }
            }, {
              timeout: 5000
            })
            await router.push({ name: 'quizzes' })
          } else {
            throw new Error('Ошибка')
          }
        }
      } catch (error) {
        toast({
          component: Toast,
          props: {
            title: 'Непредвиденная ошибка',
            message: 'Квиз не был сохранен'
          }
        }, {
          timeout: 5000
        })
      }
    })

    return {
      errors,
      form,
      onSubmit,
      onUpdateFormData
    }
  }
}
</script>
