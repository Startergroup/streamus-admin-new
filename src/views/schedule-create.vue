<template>
  <form
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
          :model-value="new Date(form.date.value)"
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
            @click="removeLecture(index)"
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
import { inputPt } from '@/pt-options'
import { getForm } from '@/composables/form.composables'
import { useStore } from 'vuex'

export default {
  name: 'schedule-create',
  components: {
    ButtonPrime,
    Calendar,
    InputText
  },
  setup () {
    const store = useStore()

    const lectureSchema = yup.object({
      name: yup.string().required(),
      start: yup.number().required(),
      end: yup.number().required(),
      fio: yup.string(),
      company: yup.string(),
      city: yup.string(),
      section: yup.string()
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
        date: Date.now(),
        lectures: [
          {
            name: '',
            start: Date.now(),
            end: Date.now(),
            fio: '',
            company: '',
            city: '',
            section: ''
          }
        ]
      },
      validationSchema: yup.object().shape({
        date: yup.string().required(),
        lectures: yup.array().of(lectureSchema).min(1)
      })
    })
    const onSubmit = handleSubmit(async (values) => {
      await store.dispatch('schedule/createSchedule', values)
    })

    const appendLecture = () => {
      form.value.lectures.value.push({
        name: '',
        start: null,
        end: null,
        fio: '',
        company: '',
        city: '',
        section: ''
      })
    }
    const removeLecture = (index) => {
      form.value.lectures.value.splice(index, 1)
    }

    const onUpdateDate = (date, property) => {
      form.value[property].value = date.getTime()
    }
    const onUpdateTime = (date, property, index) => {
      form.value.lectures.value[index][property] = date.getTime()
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

    return {
      appendLecture,
      calendarPt,
      errors,
      form,
      inputPt,
      onSubmit,
      onUpdateDate,
      onUpdateTime,
      removeLecture,
      meta
    }
  }
}
</script>
