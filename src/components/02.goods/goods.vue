<template>
  <div>
    <div class="opeartion">
      <div style="float:left;">
        <el-button size="small" type="primary" @click="routePush('食材编辑')">添加食材</el-button>
        <el-button size="small" type="primary" @click="routePush('菜谱编辑')">添加食材</el-button>
        <el-button size="small" type="primary" @click="routePush('套餐编辑')">添加食材</el-button>
        <el-button size="small" type="primary" @click="postTest">跨域测试</el-button>
      </div>
      <div class="right">
        <div>
          <el-select size="small" v-model="value8" filterable placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <el-input size="small" placeholder="请输入内容"> </el-input>
        </div>
        <div>
          <el-button type="primary" size="small" icon="search">搜索</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-table :data="showData" v-loading.body="listLoading" style="width: 100%" ref="multipleTable">
        <el-table-column label="图片" width="86">
          <template scope="scope">
            <img :src="scope.row.pictureText[0].imgUrl" alt="没有图片">
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名称">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="点击编辑该菜谱" placement="right">
              <div @click="routePush('菜谱编辑', scope.row.id)" style="cursor: pointer;"> {{scope.row.name}} </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="150">
          <template scope="scope">
            <el-input size="small" v-show="scope.row.edit" v-model="editData.unitPrice" type="number" @change="editFunc(scope.row,$event)">
              <template slot="prepend">￥</template>
            </el-input>
            <span v-show="!scope.row.edit">
              <i class="price mark-i">￥ </i>{{scope.row.unitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="150">
          <template scope="scope">
            <el-input size="small" v-show="scope.row.edit" v-model="editData.inventory" type="number" @change="editFunc(scope.row,$event)">
              <template slot="append">份</template>
            </el-input>
            <span v-show="!scope.row.edit">{{scope.row.inventory}}
              <i class="mark-i g"> 份</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="上架" width="100">
          <template scope="scope">
            <div @click.stop="editCk(scope.row)">
              <i v-show='!scope.row.edit' class="el-icon-circle-check" style="font-size:20px;" :style="{ color: scope.row.shelves ? '#13CE66' : '#cacaca'}"></i>
              <i v-show='scope.row.edit' class="el-icon-circle-check" style="font-size:20px;" :style="{ color: editData.shelves ? '#13CE66' : '#cacaca'}"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改日期" prop="createDate" min-width="135"></el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template scope="scope">
            <div v-show='!scope.row.edit' type="primary">
              <el-button @click='edit(scope.row)' size="small" icon="edit">修改</el-button>
              <el-button size="small" icon="delete"  @click="del(scope.row.id)">删除</el-button>
            </div>
            <div v-show='scope.row.edit'>
              <el-button v-show="modify" type="success" @click='editSave(scope.row)' size="small" icon="check">保存</el-button>
              <el-button type="danger" @click='editIf=false, scope.row.edit=false' size="small" icon="check">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// import qs from 'qs'
export default {
  name: 'foodCategory',
  data() {
    return {
      msg: '食材概览',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value8: '',
      showData: null,
      listLoading: false,
      editIf: false,
      modify: false,
      editData: {
        unitPrice: '',
        inventory: '',
        shelves: false,
        purchaseDate: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('123456', this)
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
  },
  // 挂载前获取数据
  beforeMount() {
    this.getFoodData()
  },
  methods: {
    getFoodData() {
      this.$axios({
        method: 'get',
        url: `${this.$store.state.apiUrl}/cookbook`
      }).then(response => {
        console.log(response.data)
        this.showData = response.data
      })
    },
    // 跳转到编辑页面
    routePush(name, row = null) {
      console.log(row)
      this.$router.push({ name: name, params: { id: row } })
    },
    // 点击上架按钮
    editCk(row) {
      console.log('1111111111')
      if (row.edit) {
        this.editData.shelves = !this.editData.shelves
      } else if (this.editIf) {
        this.$message.error('其他数据未完成操作!')
      } else {
        this.editData.price = row.price
        this.editData.number = row.number
        this.editData.purchaseDate = row.purchaseDate
        this.editData.shelves = !row.shelves
        this.$set(row, 'edit', true)
        this.editIf = true
      }
      this.editFunc(row)
    },
    // 点击修改
    edit(row) {
      console.log('3333333333')
      if (this.editIf) {
        this.$message.error('其他数据未完成操作!')
      } else {
        for (let key in this.editData) {
          this.editData[key] = row[key]
        }
        // row.edit = true
        this.$set(row, 'edit', true)
        this.editIf = true
      }
      this.editFunc(row)
    },
    // 修改数据保存
    editSave(row) {
      console.log('2222222222')
      for (let key in this.editData) {
        row[key] = this.editData[key]
      }
      this.$axios({
        method: 'patch',
        url: `${this.$store.state.apiUrl}/cookbook/${row.id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: row
      }).then(response => {
        this.$message.success('数据保存成功')
        this.getFoodData()
      })
      row.edit = false
      this.editIf = false
    },
    editFunc(row) {
      for (let key in this.editData) {
        if (String(this.editData[key]) !== String(row[key])) {
          this.modify = true
          return
        }
      }
      this.modify = false
    },
    // 删除数据
    del(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'delete',
          url: `${this.$store.state.apiUrl}/cookbook/${id}`
        }).then(response => {
          this.getFoodData()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 跨域测试
    postTest() {
      this.$axios({
        method: 'get',
        url: 'http://localhost:65284/Home/tabdata',
        withCredentials: true
      }).then(sss => {
        console.log(sss.data)
        // console.log(sss.status)
        // console.log(sss.statusText)
        // console.log(sss.headers)
        // console.log(sss.config)
        console.log('OK222222222')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.opeartion {
  margin-bottom: 15px;
  overflow: hidden;
  .right {
    float: right;
    div {
      float: left;
      margin-right: 10px;
    }
  }
}
</style>
