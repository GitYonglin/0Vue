<template>
  <div>
    <div class="opeartion">
      <div style="float:left;">
        <el-button size="small" type="primary" @click="routePush('/goods/simgle/edit')">添加单品</el-button>
        <el-button size="small" type="primary" @click="routePush('/goods/cookbook/edit')">添加菜谱</el-button>
        <el-button size="small" type="primary" @click="routePush('/goods/pack/edit')">添加套餐</el-button>
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
      <el-table :data="tableData5" v-loading.body="listLoading" style="width: 100%" ref="multipleTable">
        <el-table-column label="图片" width="86">
          <template scope="scope">
            <img :src="scope.row.imgUrl" alt="没有图片">
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名称">
          <template scope="scope">
            <div @click="routePush('/foods/edit',123)">{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="100">
          <template scope="scope">
            <el-input size="small" v-show="scope.row.edit" v-model="editData.price" type="number" @change="editFunc(scope.row,$event)">
              <template slot="prepend">￥</template>
            </el-input>
            <span v-show="!scope.row.edit">
              <i class="price mark-i">￥ </i>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="100">
          <template scope="scope">
            <el-input size="small" v-show="scope.row.edit" v-model="editData.number" type="number" @change="editFunc(scope.row,$event)">
              <template slot="append">g</template>
            </el-input>
            <span v-show="!scope.row.edit">{{scope.row.number}}
              <i class="mark-i g"> g</i>
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
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <div v-show='!scope.row.edit' type="primary">
              <el-button @click='edit(scope.row)' size="small" icon="edit">修改</el-button>
              <el-button size="small" icon="delete">删除</el-button>
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
      tableData5: null,
      listLoading: false,
      editIf: false,
      modify: false,
      editData: {
        price: '',
        number: '',
        shelves: false
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
  methods: {
    // 跳转到编辑页面
    routePush(url, data) {
      console.log(data)
      this.$router.push({ path: url, query: { id: data } })
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
        this.editData.shelves = !row.shelves
        row.edit = true
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
        row.edit = true
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
      row.edit = false
      this.editIf = false
      this.$message.success('数据保存成功')
    },
    editFunc(row) {
      for (let key in this.editData) {
        if (String(this.editData[key]) !== String(row[key])) {
          this.modify = true
          return
        }
      }
      this.modify = false
    }
  },
  created() {
    // this.$axios({
    //   method: 'get',
    //   url: 'http://192.168.31.119/Home/tabdata'
    // }).then(response => {
    //   this.tableData5 = response.data.map(v => {
    //     v.edit = false
    //     return v
    //   })
    //   console.log(response.status)
    //   console.log(response.statusText)
    //   console.log(response.headers)
    //   console.log(response.config)
    // })
    this.tableData5 = this.$store.state.tabData
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
