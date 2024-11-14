import store from '@/store'

export default async (to, from, next) => {
  if (to.meta.isProtected) {
    if (store.getters['auth/isLogged']) {
      const { expired } = await store.dispatch('auth/checkToken')

      if (!expired) {
        return next()
      }
    }

    return next('/auth')
  }

  return next()
}
