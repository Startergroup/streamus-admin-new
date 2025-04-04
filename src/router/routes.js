import auth from '@/views/auth.vue'
import codes from '@/views/codes.vue'
import quizzes from '@/views/list-quizzes/list-quizzes.vue'
import createQuiz from '@/views/create-quiz/create-quiz.vue'
import scheduleCreate from '@/views/schedule-create.vue'
import schedules from '@/views/schedules.vue'
import translation from '@/views/translation.vue'

export default [
  {
    path: '/',
    redirect: { name: 'codes' }
  },
  {
    name: 'auth',
    component: auth,
    path: '/auth',
    meta: {
      isProtected: false
    }
  },
  {
    name: 'create-quiz',
    path: '/create-quiz',
    component: createQuiz,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'codes',
    path: '/codes',
    component: codes,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'edit-quiz',
    path: '/edit-quiz/:id',
    component: createQuiz,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'quizzes',
    component: quizzes,
    path: '/quizzes',
    meta: {
      isProtected: true
    }
  },
  {
    name: 'schedule-create',
    path: '/schedule-create',
    component: scheduleCreate,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'schedule-edit',
    path: '/schedule-edit/:id',
    component: scheduleCreate,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'schedules',
    component: schedules,
    path: '/schedules',
    meta: {
      isProtected: true
    }
  },
  {
    name: 'translation',
    component: translation,
    path: '/translation',
    meta: {
      isProtected: true
    }
  }
]
