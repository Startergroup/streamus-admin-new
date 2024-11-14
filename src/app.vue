<template>
  <div class="tw-flex tw-items-start tw-w-full tw-min-h-full">
    <side-menu v-if="$route.name !== 'auth'" />

    <div class="tw-column-start tw-w-full tw-min-h-full tw-px-8 tw-py-10">
      <router-view />
    </div>

    <modals-container />
  </div>
</template>

<script>
import SideMenu from '@/modules/side-menu.vue'
import { ModalsContainer } from 'vue-final-modal'

import { onMounted } from 'vue'
import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'
import { AUTH_DATA } from '@/constants/storages'

export default {
  name: 'app',
  components: {
    ModalsContainer,
    SideMenu
  },
  setup () {
    onMounted(async () => {
      const store = useStore()
      // const router = useRouter()

      const token = localStorage.getItem(AUTH_DATA)

      if (token) {
        store.commit('auth/setToken', token)
      }
    })
  }
}
</script>
