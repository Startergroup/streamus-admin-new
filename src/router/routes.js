import auth from '@/views/auth.vue'
import codes from '@/views/codes.vue'
import quizzes from '@/views/quizzes.vue'
import scheduleCreate from '@/views/schedule-create.vue'
import schedules from '@/views/schedules.vue'
import translation from '@/views/translation.vue'
import vote from '@/views/vote.vue'

export default [
  {
    name: 'auth',
    component: auth,
    path: '/auth',
    meta: {
      isProtected: false
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
    name: 'codes',
    path: '/codes',
    component: codes,
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
  },
  {
    name: 'vote',
    component: vote,
    path: '/vote',
    meta: {
      isProtected: true
    }
  },
]
