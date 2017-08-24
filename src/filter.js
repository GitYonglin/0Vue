import Vue from 'vue'

const filter = {
  imgV: Vue.filter('imgV', (value) => {
    if (!value && value.length > 0) {
      return value[0]
    }
    return ''
  })
}

export default {
  ...filter
}
