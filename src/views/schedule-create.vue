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
      <div class="tw-column-start tw-w-auto tw-gap-1">
        <span class="tw-text-sm tw-font-medium tw-text-sky/white">День недели</span>

        <calendar
          :model-value="form.date.value"
          :invalid="!form.date.value"
          :show-icon="true"
          :show-on-focus="true"
          :pt="calendarPt"
          icon-display="input"
          class="tw-w-[300px]"
          placeholder="12.01.2024"
          @update:model-value="onUpdateDate($event, 'date')"
        />
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

          <div class="tw-column-start tw-w-[300px] tw-gap-6">
            <div class="tw-column-start tw-w-full tw-gap-2">
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

            <div class="tw-column-start tw-w-full tw-gap-2">
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
import InputText from 'primevue/inputtext'

import * as yup from 'yup'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import { inputPt } from '@/pt-options'
import { getForm } from '@/composables/form.composables'
import { useStore } from 'vuex'
import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'schedule-create',
  components: {
    ButtonPrime,
    Calendar,
    InputText
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const isEditMode = computed(() => Boolean(route.params.id))
    const schedule = computed(() => store.state.schedule.schedule)

    const lectureSchema = yup.object({
      name: yup.string().required(),
      start: yup.date().required(),
      end: yup.date().required(),
      fio: yup.string(),
      company: yup.string(),
      city: yup.string(),
      section_name: yup.string()
    })
    const { form, errors, handleSubmit, meta } = getForm({
      items: [
        {
          name: 'date',
          props: {
            label: 'Дата проведения докладов'
          }
        },
        {
          name: 'lectures'
        }
      ],
      initialValues: {
        date: new Date(),
        lectures: [
          {
            name: '',
            start: new Date(),
            end: new Date(),
            fio: '',
            company: '',
            city: '',
            section_name: 'qwe',
            section_id: 0
          }
        ]
      },
      validationSchema: yup.object().shape({
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
        section_id: 0,
        section_name: '123'
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

    onBeforeMount(async () => {
      if (isEditMode.value) {
        await store.dispatch('schedule/getScheduleById', route.params.id)

        form.value.date.value = schedule.value.date
        form.value.lectures.value = schedule.value.lectures
      }
    })

    return {
      appendLecture,
      calendarPt,
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
      schedule
    }
  }
}
</script>
