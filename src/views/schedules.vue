<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">
        Расписания
      </h2>

      <router-link :to="{ name: 'schedule-create' }">
        <template #default>
          <button-prime
            label="Добавить расписание"
            @click="() => {}"
          />
        </template>
      </router-link>
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'

export default {
  name: 'schedule',
  components: {
    ButtonPrime
  }
}
</script>
