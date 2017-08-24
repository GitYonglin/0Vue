<template>
  <div v-loading.body="listLoading">
    <div class="opeartion">
      <div style="float:left;">
        <el-button size="small" type="primary" @click="routePush('套餐编辑')">添加套餐</el-button>
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
      <el-table :data="showData"  style="width: 100%" ref="multipleTable">
        <el-table-column label="图片" width="86">
          <template scope="scope">
            <img :src="scope.row.pictureText | imgV" alt="没有图片">
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名称">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="点击编辑该菜谱" placement="right">
              <div @click="routePush('套餐编辑', scope.row.id)" style="cursor: pointer;"> {{scope.row.name}} </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="150">
          <template scope="scope">
            <span >
              <i class="price mark-i">￥ </i>{{scope.row.unitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="150">
          <template scope="scope">
            <!-- <el-input size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].inventory" type="number" @change="rowModify(scope.row)"> -->
            <el-input size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].inventory" type="number" @change="$refs.modify.rowModify(scope.row)">
              <template slot="append">份</template>
            </el-input>
             <el-tooltip class="item" effect="dark" content="双击编辑" placement="right">
              <span @dblclick="$refs.modify.edit(scope.row)" v-show="!scope.row.edit">{{scope.row.inventory}}
                <i class="mark-i g"> 份</i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="上架" width="100">
          <template scope="scope">
            <div @click.stop="$refs.modify.editCk(scope.row)">
              <i v-show='!scope.row.edit' class="el-icon-circle-check" style="font-size:20px;" :style="{ color: scope.row.shelves ? '#13CE66' : '#cacaca'}"></i>
              <i v-if='scope.row.edit' class="el-icon-circle-check" style="font-size:20px;" :style="{ color: rowEdits[scope.row.id].shelves ? '#13CE66' : '#cacaca'}">{{rowEdits[scope.row.id].shelves}}</i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改日期" prop="modifyDate" min-width="135"></el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
           <template scope="scope">
            <min-modify :row.sync="scope.row" :rowEdits.sync="rowEdits" :rowEdit="rowEdit" ref="modify" @editSave="editSave" @del="del"></min-modify>
          </template>   
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// import qs from 'qs'
import MinModify from '../../00.common/minModify.vue'

export default {
  name: 'cookbook',
  components: {MinModify},
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
      listLoading: true,
      editState: false,
      rowEdit: {
        inventory: '',
        shelves: false
      },
      rowEdits: {}
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
    console.log('777777777777777777777777777777777777777777')
    this.getFoodData()
  },
  methods: {
    getFoodData() {
      this.listLoading = true
      this.$axios({
        method: 'get',
        url: `${this.$store.state.apiUrl}/pack`
      }).then(response => {
        console.log(response.data)
        this.showData = response.data
        this.listLoading = false
      })
    },
    // 跳转到编辑页面
    routePush(name, row = null) {
      console.log(row)
      this.$router.push({ name: name, params: { id: row } })
    },
    // 修改数据保存
    editSave(row) {
      // 获取修改日期
      this.rowEdits[row.id]['modifyDate'] = new Date().toLocaleString()
      console.log('2222222222', this.rowEdits[row.id])
      this.$axios({
        method: 'patch',
        url: `${this.$store.state.apiUrl}/pack/${row.id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: this.rowEdits[row.id]
      }).then(response => {
        this.getFoodData()
        this.$notify({
          title: '成功',
          message: '修改保存成功!',
          type: 'success'
        })
      })
      row.edit = false
      this.editState = false
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
          url: `${this.$store.state.apiUrl}/pack/${id}`
        }).then(response => {
          this.getFoodData()
          this.$notify({
            title: '成功',
            message: '删除成功!',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 跨域测试
    postTest() {
      this.$axios({
        method: 'get',
        url: 'http://localhost:65284/Home/tabdata',
        // 跨域测试 把cookie带在头部请求
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
