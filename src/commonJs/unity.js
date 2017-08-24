const unity = {
  copyObj(data) {
    return JSON.parse(JSON.stringify(data))
  },
  dateFormat(setData, data) {
    console.log(data)
    setData = data.slice(0, 10)
  }
}

export default {
  ...unity
}
