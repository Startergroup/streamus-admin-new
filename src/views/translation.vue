<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
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

          <button-prime
            v-else
            label="Удалить"
            outlined
            class="tw-flex tw-ml-auto"
            @click="onRemoveTab(data.tab_id)"
          />
        </template>
      </column>
    </data-table>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import Column from 'primevue/column'
import CreateTabModal from '@/modals/create-tab-modal.vue'
import DataTable from 'primevue/datatable'

import { tablePt } from '@/pt-options'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { useModal } from 'vue-final-modal'

export default {
  name: 'translation',
  components: {
    ButtonPrime,
    Column,
    DataTable
  },
  setup () {
    const store = useStore()

    onMounted(async () => {
      await store.dispatch('settings/getSettings')
      await store.dispatch('tabs/getTabs')
    })

    const tabs = computed(() => store.state.tabs.tabs)
    const columns = [
      { field: 'tab_id', header: 'ID' },
      { field: 'name', header: 'Имя' },
      { field: 'url', header: 'Ссылка' },
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

    const onRemoveTab = async (id) => {
      await store.dispatch('tabs/removeTab', id)
      await store.dispatch('tabs/getTabs')
    }

    return {
      columns,
      onRemoveTab,
      openCreateTabModal,
      tablePt,
      tabs
    }
  }
}
</script>
