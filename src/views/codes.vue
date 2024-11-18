<template>
  <div class="tw-column-start tw-w-full tw-gap-12">
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">Ключи</h2>

      <input-text
        v-model="search"
        :pt="inputPt"
        placeholder="Поиск по ключу"
        class="tw-bg-ink/darker tw-w-full tw-max-w-[320px]"
      />
    </div>

    <div class="tw-column-start tw-w-full tw-gap-6">
      <div class="tw-flex tw-items-center tw-justify-between tw-w-full tw-gap-3">
        <button-prime
          outlined
          label="Сгенерировать ключи"
          @click="onGenerateCodes"
        />

        <div class="tw-flex tw-items-center tw-gap-3">
          <button-prime
            label="Добавить ключ"
            @click="onCreateCode"
          />

          <button-prime
            :loading="isPendingDeleteCodes"
            label="Удалить все ключи"
            class="tw-bg-red-400"
            @click="onRemoveAllCodes"
          />
        </div>
      </div>

      <div class="tw-column-start tw-w-full tw-gap-3">
        <data-table
          :value="filteredCodes"
          :pt="tablePt"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
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
              <span v-if="field !== 'actions'">{{ data[field] }}</span>

              <button-prime
                v-else
                label="Удалить"
                outlined
                class="tw-flex tw-ml-auto"
                @click="onRemoveCode(data.code_id)"
              />
            </template>
          </column>
        </data-table>

        <div class="tw-flex tw-items-center tw-gap-3 tw-ml-auto">
          <button-prime
            :loading="isPendingCodes"
            outlined
            label="Выгрузить ключи"
            @click="onDownloadCodes"
          />

          <button-prime
            :loading="isPendingReport"
            outlined
            label="Выгрузить отчет"
            @click="onGenerateCodesReport"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import Column from 'primevue/column'
import CreateCodeModal from '@/modals/create-code-modal.vue'
import DataTable from 'primevue/datatable'
import GenerateCodesModal from '@/modals/generate-codes-modal.vue'
import IconBase from '@/components/icon-base.vue'
import InputText from 'primevue/inputtext'

import GenerateXlsx from '@/utils/generate-xlsx'
import dayjs from 'dayjs'
import icons from '@/utils/icons'
import { tablePt } from '@/pt-options'
import { inputPt } from '@/pt-options'
import { useStore } from 'vuex'
import { ref, computed, onMounted } from 'vue'
import { useModal } from 'vue-final-modal'

export default {
  name: 'codes',
  components: {
    ButtonPrime,
    Column,
    DataTable,
    IconBase,
    InputText
  },
  setup () {
    const store = useStore()

    onMounted(async () => {
      await store.dispatch('codes/getCodes')
    })

    const codes = computed(() => store.state.codes.codes)
    const columns = [
      { field: 'code', header: 'Ключ' },
      { field: 'name', header: 'Имя' },
      { field: 'email', header: 'Почта' },
      { field: 'last_activity', header: 'Последняя активность' },
      { field: 'actions', header: '' }
    ]

    const search = ref('')
    const filteredCodes = computed(() => codes.value.filter(code => code.code.toLowerCase().indexOf(search.value.toLowerCase()) !== -1 || !search.value.length))

    const { open: onGenerateCodes } = useModal({
      component: GenerateCodesModal,
      attrs: {
        onGenerate: async ({ count, length }) => {
          await store.dispatch('codes/generateCodes', { count, length })
          await store.dispatch('codes/getCodes')
        }
      }
    })
    const { open: onCreateCode } = useModal({
      component: CreateCodeModal,
      attrs: {
        onCreateCode: async (code) => {
          await store.dispatch('codes/createCode', code)
          await store.dispatch('codes/getCodes')
        }
      }
    })

    const isPendingDeleteCodes = ref(false)
    const onRemoveAllCodes = async () => {
      try {
        isPendingDeleteCodes.value = true

        await store.dispatch('codes/removeAllCodes')
        store.commit('codes/setCodes', [])
      } finally {
        isPendingDeleteCodes.value = false
      }
    }
    const onRemoveCode = async (id) => {
      await store.dispatch('codes/removeCode', id)
      await store.dispatch('codes/getCodes')
    }

    const isPendingReport = ref(false)
    const isPendingCodes = ref(false)
    const onDownloadCodes = async () => {
      try {
        isPendingCodes.value = true

        const columns = [
          { header: 'Ключ', key: 'code' }
        ]
        const xlsx = new GenerateXlsx(columns, codes.value)
        const sheet = xlsx.createSimpleSheet()
        const filename = xlsx.createFilename('Ключи')

        await xlsx.generateXlsx(filename, 'Ключи', sheet)
      } finally {
        isPendingCodes.value = false
      }
    }
    const onGenerateCodesReport = async () => {
      try {
        isPendingReport.value = true

        const columns = [
          { header: 'Ключ', key: 'code' },
          { header: 'Имя пользователя', key: 'name' },
          { header: 'Email', key: 'email' },
          { header: 'Последняя активность', key: 'last_activity' }
        ]
        const mappedItems = codes.value.map(item => {
          return {
            ...item,
            last_activity: item.last_activity ? dayjs(item.last_activity).format('DD.MM.YYYY HH:mm') : 'Не заходил'
          }
        })
        const xlsx = new GenerateXlsx(columns, mappedItems)
        const sheet = xlsx.createSimpleSheet()
        const filename = xlsx.createFilename('Отчет по пользователям')

        await xlsx.generateXlsx(filename, 'Отчет', sheet)
      } finally {
        isPendingReport.value = false
      }
    }

    return {
      codes,
      columns,
      filteredCodes,
      icons,
      inputPt,
      isPendingCodes,
      isPendingDeleteCodes,
      isPendingReport,
      onDownloadCodes,
      onGenerateCodes,
      onGenerateCodesReport,
      onCreateCode,
      onRemoveAllCodes,
      onRemoveCode,
      search,
      tablePt
    }
  }
}
</script>
