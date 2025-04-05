<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">
        Расписания
      </h2>

      <div class="tw-flex tw-items-center tw-gap-3">
        <router-link :to="{ name: 'schedule-create' }">
          <template #default>
            <button-prime label="Добавить расписание" />
          </template>
        </router-link>

        <button-prime
          label="TEST"
          @click="onUploadSchedule"
        />

        <a
          href="/Шаблон_расписания.xlsx"
          download
        >
          <button-prime
            outlined
            label="Скачать шаблон"
          />
        </a>
      </div>
    </div>

    <div class="tw-column-end tw-w-full tw-gap-6">
      <data-table
        :value="schedules"
        :pt="tablePt"
        :rows="10"
        :rows-per-page-options="[5, 10, 20, 50]"
        paginator
        class="tw-w-full"
      >
        <column
          v-for="(item, index) in columns"
          :key="index"
          :field="item.field"
          :header="item.header"
        >
          <template #body="{ data, field }">
            <span v-if="field === 'schedule_id'">
              {{ data[field] }}
            </span>

            <span v-else-if="field === 'date'">
              {{ moment(data[field]).format('DD.MM.YYYY') }}
            </span>

            <span v-else-if="field === 'lectures'">
              {{ data.lectures.length }}
            </span>

            <div
              v-else-if="field === 'actions'"
              class="tw-flex tw-items tw-justify-end tw-w-full tw-gap-3"
            >
              <button-prime
                outlined
                label="Выгрузить отчет"
                @click="onGenerateReportBySection(data.schedule_id, data.section_name)"
              />

              <router-link :to="{ name: 'schedule-edit', params: { id: data.schedule_id } }">
                <template #default>
                  <button-prime
                    outlined
                    label="Редактировать"
                  />
                </template>
              </router-link>

              <button-prime
                outlined
                label="Удалить"
                class="tw-text-red-400"
                @click="onDelete(data.schedule_id)"
              />
            </div>

            <span v-else>
              {{ data[field] }}
            </span>
          </template>
        </column>
      </data-table>

      <button-prime
        label="Отчет по голосованиям"
        outlined
        @click="openGenerateReportModal"
      />
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import GenerateVoteReport from '@/modals/generate-vote-report.vue'

import GenerateXlsx from '@/utils/generate-xlsx'
import dayjs from 'dayjs'
import moment from 'moment'
import { tablePt } from '@/pt-options'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useModal } from 'vue-final-modal'
import { cloneDeep } from 'lodash'

export default {
  name: 'schedules',
  components: {
    ButtonPrime,
    Column,
    DataTable
  },
  setup () {
    const store = useStore()

    const schedules = computed(() => {
      return cloneDeep(store.state.schedule?.schedules || []).sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
    })
    const columns = [
      { field: 'schedule_id', header: 'ID' },
      { field: 'date', header: 'Дата' },
      { field: 'section_name', header: 'Секция' },
      { field: 'lectures', header: 'Кол-во доклодов' },
      { field: 'actions', header: '' }
    ]

    onMounted(async () => {
      await store.dispatch('schedule/getSchedules')
    })

    const generateReport = async (items, name) => {
      const columns = [
        { header: 'Название доклада', key: 'name' },
        { header: 'Докладчик', key: 'fio' },
        { header: 'Компания', key: 'company' },
        { header: 'Количество голосов', key: 'votes' }
      ]
      const xlsx = new GenerateXlsx(columns, items)
      const sheet = xlsx.createSimpleSheet()
      const filename = xlsx.createFilename(name)

      await xlsx.generateXlsx(filename, name, sheet)
    }
    const onDelete = async (id) => {
      await store.dispatch('schedule/deleteSchedule', id)
      await store.dispatch('schedule/getSchedules')
    }
    const onGenerateVoteReport = async (scheduleId) => {
      await store.dispatch('schedule/getVoteReport', scheduleId)
    }
    const onGenerateReportBySection = async (id, sectionName = '') => {
      const { votes = [] } = await store.dispatch('schedule/getVoteReportBySection', id) || {}
      const sortedVotes = votes.sort((a, b) => b.votes - a.votes)
      await generateReport(sortedVotes, `Отчет по секции ${sectionName}`)
    }

    const onUploadSchedule = async ({ target }) => {
      try {
        // const { path } = await store.dispatch('common/uploadFile', target.files[0])
        await store.dispatch('schedule/importSchedule')
      } catch (error) {
        console.error(error)
      }
    }

    const { open: openGenerateReportModal } = useModal({
      component: GenerateVoteReport,
      attrs: {
        onGenerateReport: async (date) => {
          const [start, end] = date
          const { votes = [] } = await store.dispatch('schedule/getVoteReport', { start, end }) || {}

          await generateReport(votes, 'Отчет по голосованиям')
        }
      }
    })

    return {
      columns,
      moment,
      onDelete,
      onGenerateReportBySection,
      onGenerateVoteReport,
      onUploadSchedule,
      openGenerateReportModal,
      schedules,
      tablePt
    }
  }
}
</script>
