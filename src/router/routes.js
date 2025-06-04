import Auth from '@/views/auth.vue'
import Chats from '@/views/chats/chats.vue'
import Codes from '@/views/codes.vue'
import Quizzes from '@/views/list-quizzes/list-quizzes.vue'
import CreateQuiz from '@/views/create-quiz/create-quiz.vue'
import ScheduleCreate from '@/views/schedule-create.vue'
import Schedules from '@/views/schedules.vue'
import Translation from '@/views/translation.vue'

export default [
  {
    path: '/',
    redirect: { name: 'codes' }
  },
  {
    name: 'auth',
    component: Auth,
    path: '/auth',
    meta: {
      isProtected: false
    }
  },
  {
    name: 'chats',
    path: '/chats',
    component: Chats,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'create-quiz',
    path: '/create-quiz',
    component: CreateQuiz,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'codes',
    path: '/codes',
    component: Codes,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'edit-quiz',
    path: '/edit-quiz/:id',
    component: CreateQuiz,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'quizzes',
    component: Quizzes,
    path: '/quizzes',
    meta: {
      isProtected: true
    }
  },
  {
    name: 'schedule-create',
    path: '/schedule-create',
    component: ScheduleCreate,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'schedule-edit',
    path: '/schedule-edit/:id',
    component: ScheduleCreate,
    meta: {
      isProtected: true
    }
  },
  {
    name: 'schedules',
    component: Schedules,
    path: '/schedules',
    meta: {
      isProtected: true
    }
  },
  {
    name: 'translation',
    component: Translation,
    path: '/translation',
    meta: {
      isProtected: true
    }
  }
]
