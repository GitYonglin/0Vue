<template>
  <div>
    <div class="opeartion">
      <div class="right">
        <div>
          <el-input size="small" placeholder="请输入内容" icon="search" @change="querySearch" :on-icon-click="querySearch" v-model="searchData"> </el-input>
        </div>
      </div>
    </div>
    <div>
      <el-tabs v-model="activeTabs" type="card" @tab-click="tabsClick">
        <el-tab-pane label="主料" name="0"></el-tab-pane>
        <el-tab-pane label="辅料" name="1"></el-tab-pane>
        <el-tab-pane label="酱料" name="2"></el-tab-pane>
        <el-tab-pane label="其他" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <el-table :data="foodData" style="width: 100%" ref="multipleTable" v-loading.body="loading">
      <el-table-column label="图片" width="86">
        <template scope="scope">
          <img :src="scope.row.imgUrl" alt="没有图片">
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="价格/剂量=单价" min-width="180">
        <template scope="scope">
          <span>
            <i class="price mark-i">￥ </i>{{scope.row.unitPrice}} / {{scope.row.dose}} = {{(scope.row.unitPrice / scope.row.dose) | priceV}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存">
        <template scope="scope">
          <span>{{scope.row.inventory}} </span>
        </template>
      </el-table-column>
      <el-table-column label="选择" min-width="80">
        <template scope="scope">
          <div type="primary">
            <div @click.stop="editCk(scope.row)">
              <i class="el-icon-circle-check" style="font-size:20px;" :style="{ color: scope.row.select ? '#13CE66' : '#cacaca'}"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'selectFood',
  props: [
    'foods', 'selectFoodEdit', 'foodsSelect'
  ],
  data() {
    return {
      searchData: '',
      msg: '食材概览',
      foodData: [{
        name: '主料',
        imgUrl: '',
        unitPrice: 100,
        dose: 500,
        inventory: 999,
        dosage: 100
      }],
      activeTabs: '0',
      activeTabsLod: '0',
      listLoading: false,
      loading: true
    }
  },
  watch: {
    foodsSelect(val) {
      if (val) {
        // console.log('val', val)
        this.selectOk()
        // this.foodsSelect = JSON.parse(JSON.stringify(this.foods))
      }
    }
  },
  // 挂载前获取数据
  beforeMount() {
    // console.log('0000', this.foodsSelect)
    // this.foodsSelect = JSON.parse(JSON.stringify(this.foods))
    // this.$emit('update:foodsSelect', this.foodsSelect)
    this.getFood()
  },
  methods: {
    // 处理food选中结构
    selectOk() {
      this.loading = true
      // let arr = ['', 'staple', 'season', 'sauce', 'other']
      // console.log('处理数据', this.foodData, this.foodsSelect, this.foodsSelect[this.activeTabs])
      this.foodData = this.foodData.map(v => {
        this.$set(v, 'select', false)
        if (this.foodsSelect[this.activeTabs] && this.foodsSelect[this.activeTabs].length > 0) {
          for (let value of this.foodsSelect[this.activeTabs]) {
            if (value.foodId === v.id) {
              // console.log('22222', key)
              this.$set(v, 'select', true)
              break
            }
          }
        }
        return v
      })
      this.loading = false
      this.activeTabsLod = this.activeTabs
      // console.log('1234568799999', this.foodData)
    },
    // 获取food数据
    getFood(name = '') {
      this.loading = true
      let url = `${this.$store.state.apiUrl}/food?foodCategory_like=${Number(this.activeTabs) + 1}&name_like=${name}`
      this.$axios({
        method: 'get',
        url: url
      }).then(response => {
        this.foodData = response.data
        this.selectOk()
      })
    },
    // 切换选项卡
    tabsClick(tab, event) {
      if (this.activeTabsLod !== this.activeTabs) {
        this.getFood()
      }
    },
    // 搜索数据
    querySearch(el) {
      if (el instanceof Object) {
        el = this.searchData
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.getFood(el)
      }, 3000 * Math.random())
    },
    // 点击选择食材按钮
    editCk(row) {
      // let arr = ['', 'staple', 'season', 'sauce', 'other']
      row.select = !row.select
      if (!this.foodsSelect[this.activeTabs]) {
        this.foodsSelect[this.activeTabs] = []
      }
      if (row.select) {
        this.foodsSelect[this.activeTabs].push({
          foodId: row.id,
          dosage: 0
        })
      } else {
        this.foodsSelect[this.activeTabs] = this.foodsSelect[this.activeTabs].filter(i => i.foodId !== row.id)
      }
      // this.$emit('update:foodsSelect', this.foodsSelect)
      console.log('0101010101', this.foodsSelect)
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
