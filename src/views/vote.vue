<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">Голосования</h2>

      <button-prime
        label="Добавить голосование"
        @click="openCreateVoteModal"
      />
    </div>

    <data-table
      :value="votes"
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
            class="tw-flex tw-items-center tw-justify-end tw-w-full tw-gap-4"
          >
            <button-prime
              label="Выгрузить отчет"
              outlined
              @click="onGenerateReport(data.vote_id)"
            />

            <button-prime
              label="Удалить"
              outlined
              @click="onRemoveVote(data.vote_id)"
            />
          </div>
        </template>
      </column>
    </data-table>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import Column from 'primevue/column'
import CreateVoteModal from '@/modals/create-vote-modal.vue'
import DataTable from 'primevue/datatable'

import GenerateXlsx from '@/utils/generate-xlsx'
import { tablePt } from '@/pt-options'
import { useModal } from 'vue-final-modal'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'vote',
  components: {
    ButtonPrime,
    Column,
    DataTable
  },
  setup () {
    const store = useStore()

    onMounted(async () => {
      await store.dispatch('votes/getVotes')
    })

    const votes = computed(() => store.state.votes.votes)
    const columns = [
      { field: 'vote_id', header: 'ID' },
      { field: 'tab_name', header: 'Имя' },
      { field: 'actions', header: '' }
    ]

    const { open: openCreateVoteModal } = useModal({
      component: CreateVoteModal,
      attrs: {
        onCreateVote: async ({ presentations, tabId, tabName }) => {
          await store.dispatch('votes/createVote', {
            presentations,
            tabId,
            tabName
          })
          await store.dispatch('votes/getVotes')
        }
      }
    })

    const onGenerateReport = async (id) => {
      const { data = [] } = await store.dispatch('votes/generateReport', id) || {}

      const columns = [
        { header: 'ID доклада', key: 'presentation_id' },
        { header: 'Название доклада', key: 'name' },
        { header: 'Лайки', key: 'likes' }
      ]
      const xlsx = new GenerateXlsx(columns, data)
      const sheet = xlsx.createSimpleSheet()
      const filename = xlsx.createFilename('Отчет по голосованиям')

      await xlsx.generateXlsx(filename, 'Отчет', sheet)
    }
    const onRemoveVote = async (id) => {
      await store.dispatch('votes/removeVote', id)
      await store.dispatch('votes/getVotes')
    }

    return {
      columns,
      onGenerateReport,
      onRemoveVote,
      openCreateVoteModal,
      tablePt,
      votes
    }
  }
}
</script>
