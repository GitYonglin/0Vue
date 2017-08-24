<template>
  <div>
    <div class="opeartion">
      <div style="float:left;">
        <el-button size="small" type="primary" :disabled="loading[0]"  @click="routePush('/foods/edit', null)">添加食材</el-button>
        <el-button size="small" type="primary" :disabled="loading[2]" v-show="loading[0]" :loading="loading[2]" @click="getFoodData()">刷新</el-button>
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
    <div v-loading.body="loading[0]" :element-loading-text="loading[1]" style="padding-bottom: 20px;">
      <el-table :data="showData" style="width: 100%" ref="multipleTable" >
        <el-table-column label="图片" width="86">
          <template scope="scope">
            <img :src="scope.row.pictureText | imgV" alt="没有图片">
          </template>
        </el-table-column>
        <!-- <el-table-column label="ID" prop="id"></el-table-column> -->
        <el-table-column label="名称">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="点击编辑该食材" placement="right">
              <div @click="routePush('/foods/edit', scope.row.id)" style="cursor: pointer;"> {{scope.row.name}} </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="剂量" prop="dose"></el-table-column>
        <el-table-column label="价格" min-width="150">
          <template scope="scope">
            <el-input size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].unitPrice" type="number" @change="$refs.modify.rowModify(scope.row)">
              <template slot="prepend">￥</template>
            </el-input>
            <el-tooltip class="item" effect="dark" content="双击修改" placement="right">
              <span @dblclick="$refs.modify.edit(scope.row)" v-show="!scope.row.edit">
                <i class="price mark-i">￥ </i>{{scope.row.unitPrice}}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="150">
          <template scope="scope">
            <el-input size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].inventory" type="number" @change="$refs.modify.rowModify(scope.row)">
              <template slot="append">g</template>
            </el-input>
            <el-tooltip class="item" effect="dark" content="双击修改" placement="right">
              <span @dblclick="$refs.modify.edit(scope.row)" v-show="!scope.row.edit">{{scope.row.inventory}}
                <i class="mark-i g"> g</i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="进货日期" min-width="200">
          <template scope="scope">
            <el-date-picker @change="rowEdits[scope.row.id].purchaseDate = $event, $refs.modify.rowModify(scope.row)" size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].purchaseDate" type="date" :picker-options="$store.state.dateRules.purchaseDate">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="双击修改" placement="right">
              <span @dblclick="$refs.modify.edit(scope.row)" v-show="!scope.row.edit">{{scope.row.purchaseDate}} </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="保质期" min-width="200">
          <template scope="scope">
            <el-date-picker size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].hedgeDate" type="date" disabledDate :picker-options="$store.state.dateRules.hedgeDate" @change="rowEdits[scope.row.id].hedgeDate = $event, $refs.modify.rowModify(scope.row)">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="双击修改" placement="right">
              <span @dblclick="$refs.modify.edit(scope.row)" v-show="!scope.row.edit">{{scope.row.hedgeDate}} </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="上架" width="100">
          <template scope="scope">
            <div @click.stop="$refs.modify.editCk(scope.row)">
              <i v-show='!scope.row.edit' class="el-icon-circle-check" style="font-size:20px;" :style="{ color: scope.row.shelves ? '#13CE66' : '#cacaca'}"></i>
              <i v-if='scope.row.edit' class="el-icon-circle-check" style="font-size:20px;" :style="{ color: rowEdits[scope.row.id].shelves ? '#13CE66' : '#cacaca'}"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="desc"></el-table-column>
        <el-table-column label="最小购买数量" prop="minNumber"></el-table-column>
        <el-table-column label="最小购买量" prop="minAmount"></el-table-column>
        <el-table-column label="最大购买量" prop="maxAmount"></el-table-column>
        <el-table-column label="修改日期" prop="modifyDateText"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template scope="scope">
            <min-modify :row.sync="scope.row" :rowEdits.sync="rowEdits" :rowEdit="rowEdit" ref="modify" @editSave="editSave" @del="del"></min-modify>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <el-row type="flex" justify="center">
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex + 1"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
  </div>
    </el-row>
  </div>
</template>

<script>
// import qs from 'qs'
import MinModify from '../00.common/minModify.vue'
export default {
  name: 'foodCategory',
  components: { MinModify },
  data() {
    return {
      count: 0,
      pageIndex: 0,
      pageSize: 10,
      // 0显示 1文字 2刷新按钮状态
      loading: [true, '正在加载中...', true],
      msg: '食材概览',
      options: [
        {
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
        }
      ],
      value8: '',
      showData: [],
      editState: false,
      rowEdit: {
        id: '',
        unitPrice: '',
        inventory: '',
        shelves: false,
        purchaseDate: '',
        hedgeDate: ''
      },
      rowEdits: {}
    }
  },
  // 挂载前获取数据
  beforeMount() {
    this.getFoodData()
  },
  methods: {
    getFoodData() {
      this.loading = [true, '正在加载中...', true]
      this.ajax(
        {
          method: 'get',
          url: `${this.$store.state.apiUrl}/food/${this.pageIndex}/${this.pageSize}`
        }
      )
    },
    // 跳转到编辑页面
    routePush(url, row) {
      console.log(row)
      this.$router.push({ name: '食材编辑', params: { id: row } })
    },
    // 修改提交
    editSave(row) {
      // 获取修改日期
      // this.rowEdits[row.id]['modifyDate'] = new Date().toLocaleString()
      this.loading = [true, '数据正在提交...', true]
      let formData = new FormData()
      for (let i in this.rowEdits[row.id]) {
        formData.append(`${i}`, this.rowEdits[row.id][i])
      }
      this.ajax(
        {
          method: 'post',
          url: `${this.$store.state.apiUrl}/food/update`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        },
        '数据保存成功!'
      )
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
        this.loading = [true, '数据正在提交...', true]
        this.ajax(
          {
            method: 'delete',
            url: `${this.$store.state.apiUrl}/food/${id}`
          },
          '删除成功!'
        )
        // this.$axios({
        //   method: 'delete',
        //   url: `${this.$store.state.apiUrl}/food/${id}`
        // }).then(response => {
        //   this.getFoodData()
        //   this.$notify({
        //     title: '成功',
        //     message: '删除成功!',
        //     type: 'success'
        //   })
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // ajax请求
    ajax(header, msg = null) {
      console.log('ajax', header)
      this.$axios(
        header
      ).then(response => {
        if (msg) {
          this.$notify({
            title: '成功',
            message: msg,
            type: 'success'
          })
        }
        this.showData = response.data.data
        this.count = response.data.count
        this.loading = [false, '完成', false]
      }).catch(error => {
        this.loading = [true, `服务器错误!${error}`, false]
      })
    },
    // 显示条数操作
    handleSizeChange(e) {
      this.pageSize = e
      this.getFoodData()
      console.log('条数', e)
    },
    // 页码操作
    handleCurrentChange(e) {
      this.pageIndex = e - 1
      this.getFoodData()
      console.log('页码', e - 1)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
