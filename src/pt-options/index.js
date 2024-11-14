export const inputPt =  {
  root: ({ props }) => {
    return {
      class: [
        'tw-border tw-min-h-[40px]',
        { 'tw-border-transparent': !props.invalid },
        { 'tw-border-red-500': props.invalid }
      ]
    }
  }
}
export const tablePt = {
  wrapper: {
    class: 'tw-rounded-[4px]'
  },
  bodyrow: {
    class: 'tw-border-b tw-border-ink/darkest'
  }
}
export const textareaPt = {
  root: ({ props }) => {
    return {
      class: [
        'tw-border',
        { 'tw-border-transparent': !props.invalid },
        { 'tw-border-red-500': props.invalid }
      ]
    }
  }
}