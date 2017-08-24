import axios from 'axios'

const ajax = {
  getFood(data, url = '') {
    axios({
      method: 'get',
      url: `${this.$store.state.apiUrl}/food${url}`
    }).then(response => {
      console.log('ajax00000', data)
      data = [response.data, false]
      console.log('ajax', data)
    })
  }
}

export default {
  ...ajax
}
