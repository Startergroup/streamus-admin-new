<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
    <!-- Блок с таблицей -->
    <!-- TODO: Вынести в отдельный компонент вместе с логикой -->
    <div class="tw-column-start tw-w-full tw-gap-8">
      <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
        <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">Секции</h2>

        <button-prime
          label="Добавить секцию"
          @click="openCreateTabModal"
        />
      </div>

      <data-table
        :value="tabs"
        :pt="tablePt"
        class="tw-w-full"
      >
        <column
          v-for="(item, index) in columns"
          :key="index"
          :field="item.field"
          :header="item.header"
        >
          <template #body="{ data, field }">
            <span v-if="field !== 'actions'">{{ data[field] }}</span>

            <div
              v-else
              class="tw-flex tw-items-center tw-justify-end tw-w-full tw-gap-3"
            >
              <button-prime
                label="Редактировать"
                outlined
                @click="onEditTab(data)"
              />

              <button-prime
                label="Удалить"
                outlined
                @click="onRemoveTab(data.tab_id)"
              />
            </div>
          </template>
        </column>
      </data-table>
    </div>

    <!-- Блок с настройками -->
    <!-- TODO: Вынести в отдельный компонент вместе с логикой -->
    <form
      class="tw-column-start tw-w-full tw-gap-8"
      @submit.prevent="onSubmit"
    >
      <div class="tw-flex tw-justify-between tw-items-center tw-w-full">
        <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">Настройки</h2>

        <button-prime
          type="submit"
          label="Сохранить"
          @click="() => {}"
        />
      </div>

      <div class="tw-grid tw-grid-cols-2 tw-w-full tw-gap-x-4 tw-gap-y-8">
        <div
          v-for="(item, index) in form"
          :key="index"
          class="tw-column-start tw-w-full tw-gap-2"
        >
          <span>{{ item.props.label }}</span>

          <input-text
            v-if="item.props.component === componentTypes.INPUT_TEXT"
            v-model="item.value"
            :placeholder="item.props.placeholder"
            :invalid="Object.hasOwn(errors, item.name)"
            :pt="inputPt"
            class="tw-bg-ink/darker tw-w-full"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import Column from 'primevue/column'
import CreateTabModal from '@/modals/create-tab-modal.vue'
import DataTable from 'primevue/datatable'
import EditTabModal from '@/modals/edit-tab-modal.vue'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Toast from '@/components/toast/toast-template.vue'

import * as yup from 'yup'
import componentTypes from '@/constants/component-types'
import { inputPt, tablePt } from '@/pt-options'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { useModal } from 'vue-final-modal'
import { getForm } from '@/composables/form.composables'
import { useToast } from 'vue-toastification'

export default {
  name: 'translation',
  components: {
    ButtonPrime,
    Column,
    DataTable,
    FileUpload,
    InputText
  },
  setup () {
    const store = useStore()
    const toast = useToast()

    const settings = computed(() => store.state.settings.settings)

    const tabs = computed(() => store.state.tabs.tabs.sort((a, b) => a.order - b.order))
    const columns = [
      { field: 'tab_id', header: 'ID' },
      { field: 'name', header: 'Имя' },
      { field: 'url', header: 'Ссылка' },
      { field: 'order', header: 'Порядок' },
      { field: 'actions', header: '' }
    ]
    const { open:openCreateTabModal } = useModal({
      component: CreateTabModal,
      attrs: {
        onCreateTab: async ({ name, url, order }) => {
          await store.dispatch('tabs/createTab', { name, url, order })
          await store.dispatch('tabs/getTabs')
        }
      }
    })
    const onEditTab = ({ tab_id, name, url, order }) => {
      const { open } = useModal({
        component: EditTabModal,
        attrs: {
          name,
          url,
          order,
          onEditTab: async ({ name, url, order }) => {
            await store.dispatch('tabs/updateTab', {
              tab_id,
              name,
              order,
              url
            })
            await store.dispatch('tabs/getTabs')
          }
        }
      })

      open()
    }
    const onRemoveTab = async (id) => {
      await store.dispatch('tabs/removeTab', id)
      await store.dispatch('tabs/getTabs')
    }

    const { form, errors, handleSubmit } = getForm({
      items: [
        {
          name: 'title_ru',
          props: {
            component: componentTypes.INPUT_TEXT,
            label: 'Заголовок на русском',
            placeholder: ''
          }
        },
        {
          name: 'subtitle_ru',
          props: {
            component: componentTypes.INPUT_TEXT,
            label: 'Подзаголовок на русском',
            placeholder: ''
          }
        },
        {
          name: 'title_en',
          props: {
            component: componentTypes.INPUT_TEXT,
            label: 'Заголовок на английском',
            placeholder: ''
          }
        },
        {
          name: 'subtitle_en',
          props: {
            component: componentTypes.INPUT_TEXT,
            label: 'Подзаголовок на английском',
            placeholder: ''
          }
        }
      ],
      initialValues: {},
      validationSchema: yup.object().shape({
        title_ru: yup.string().required(),
        subtitle_ru: yup.string().required(),
        title_en: yup.string().required(),
        subtitle_en: yup.string().required()
      })
    })
    const onSubmit = handleSubmit(async (values) => {
      try {
        await store.dispatch('settings/updateSettings', values)

        toast({
          component: Toast,
          props: {
            title: 'Успешно',
            message: 'Настройки конференции были обновлены'
          }
        }, {
          timeout: 5000
        })
      } catch (error) {
        console.error(error)

        toast({
          component: Toast,
          props: {
            title: 'Ошибка',
            message: 'Непредвиденная ошибка'
          }
        }, {
          timeout: 5000
        })
      }
    })

    onMounted(async () => {
      await store.dispatch('settings/getSettings')
      await store.dispatch('tabs/getTabs')

      form.value.title_ru.value = settings.value?.title_ru
      form.value.subtitle_ru.value = settings.value?.subtitle_ru
      form.value.title_en.value = settings.value?.title_en
      form.value.subtitle_en.value = settings.value?.subtitle_en
    })

    return {
      columns,
      componentTypes,
      errors,
      form,
      inputPt,
      onEditTab,
      onRemoveTab,
      onSubmit,
      openCreateTabModal,
      tablePt,
      tabs
    }
  }
}
</script>
