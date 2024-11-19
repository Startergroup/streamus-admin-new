<template>
  <form
    v-if="isEditMode && Object.keys(schedule).length || !isEditMode"
    class="tw-column-start tw-w-full tw-gap-12"
    @submit.prevent="onSubmit"
  >
    <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
      <h2 class="tw-text-2xl tw-font-medium tw-text-sky/white">
        Расписание
      </h2>

      <div class="tw-flex tw-items-center tw-gap-3">
        <button-prime
          type="submit"
          label="Сохранить"
        />

        <router-link :to="{ name: 'schedules' }">
          <template #default>
            <button-prime
              outlined
              label="Назад"
              @click="() => {}"
            />
          </template>
        </router-link>
      </div>
    </div>

    <div class="tw-column-start tw-w-full tw-gap-12">
      <div class="tw-flex tw-items-start tw-w-full tw-gap-6">
        <div class="tw-column-start tw-w-auto tw-gap-1">
          <span class="tw-text-sm tw-font-medium tw-text-sky/white">День недели</span>

          <calendar
            :model-value="form.date.value"
            :invalid="!form.date.value"
            :show-icon="true"
            :show-on-focus="true"
            :pt="calendarPt"
            date-format="dd.mm.yy"
            icon-display="input"
            class="tw-w-[300px]"
            placeholder="12.01.2024"
            @update:model-value="onUpdateDate($event, 'date')"
          />
        </div>

        <div class="tw-column-start tw-w-auto tw-gap-1">
          <span class="tw-text-sm tw-font-medium tw-text-sky/white">Секция</span>

          <select-button
            v-model="form.section.value"
            :invalid="Object.hasOwn(errors, form.section.name)"
            :options="tabs"
            :option-value="null"
            option-label="section_name"
            :pt="selectButtonPt"
          />
        </div>
      </div>

      <div class="tw-column-start tw-w-full tw-gap-6">
        <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
          <h2 class="tw-text-xl tw-font-medium tw-text-sky/white">Доклады</h2>

          <button-prime
            outlined
            label="Добавить доклад"
            @click="appendLecture"
          />
        </div>

        <div
          v-for="(item, index) in form.lectures.value"
          :key="index"
          class="tw-column-start tw-w-full tw-gap-6 tw-pb-10 tw-border-b tw-border-ink/darker last:tw-border-b-0"
        >
          <button-prime
            v-if="index !== 0"
            outlined
            label="Удалить"
            class="tw-ml-auto"
            @click="removeLecture(index, item.lecture_id)"
          />

          <div class="tw-flex tw-items-end tw-justify-start tw-w-full tw-gap-4">
            <div class="tw-column-start tw-w-[300px] tw-gap-2">
              <span class="tw-text-sm tw-font-medium tw-text-sky/white">
                Начало доклада
              </span>

              <calendar
                :model-value="new Date(item.start)"
                :invalid="!item.start"
                :show-icon="true"
                :show-on-focus="true"
                :time-only="true"
                :pt="calendarPt"
                class="tw-w-full"
                icon-display="input"
                placeholder="14:00"
                @update:model-value="onUpdateTime($event, 'start', index)"
              />
            </div>

            <div class="tw-column-start tw-w-[300px] tw-gap-2">
              <span class="tw-text-sm tw-font-medium tw-text-sky/white">
                Конец доклада
              </span>

              <calendar
                :model-value="new Date(item.end)"
                :invalid="!item.end"
                :show-icon="true"
                :show-on-focus="true"
                :time-only="true"
                :pt="calendarPt"
                class="tw-w-full"
                icon-display="input"
                placeholder="14:00"
                @update:model-value="onUpdateTime($event, 'end', index)"
              />
            </div>

            <label class="tw-flex tw-items-center tw-gap-2 tw-h-10">
              <checkbox
                v-model="item.is_votable"
                :binary="true"
                :pt="checkboxPt"
              />

              <span class="tw-text-base tw-font-medium tw-text-sky/white">Можно проголосовать</span>
            </label>
          </div>

          <div class="tw-grid tw-grid-cols-2 tw-w-full tw-gap-6">
            <div class="tw-column-start tw-w-full tw-gap-2">
              <span class="tw-text-sm tw-font-medium tw-text-sky/white">
                ФИО докладчика
              </span>

              <input-text
                v-model="item.fio"
                :pt="inputPt"
                placeholder="Иванов Иван"
                class="tw-bg-ink/darker tw-w-full"
              />
            </div>

            <div class="tw-column-start tw-w-full tw-gap-2">
              <span class="tw-text-sm tw-font-medium tw-text-sky/white">
                Компания
              </span>

              <input-text
                v-model="item.company"
                :pt="inputPt"
                placeholder="Рога и копыта"
                class="tw-bg-ink/darker tw-w-full"
              />
            </div>
          </div>

          <div class="tw-grid tw-grid-cols-2 tw-w-full tw-gap-8">
            <div class="tw-column-start tw-w-full tw-gap-2">
              <span class="tw-text-sm tw-font-medium tw-text-sky/white">
                Город
              </span>

              <input-text
                v-model="item.city"
                :pt="inputPt"
                placeholder="Москва"
                class="tw-bg-ink/darker tw-w-full"
              />
            </div>

            <div class="tw-column-start tw-w-full tw-gap-2">
              <span class="tw-text-sm tw-font-medium tw-text-sky/white">
                Название доклада
              </span>

              <input-text
                v-model="item.name"
                :pt="inputPt"
                :invalid="!item.name.length"
                placeholder="Распределенные системы"
                class="tw-bg-ink/darker tw-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import ButtonPrime from 'primevue/button'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'

import * as yup from 'yup'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import { checkboxPt, inputPt } from '@/pt-options'
import { getForm } from '@/composables/form.composables'
import { useStore } from 'vuex'
import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'schedule-create',
  components: {
    ButtonPrime,
    Calendar,
    Checkbox,
    InputText,
    SelectButton
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const isEditMode = computed(() => Boolean(route.params.id))
    const schedule = computed(() => store.state.schedule.schedule)

    const tabs = computed(() => store.state.tabs.tabs.map(item => ({ section_name: item.name, section_id: item.tab_id })))

    const lectureSchema = yup.object({
      name: yup.string().required(),
      start: yup.date().required(),
      end: yup.date().required(),
      fio: yup.string(),
      company: yup.string(),
      city: yup.string(),
      is_votable: yup.boolean()
    })
    const { form, errors, handleSubmit, meta } = getForm({
      items: [
        {
          name: 'section'
        },
        {
          name: 'date'
        },
        {
          name: 'lectures'
        }
      ],
      initialValues: {
        section: null,
        date: new Date(),
        lectures: [
          {
            name: '',
            start: new Date(),
            end: new Date(),
            fio: '',
            company: '',
            city: '',
            is_votable: true
          }
        ]
      },
      validationSchema: yup.object().shape({
        section: yup.object().shape({
          section_name: yup.string().required(),
          section_id: yup.number().required()
        }),
        date: yup.date().required(),
        lectures: yup.array().of(lectureSchema).min(1)
      })
    })
    const onSubmit = handleSubmit(async (values) => {
      if (isEditMode.value) {
        await store.dispatch('schedule/updateSchedule', {
          ...values,
          schedule_id: route.params.id
        })
      } else {
        await store.dispatch('schedule/createSchedule', values)
      }

      await router.push({ name: 'schedules' })
    })

    const appendLecture = () => {
      form.value.lectures.value.push({
        name: '',
        start: null,
        end: null,
        fio: '',
        company: '',
        city: '',
        is_votable: true
      })
    }
    const removeLecture = async (index, id) => {
      if (isEditMode.value) {
        await store.dispatch('schedule/deleteLecture', id)
      }

      form.value.lectures.value.splice(index, 1)
    }

    const onUpdateDate = (date, property) => {
      form.value[property].value = date
    }
    const onUpdateTime = (date, property, index) => {
      const timezone = momentTimezone.tz.guess()
      form.value.lectures.value[index][property] = momentTimezone.tz(date, timezone).toISOString()
    }

    const calendarPt = {
      input: ({ props }) => {
        return {
          class: [
            'tw-bg-ink/darker tw-min-h-[40px] tw-w-full',
            { 'tw-border tw-border-red-500': props.invalid }
          ]
        }
      }
    }
    const selectButtonPt = {
      button: ({ context }) => {
        return {
          class: ['tw-bg-ink/darker', { 'before:tw-bg-primary/base': context.active }]
        }
      }
    }

    onBeforeMount(async () => {
      if (isEditMode.value) {
        await store.dispatch('schedule/getScheduleById', route.params.id)

        form.value.date.value = schedule.value.date
        form.value.lectures.value = schedule.value.lectures
        form.value.section.value = {
          section_id: schedule.value.section_id,
          section_name: schedule.value.section_name
        }
      }

      await store.dispatch('tabs/getTabs')
    })

    return {
      appendLecture,
      calendarPt,
      checkboxPt,
      errors,
      form,
      inputPt,
      isEditMode,
      meta,
      moment,
      onSubmit,
      onUpdateDate,
      onUpdateTime,
      removeLecture,
      schedule,
      selectButtonPt,
      tabs
    }
  }
}
</script>
