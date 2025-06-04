<template>
  <div class="tw-column-start tw-w-full tw-max-w-[320px] tw-h-full tw-min-h-screen tw-bg-ink/darker tw-px-6 tw-py-10 tw-gap-12">
    <h2 class="tw-text-xl tw-font-medium tw-text-sky/white tw-w-full tw-text-center">Streamus</h2>

    <div class="tw-column-start tw-w-full tw-gap-4">
      <router-link
        v-for="(item, index) in menu"
        :key="index"
        :to="item.url"
        class="tw-w-full"
      >
        <template #default="{ isActive }">
          <button-prime
            :label="item.text"
            :class="['tw-w-full', { 'tw-bg-ink/base tw-text-sky/white': !isActive }]"
          />
        </template>
      </router-link>
    </div>

    <button-prime
      class="tw-w-full tw-bg-red-500 tw-text-white tw-mt-auto"
      label="Выйти"
      @click="logout"
    />
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'side-menu',
  components: {
    ButtonPrime
  },
  setup () {
    const store = useStore()
    const router = useRouter()

    const menu = [
      {
        text: 'Квизы',
        url: '/quizzes'
      },
      {
        text: 'Ключи',
        url: '/codes'
      },
      {
        text: 'Трансляция',
        url: '/translation'
      },
      {
        text: 'Расписания',
        url: '/schedules'
      },
      {
        text: 'Чаты',
        url: '/chats'
      }
    ]

    const logout = async () => {
      store.commit('auth/setToken', null)
      await router.push({ name: 'auth' })
    }

    return {
      logout,
      menu
    }
  }
}
</script>
