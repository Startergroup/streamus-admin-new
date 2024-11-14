<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
    <h2 class="tw-text-2xl tw-font-medium tw-text-white">Квизы</h2>

    <router-link :to="{ name: 'create-quiz' }">
      <template #default>
        <button-prime label="Создать" />
      </template>
    </router-link>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'

export default {
  name: 'list-quizzes',
  components: {
    ButtonPrime
  }
}
</script>
