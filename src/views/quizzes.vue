<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
    <router-view />
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'

export default {
  name: 'quiz',
  components: {
    ButtonPrime
  }
}
</script>
