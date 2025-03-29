<template>
  <div class="tw-column-start tw-w-full">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full tw-bg-ink/darkest tw-sticky tw-top-0 tw-z-10 tw-py-12">
      <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">
        Вопросы
      </h2>

      <button-prime
        label="Добавить вопрос"
        outlined
        @click="appendQuestion"
      />
    </div>

    <div
      v-if="questions.length"
      class="tw-column-start tw-w-full tw-gap-12"
    >
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="tw-column-start tw-w-full tw-gap-8 tw-pb-12 tw-border-b tw-border-ink/base last:tw-border-none"
      >
        <!-- Тело вопроса -->
        <div class="tw-column-start tw-w-full tw-gap-4">
          <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
            <div class="tw-flex tw-items-center tw-gap-4">
              <span class="tw-text-base tw-font-medium tw-text-white">
                Вопрос {{ index + 1 }}
              </span>

              <label class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
                <checkbox
                  :model-value="question.free_answer"
                  :binary="true"
                  :pt="checkboxPt"
                  @update:model-value="onChangeQuestionAnswerType({ questionIndex: index, isFree: $event })"
                />

                <span>
                  Свободный ответ
                </span>
              </label>
            </div>

            <div class="tw-flex tw-items-center tw-gap-4">
              <button-prime
                v-if="!question.free_answer"
                label="Добавить ответ"
                @click="appendAnswer(index)"
              />

              <file-upload
                :model-value="question.img"
                text="Картинка"
                @upload:file="onUploadQuestionImage({ file: $event, index })"
                @remove:file="onRemoveQuestionImage(index)"
              />

              <button-prime
                label="Удалить"
                class="tw-bg-red-500 tw-text-white"
                @click="removeQuestion(index, question?.question_id)"
              />
            </div>
          </div>

          <textarea-prime
            :model-value="question.content"
            :auto-resize="true"
            class="tw-w-full tw-bg-ink/darker tw-min-h-[80px] tw-resize-none"
            @update:model-value="updateQuestionData({ index, property: 'content', value: $event })"
          />
        </div>

        <!-- Тело ответа -->
        <div
          v-for="(answer, key) in question.answers"
          :key="key"
          class="tw-column-start tw-w-full tw-gap-4 tw-pl-8"
        >
          <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
            <div class="tw-flex tw-items-center tw-gap-4">
              <span class="tw-text-base tw-font-medium tw-text-white">
                Ответ {{ answer.is_free_answer ? '' : key + 1 }}
              </span>

              <label class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
                <checkbox
                  :model-value="answer.is_right"
                  :binary="true"
                  :pt="checkboxPt"
                  @update:model-value="updateAnswerData({ question_index: index, answer_index: key, property: 'is_right', value: $event })"
                />

                <span>
                  Правильный ответ
                </span>
              </label>
            </div>

            <div class="tw-flex tw-items-center tw-gap-4">
              <file-upload
                :model-value="null"
                text="Картинка"
                @upload:file="onUpdateAnswerImage({ question_index: index, answer_index: key, file: $event })"
                @remove:file="onRemoveAnswerImage({ question_index: index, answer_index: key })"
              />

              <button-prime
                label="Удалить"
                class="tw-bg-red-500 tw-text-white"
                @click="removeAnswer({ question_index: index, answer_index: key, answer_id: answer?.answer_id, question_id: question?.question_id })"
              />
            </div>
          </div>

          <textarea-prime
            :model-value="answer.content"
            :auto-resize="true"
            :pt="textareaPt"
            class="tw-w-full tw-bg-ink/darker tw-min-h-[80px] tw-resize-none"
            @update:model-value="updateAnswerData({ question_index: index, answer_index: key, property: 'content', value: $event })"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="tw-flex tw-mx-auto tw-relative"
    >
      <span class="tw-text-sm tw-font-normal tw-text-ink/light">
        Добавьте хотя бы один вопрос
      </span>
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import FileUpload from '@/components/file-upload.vue'
import TextareaPrime from 'primevue/textarea'
import Toast from '@/components/toast/toast-template.vue'

import { checkboxPt, textareaPt } from '@/pt-options'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'quiz-question-module',
  components: {
    ButtonPrime,
    Checkbox,
    FileUpload,
    TextareaPrime
  },
  setup () {
    const store = useStore()
    const toast = useToast()

    const questions = computed(() => store.state.quiz?.quiz?.questions || [])

    // Добавление/удаление вопросов, ответов и редактирование данных у них
    const appendAnswer = (index) => store.commit('quiz/appendAnswer', index)
    const appendQuestion = () => store.commit('quiz/appendQuestion')
    const removeAnswer = async ({ question_index, answer_index, answer_id, question_id }) => {
      if (answer_id) {
        await store.dispatch('quiz/removeAnswer', { answer_id, question_id })
      } else {
        store.commit('quiz/removeAnswer', { question_index, answer_index })
      }
    }
    const removeQuestion = async (index, question_id) => {
      if (question_id) {
        await store.dispatch('quiz/removeQuestion', question_id)
      } else {
        store.commit('quiz/removeQuestion', index)
      }
    }
    const updateAnswerData = ({ question_index, answer_index, property, value }) => store.commit('quiz/updateAnswerData', { question_index, answer_index, property, value })
    const updateQuestionData = ({ index, property, value }) => store.commit('quiz/updateQuestionData', { index, property, value })
    const onChangeQuestionAnswerType = ({ questionIndex, isFree }) => store.commit('quiz/updateQuestionAnswerType', { questionIndex, isFree })

    // Обновление и удаление изображения у вопроса
    const onRemoveQuestionImage = (index) => store.commit('quiz/updateQuestionData', { index, property: 'img', value: '' })
    const onUploadQuestionImage = async ({ file, index }) => {
      try {
        const { path = null, success = false } = await store.dispatch('common/uploadFile', file)

        if (success) {
          store.commit('quiz/updateQuestionData', {
            index,
            property: 'img',
            value: path
          })
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
    // Обновление и удаление изображения у ответа
    const onRemoveAnswerImage = ({ question_index, answer_index }) => store.commit('quiz/updateAnswerData', { question_index, answer_index, property: 'img', value: '' })
    const onUpdateAnswerImage = async ({ question_index, answer_index, file }) => {
      try {
        const { path = null, success = false } = await store.dispatch('common/uploadFile', file)

        if (success) {
          store.commit('quiz/updateAnswerData', {
            question_index,
            answer_index,
            property: 'img',
            value: path
          })
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
      appendAnswer,
      appendQuestion,
      checkboxPt,
      onChangeQuestionAnswerType,
      onRemoveAnswerImage,
      onRemoveQuestionImage,
      onUpdateAnswerImage,
      onUploadQuestionImage,
      questions,
      removeAnswer,
      removeQuestion,
      textareaPt,
      updateAnswerData,
      updateQuestionData
    }
  }
}
</script>
