<template>
  <div class="tw-column-start tw-w-full tw-gap-8 tw-p-4 tw-rounded-[5px] tw-bg-ink/darker">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h3 class="tw-text-lg tw-font-normal tw-text-sky/white">
        {{ quiz.name }}
      </h3>

      <button-prime
        :loading="isLoadingReport"
        outlined
        label="Выгрузить отчет"
        @click="getReport(quiz.quiz_id)"
      />
    </div>

    <div class="tw-column-start tw-w-full tw-gap-6">
      <div class="tw-grid tw-grid-cols-2 tw-w-full tw-gap-4">
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="tw-column-start tw-w-full tw-gap-2"
        >
          <span class="tw-text-sm tw-font-normal tw-text-ink/lighter">
            {{ column.label }}
          </span>

          <input-switch
            v-if="column.property === 'is_active'"
            :model-value="quiz.is_active"
            @update:model-value="onChangeQuizActiveStatus({ quiz_id: quiz.quiz_id, value: $event })"
          />

          <span
            v-else-if="column.property === 'questions'"
            class="tw-text-base tw-font-normal tw-text-sky/white"
          >
            {{ quiz[column.property].length }}
          </span>

          <span
            v-else
            class="tw-text-base tw-font-normal tw-text-sky/white"
          >
            {{ quiz[column.property] }}
          </span>
        </div>
      </div>

      <div class="tw-column-start tw-w-full tw-gap-2">
        <span class="tw-text-sm tw-font-normal tw-text-ink/lighter">
          Приветственный текст
        </span>

        <span class="tw-text-base tw-font-normal tw-text-sky/white">
          {{ quiz.introduction_text }}
        </span>
      </div>
    </div>

    <div class="tw-grid tw-grid-cols-2 tw-w-full tw-gap-4">
      <router-link :to="{ name: 'edit-quiz', params: { id: quiz.quiz_id } }">
        <template #default>
          <button-prime
            class="tw-w-full"
            label="Редактировать"
          />
        </template>
      </router-link>

      <button-prime
        label="Удалить"
        class="tw-text-red-500"
        outlined
        @click="onRemoveQuiz(quiz.quiz_id)"
      />
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import Toast from '@/components/toast/toast-template.vue'

import GenerateXlsx from '@/utils/generate-xlsx'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

export default {
  name: 'quiz-card',
  components: {
    ButtonPrime,
    InputSwitch
  },
  props: {
    /**
     * @param {{
     *    name: string,
     *    is_active: boolean,
     *    introduction_text: string,
     *    introduction_img: string,
     *    duration: number,
     *    logo: string,
     *    agreement: string,
     *    background: string,
     *    questions: {
     *      img: string,
     *      content: string,
     *      answers: {
     *        content: string,
     *        img: string,
     *        is_right: boolean,
     *        is_free_answer: boolean
     *      }[],
     *      free_answer: boolean
     *    }[]
     *  }}
     */
    quiz: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  setup () {
    const store = useStore()
    const toast = useToast()

    const columns = [
      {
        label: 'ID',
        property: 'quiz_id'
      },
      {
        label: 'Продолжительность',
        property: 'duration'
      },
      {
        label: 'Кол-вопросов',
        property: 'questions'
      },
      {
        label: 'Активный',
        property: 'is_active'
      }
    ]
    const onChangeQuizActiveStatus = async ({ quiz_id, value }) => {
      try {
        const { success } = await store.dispatch('quiz/changeQuizActiveStatus', { quiz_id, value })

        if (success) {
          store.commit('quiz/updateQuizPropertyByID', {
            quiz_id,
            property: 'is_active',
            value
          })
          toast({
            component: Toast,
            props: {
              title: 'Успешно',
              message: 'Квиз был обновлен'
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
            message: 'Ошибка при обновлении квиза'
          }
        }, {
          timeout: 5000
        })
      }
    }
    const onRemoveQuiz = async (quiz_id) => {
      try {
        const { success } = await store.dispatch('quiz/removeQuiz', quiz_id)

        if (success) {
          toast({
            component: Toast,
            props: {
              title: 'Успешно',
              message: `Квиз с id ${quiz_id} был удален`
            }
          }, {
            timeout: 5000
          })
        } else {
          throw Error
        }
      } catch (error) {
        toast({
          component: Toast,
          props: {
            title: 'Ошибка',
            message: 'Ошибка при удалении квиза'
          }
        }, {
          timeout: 5000
        })
      }
    }

    const isLoadingReport = ref(false)
    const getReport = async (quiz_id) => {
      try {
        isLoadingReport.value = true

        const { data } = await store.dispatch('quiz/getQuizReport', quiz_id)
        const columns = [
          { header: 'Ключ', key: 'code' },
          { header: 'Имя пользователя', key: 'username' },
          { header: 'Email', key: 'email' },
          { header: 'Очки', key: 'points' },
          { header: 'Время', key: 'time' }
        ]
        const xlsx = new GenerateXlsx(columns, data)
        const sheet = xlsx.createSimpleSheet()
        const filename = xlsx.createFilename(`Отчет по квизу ID: ${quiz_id}`)

        await xlsx.generateXlsx(filename, 'Отвечт по квизу', sheet)
      } finally {
        isLoadingReport.value = false
      }
    }

    return {
      columns,
      getReport,
      isLoadingReport,
      onChangeQuizActiveStatus,
      onRemoveQuiz
    }
  }
}
</script>
