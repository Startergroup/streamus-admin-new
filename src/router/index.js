import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'

import authMiddleware from './middlewares/auth.middleware'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authMiddleware)

export default router
