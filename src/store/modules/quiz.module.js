import Api from '@/api/api'
import { API_VERSION } from '@/api/api.config'
import { cloneDeep } from 'lodash'

const INITIAL_QUIZ = {
  name: '',
  is_active: false,
  introduction_text: '',
  introduction_img: '',
  duration: 0,
  logo: null,
  agreement: '',
  background: '#219ab8',
  questions: []
}

export default {
  namespaced: true,
  state: {
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
    quiz: null,
    quizzes: []
  },
  mutations: {
    appendAnswer (state, question_index) {
      state.quiz.questions[question_index].answers.push({
        content: '',
        img: '',
        is_right: false,
        is_free_answer: false
      })
    },
    appendQuestion (state) {
      state.quiz.questions.push({
        img: '',
        content: '',
        answers: [],
        free_answer: false
      })
    },
    initializeQuiz (state) {
      state.quiz = cloneDeep(INITIAL_QUIZ)
    },
    removeAnswer (state, { question_index, answer_index }) {
      state.quiz.questions[question_index].answers.splice(answer_index, 1)
    },
    removeQuestion (state, question_index) {
      state.quiz.questions.splice(question_index, 1)
    },
    /**
     * @param state
     * @param quiz
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
    setQuiz (state, quiz) {
      state.quiz = quiz
    },
    updateAnswerData (state, { question_index, answer_index, property, value }) {
      state.quiz.questions[question_index].answers[answer_index][property] = value
    },
    updateQuestionAnswerType (state, { questionIndex, isFree }) {
      state.quiz.questions[questionIndex].free_answer = isFree
      state.quiz.questions[questionIndex].answers = isFree
        ? [{
            content: '',
            img: '',
            is_right: false,
            is_free_answer: true
          }]
        : []
    },
    updateQuestionData (state, { index, property, value }) {
      state.quiz.questions[index][property] = value
    },
    // Для обновления созданного квиза
    updateQuizProperty (state, { property, value }) {
      state.quiz[property] = value
    },
    updateQuizPropertyByID (state, { quiz_id, property, value }) {
      const targetQuiz = state.quizzes.find(quiz => parseInt(quiz.quiz_id) === parseInt(quiz_id))

      if (targetQuiz) {
        targetQuiz[property] = value
      }
    }
  },
  actions: {
    async changeQuizActiveStatus ({ state }, { quiz_id, value }) {
      try {
        return await Api.put(`${API_VERSION}/quiz/switch_state`, {
          data: {
            quiz_id,
            value
          }
        })
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async createQuiz ({ state }) {
      try {
        return await Api.post(`${API_VERSION}/quiz`, {
          data: state.quiz
        })
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async getQuizReport ({ state }, quiz_id) {
      return await Api.get(`${API_VERSION}/quiz/report`, {
        quiz_id
      })
    },
    async getQuizzes ({ state }) {
      try {
        const { data, success } = await Api.get(`${API_VERSION}/quizzes`)

        if (success) {
          state.quizzes = data
        } else {
          throw new Error()
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async removeQuiz ({ state }, quiz_id) {
      try {
        const { success } = await Api.delete(`${API_VERSION}/quiz`, {
          data: {
            quiz_id
          }
        })

        if (success) {
          const targetQuizIndex = state.quizzes.findIndex(quiz => parseInt(quiz.quiz_id) === parseInt(quiz_id))
          state.quizzes.splice(targetQuizIndex, 1)
        }

        return {
          success
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeAnswer ({ state }, { answer_id, question_id }) {
      try {
        const { success } = await Api.delete(`${API_VERSION}/answer`, {
          data: {
            answer_id
          }
        })

        if (success) {
          const targetQuestion = state.quiz.questions.find(question => parseInt(question.question_id) === parseInt(question_id))
          const targetAnswerIndex = targetQuestion.answers.findIndex(answer => parseInt(answer.answer_id) === parseInt(answer_id))

          targetQuestion.answers.splice(targetAnswerIndex, 1)
        }

        return {
          success
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeQuestion ({ state }, question_id) {
      try {
        const { success } = await Api.delete(`${API_VERSION}/question`, {
          data: {
            question_id
          }
        })

        if (success) {
          const targetQuestionIndex = state.quiz.questions.find(question => parseInt(question.question_id) === parseInt(question_id))
          state.quiz.questions.splice(targetQuestionIndex, 1)
        }

        return {
          success
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateQuiz ({ state }) {
      return await Api.put(`${API_VERSION}/quiz`, {
        data: state.quiz
      })
    }
  }
}
