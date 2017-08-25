<template>
  <div>
    <!-- 操作 -->
    <div class="opeartion">
      <div style="float:left;">
        <el-button size="small" type="primary" :disabled="loading[0]" @click="routePush('/foods/edit', null)">添加食材</el-button>
        <el-button size="small" type="primary" :disabled="loading[2]" :loading="loading[2]" @click="refresh()">刷新</el-button>
      </div>
      <div class="right">
        <div v-if="goodsCategoryData.data">
          <el-cascader size="small" placeholder="商品分类" :options="goodsCategoryData.data" v-model="searchGoods" :show-all-levels="false" change-on-select filterable clearable :props="{value: 'id', label: 'name' }"></el-cascader>
        </div>
        <div v-if="foodCategoryData.data">
          <el-select size="small" v-model="searchFood" filterable placeholder="食材分类">
            <el-option v-for="item in foodCategoryData.data" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div>
          <el-input v-model="searchName" size="small" placeholder="请输入内容"> </el-input>
        </div>
        <div>
          <el-button type="primary" size="small" icon="search" @click="search()">搜索</el-button>
        </div>
      </div>
    </div>
    <!-- 食材表格 -->
    <div v-loading.body="loading[0]" :element-loading-text="loading[1]" style="padding-bottom: 20px;">
      <el-table :data="showData" style="width: 100%" ref="multipleTable">
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
        <el-table-column label="价格" min-width="100">
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
        <el-table-column label="库存" min-width="100">
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
        <el-table-column label="进货日期" min-width="120">
          <template scope="scope">
            <el-date-picker @change="rowEdits[scope.row.id].purchaseDate = $event, $refs.modify.rowModify(scope.row)" size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].purchaseDate" type="date" :picker-options="$store.state.dateRules.purchaseDate">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="双击修改" placement="right">
              <span @dblclick="$refs.modify.edit(scope.row)" v-show="!scope.row.edit">{{scope.row.purchaseDate | DateV}} </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="保质期" min-width="120">
          <template scope="scope">
            <el-date-picker size="small" v-if="scope.row.edit" v-model="rowEdits[scope.row.id].hedgeDate" type="date" disabledDate :picker-options="$store.state.dateRules.hedgeDate" @change="rowEdits[scope.row.id].hedgeDate = $event, $refs.modify.rowModify(scope.row)">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="双击修改" placement="right">
              <span @dblclick="$refs.modify.edit(scope.row)" v-show="!scope.row.edit">{{scope.row.hedgeDate | DateV}} </span>
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
    <!-- 分页 -->
    <el-row type="flex" justify="center">
      <div class="page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.index + 1" :page-sizes="[10, 20, 30, 50]" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
// import qs from 'qs'
import { mapState } from 'vuex'
import MinModify from '../00.common/minModify.vue'
export default {
  name: 'foodCategory',
  components: { MinModify },
  data() {
    return {
      // 显示数据
      showData: null,
      // 数据条数
      count: 0,
      // 分页数据
      page: {
        index: 0,
        size: 10,
        good: '',
        food: '',
        name: ''
      },
      // 0显示 1文字 2刷新按钮状态
      loading: [true, '正在加载中...', true],
      // 搜索查询数据
      searchGoods: [],
      searchFood: [],
      searchName: '',
      // 直接编辑数据
      editState: false,
      rowEdit: {
        id: '',
        unitPrice: '',
        inventory: '',
        shelves: false,
        purchaseDate: '',
        hedgeDate: ''
      },
      // 修改的数据与食材id为key
      rowEdits: {}
    }
  },
  computed: {
    ...mapState(['goodsCategoryData', 'foodCategoryData'])
  },
  // 挂载前获取数据
  beforeMount() {
    console.log('....', this.showData)
    if (!this.showData) {
      this.getFoodData()
    }
  },
  methods: {
    refresh() {
      this.page.index = 0
      this.page.good = ''
      this.page.food = ''
      this.getFoodData()
    },
    getFoodData() {
      console.log('搜索过滤', this.page)
      this.loading = [true, '正在加载中...', true]
      let formData = new FormData()
      for (let i in this.page) {
        formData.append(`${i}`, this.page[i])
      }
      this.ajax(
        {
          method: 'post',
          url: `${this.$store.state.apiUrl}/food/page`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
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
      this.page.size = e
      this.getFoodData()
      console.log('条数', e)
    },
    // 页码操作
    handleCurrentChange(e) {
      this.page.index = e - 1
      this.getFoodData()
      console.log('页码', e - 1)
    },
    // 搜索过滤
    search() {
      this.page.good = ''
      this.page.food = this.searchFood
      this.page.name = this.searchName
      if (this.searchGoods.length > 0) {
        this.page.good = this.searchGoods[this.searchGoods.length - 1]
      }
      console.log('搜索过滤', this.page)
      this.getFoodData()
    },
    test() {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
