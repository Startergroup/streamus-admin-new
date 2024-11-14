<template>
  <div class="tw-column-start tw-w-full tw-max-w-[420px] tw-gap-6 tw-m-auto tw-bg-ink/darker tw-rounded-sm tw-px-6 tw-py-8">
    <h1 class="tw-text-lg tw-font-medium tw-text-sky/base">Авторизация</h1>

    <form
      class="tw-column-start tw-w-full tw-gap-8"
      @submit.stop="onSubmit"
    >
      <div class="tw-column-start tw-w-full tw-gap-4">
        <div
          v-for="(item, index) in form"
          :key="index"
          class="tw-column-start tw-w-full tw-gap-1"
        >
          <span class="tw-text-xs tw-font-normal tw-text-sky/base">
            {{ item.props?.label }}
          </span>

          <input-text
            :invalid="Object.hasOwn(errors, item.name)"
            :name="item.name"
            :model-value="item.value"
            :type="item.props.type"
            :pt="inputPt"
            class="tw-w-full"
            @update:model-value="item.value = $event"
          />

          <span class="tw-text-xs tw-font-normal tw-text-red-400">
            {{ errors[item.name] }}
          </span>
        </div>
      </div>

      <button-prime
        :loading="isLoading"
        type="submit"
        label="Войти"
        class="tw-w-full"
      />
    </form>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from '@/components/toast/toast-template.vue'

import * as yup from 'yup'
import inputTypes from '@/constants/input-types'
import { inputPt } from '@/pt-options'
import { getForm } from '@/composables/form.composables'
import { useStore } from 'vuex'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default {
  name: 'auth',
  components: {
    ButtonPrime,
    InputText,
    Toast
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()

    const isLoading = ref(false)
    const { form, errors, handleSubmit } = getForm({
      items: [
        {
          name: 'login',
          props: {
            label: 'Логин',
            type: inputTypes.TEXT
          }
        },
        {
          name: 'password',
          props: {
            label: 'Пароль',
            type: inputTypes.PASS
          }
        }
      ],
      initialValues: {
        login: '',
        password: ''
      },
      validationSchema: yup.object().shape({
        login: yup.string().required(),
        password: yup.string().required()
      })
    })
    const onSubmit = handleSubmit(async ({ login, password }) => {
      try {
        isLoading.value = true

        const { success = false } = await store.dispatch('auth/login', {
          username: login,
          password
        }) || {}

        if (!success) {
          toast({
            component: Toast,
            props: {
              title: 'Ошибка',
              message: 'Неправильный логин или пароль'
            }
          }, {
            timeout: 5000
          })

          return
        }

        await router.push({ name: 'codes' })
      } catch (error) {
        console.debug(error)
      } finally {
        isLoading.value = false
      }
    })

    return {
      errors,
      form,
      inputPt,
      isLoading,
      onSubmit
    }
  }
}
</script>
