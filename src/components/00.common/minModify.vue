<template >
  <div>
    <div v-show='!row.edit' type="primary">
      <el-button @click='edit(row)' size="small" icon="edit">修改</el-button>
      <el-button type="danger" size="small" icon="delete" @click="$emit('del', row.id)">删除</el-button>
    </div>
    <div v-if='row.edit'>
      <el-button v-show="row.rowState" type="success" @click="$emit('editSave', row)" size="small" icon="check">保存</el-button>
      <el-button type="danger" @click='row.rowState=false, row.edit=false' size="small" icon="check">取消</el-button>
    </div>
  </div>
</template>

<script >
export default {
  name: 'minModify',
  props: {
    row: Object,
    rowEdits: Object,
    rowEdit: Object
  },
  methods: {
    // 点击上架按钮
    editCk(row) {
      // let row = this.row
      console.log('1111111111', row)
      if (row.edit) {
        this.rowEdits[row.id].shelves = !this.rowEdits[row.id].shelves
      } else {
        this.edit(row)
        this.rowEdits[row.id].shelves = !row.shelves
      }
      this.rowModify(row)
    },
    // 修改数据保存
    // editSave(row) {
    //   // console.log('2222222222')
    //   // for (let key in this.rowEdit) {
    //   //   row[key] = this.rowEdits[row.id][key]
    //   // }
    //   // this.$axios({
    //   //   method: 'patch',
    //   //   url: `${this.$store.state.apiUrl}/cookbook/${row.id}`,
    //   //   headers: {
    //   //     'Content-Type': 'application/json'
    //   //   },
    //   //   data: row
    //   // }).then(response => {
    //   //   this.getFoodData()
    //   //   this.$notify({
    //   //     title: '成功',
    //   //     message: '修改保存成功!',
    //   //     type: 'success'
    //   //   })
    //   // })
    //   // row.edit = false
    //   // this.editState = false
    //   this.$emit('editSave', row)
    // },
    // 修改
    edit(row) {
      console.log(this.serverUrl)
      let l = {}
      for (let key in this.rowEdit) {
        l[key] = row[key]
      }
      this.$set(this.rowEdits, row.id, l)
      console.log('ggggggggggggggg', this.rowEdits, l, row)
      this.rowModify(row)
    },
    // 修改数据检测
    rowModify(row) {
      console.log('111111', row, this.rowEdits[row.id].inventory)
      this.$set(row, 'edit', true)
      this.$set(row, 'rowState', false)
      for (let key in this.rowEdit) {
        if (String(this.rowEdits[row.id][key]) !== String(row[key])) {
          console.log(this.rowEdits[row.id][key], row[key], row.rowState)
          this.$set(row, 'rowState', true)
        }
      }
    }
  }
}
</script>

