<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-white">Квизы</h2>

      <router-link :to="{ name: 'create-quiz' }">
        <template #default>
          <button-prime label="Создать" />
        </template>
      </router-link>
    </div>

    <div class="tw-grid tw-grid-cols-1 min-[1180px]:tw-grid-cols-2 min-[1540px]:tw-grid-cols-3 min-[1920px]:tw-grid-cols-4 min-[2400px]:tw-grid-cols-5 tw-w-full tw-gap-6">
      <quiz-card
        v-for="quiz in quizzes"
        :key="quiz.quiz_id"
        :quiz="quiz"
      />
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import QuizCard from './components/quiz-card.vue'
import Toast from '@/components/toast/toast-template.vue'

import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'
import { onMounted, computed } from 'vue'

export default {
  name: 'list-quizzes',
  components: {
    ButtonPrime,
    QuizCard
  },
  setup () {
    const store = useStore()
    const toast = useToast()

    onMounted(async () => {
      try {
        await store.dispatch('quiz/getQuizzes')
      } catch (error) {
        console.error(error)
        toast({
          component: Toast,
          props: {
            title: 'Ошибка',
            message: 'Ошибка при получении списка квизов'
          }
        }, {
          timeout: 5000
        })
      }
    })

    const quizzes = computed(() => store.state.quiz?.quizzes || [])

    return {
      quizzes
    }
  }
}
</script>
