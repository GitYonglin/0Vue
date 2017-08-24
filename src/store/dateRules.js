const data = {
  purchaseDate: {
    disabledDate(time) {
      return time.getTime() > Date.now()
    }
  },
  hedgeDate: {
    // 禁用小于今天日期
    disabledDate(time) {
      return time.getTime() < Date.now()
    },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '明天',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周后',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }, {
      text: '一月后',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
        picker.$emit('pick', date)
      }
    }]
  }
}

export default {
  ...data
}
