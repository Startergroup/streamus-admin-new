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
          v-model="form.date.value"
          :invalid="!form.date.value"
          :show-icon="true"
          :show-on-focus="true"
          :pt="calendarPt"
          icon-display="input"
          class="tw-w-[300px]"
          placeholder="12.01.2024"
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
                v-model="item.start"
                :invalid="!item.start"
                :show-icon="true"
                :show-on-focus="true"
                :time-only="true"
                :pt="calendarPt"
                class="tw-w-full"
                icon-display="input"
                placeholder="14:00"
              />
            </div>

            <div class="tw-column-start tw-w-full tw-gap-2">
              <span class="tw-text-sm tw-font-medium tw-text-sky/white">
                Конец доклада
              </span>

              <calendar
                v-model="item.end"
                :invalid="!item.end"
                :show-icon="true"
                :show-on-focus="true"
                :time-only="true"
                :pt="calendarPt"
                class="tw-w-full"
                icon-display="input"
                placeholder="14:00"
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
                :invalid="!item.fio.length"
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
                :invalid="!item.company.length"
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
                :invalid="!item.city.length"
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

export default {
  name: 'schedule-create',
  components: {
    ButtonPrime,
    Calendar,
    InputText
  },
  setup () {
    const lectureSchema = yup.object({
      name: yup.string().required(),
      start: yup.date().required(),
      end: yup.date().required(),
      fio: yup.string().required(),
      company: yup.string().required(),
      city: yup.string().required(),
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
        lectures: [
          {
            name: '',
            start: null,
            end: null,
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
    const onSubmit = handleSubmit((values) => {
      console.debug(values)
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
      removeLecture,
      meta
    }
  }
}
</script>
