import { useForm } from 'vee-validate'
import { ref } from 'vue'

/**
 * @param { { name: string, options: {}, props: {} }[] } - items - Массив объектов, каждый из которых описывает поле формы. В свойстве options мы можем передавать дополнительные параметры предусмотренные VeeValidate.
 * @param { key: string|number } - initialValues - начальные значения для полей фромы
 * @return {{ errors: {}, form: { key: { value: any, attrs: any } }, handleSubmit: fn, handleReset: fn, resetForm: fn, values: {} }}
 */
export const getForm = ({ items, initialValues = {}, validationSchema }) => {
  const form = ref({})
  const { values, errors, defineField, handleSubmit, resetForm, handleReset } = useForm({
    validationSchema,
    initialValues
  })

  form.value = items.reduce((obj, item) => {
    const [value, attrs] = defineField(item.name, item?.options || {})

    obj[item.name] = {
      attrs,
      name: item.name,
      props: item.props,
      value
    }

    return obj
  }, {})

  return {
    errors,
    form,
    handleSubmit,
    handleReset,
    resetForm,
    values
  }
}
