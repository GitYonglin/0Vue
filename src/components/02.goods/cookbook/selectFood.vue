<template>
  <div>
    <div style="padding-bottom: 15px">
      <el-button type="primary" @click="addSelect()" size="small"> 添加食材 </el-button>
    </div>
    <el-dialog title="选择食材" :visible.sync="selectEdit" size="large" >
      <!-- 选择食材  -->
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
            <el-tab-pane :label="item" :name="index+''" v-for="(item, index) in groupSelectOk" :key="index"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="selectData" style="width: 100%" ref="multipleTable" v-loading.body="selectLoading">
          <el-table-column label="图片" width="86">
            <template scope="scope">
              <img :src="scope.row.pictureText | imgV" alt="没有图片">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectFoodEdit = false">取 消</el-button>
        <el-button type="primary" @click="ok()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择好的食材  -->
    <el-collapse v-model="groupSelectOkShow" >
      <el-collapse-item :name="index" v-for="(item, index) in groupSelectOk" :key="index">
        <template slot="title">
          {{item}}{{index}}
        </template>
        <el-table :data="selectOkData[index]" style="width: 100%" ref="multipleTable" v-loading.body="selectOkLoading">
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
          <el-table-column label="单价" min-width="100">
            <template scope="scope">
              <span>
                <i class="price mark-i">￥ </i>{{((scope.row.unitPrice / scope.row.dose) * scope.row.dosage) | priceV}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用量" min-width="125">
            <template scope="scope">
              <el-input size="small" v-model.number="scope.row.dosage" type="number" @change="sumPrice(scope.row.id, index, scope.row.dosage)">
                <template slot="end">g</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template scope="scope">
              <div type="primary">
                <el-button size="small" icon="delete" @click="del(scope.row.id, index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  
  </div>
</template>

<script>
export default {
  name: 'selectFood',
  props: ['data'],
  data() {
    return {
      selectEdit: false,
      searchData: '',
      group: [],
      msg: '食材概览',
      selectOkData: {},
      selectData: [],
      groupSelectOkShow: [0, 1, 2, 3],
      groupSelectOk: ['主料', '辅料', '酱料', '其他'],
      activeTabs: '0',
      activeTabsLod: '0',
      selectOkLoading: false,
      selectLoading: false
    }
  },
  watch: {
    data() {
      console.log('数据有变化')
      this.ok()
      this.getData()
    }
  },
  // 挂载前获取数据
  beforeMount() {
    // this.data = this.$unity.copyObj(this.$store.state.base.packBase)
    console.log('123123112312111111111111111111111111111', this.data)
    this.ok()
    this.getData()
  },
  methods: {
    // 添加
    addSelect() {
      this.selectEdit = true
      this.getData()
    },
    // 判断已选择数据处理
    selectOk(data) {
      let select = this.data.foods[this.activeTabs]
      return data.map(v => {
        this.$set(v, 'select', false)
        if (select && select.length > 0) {
          for (let value of select) {
            if (value.id === v.id) {
              // console.log('22222', key)
              this.$set(v, 'select', true)
              break
            }
          }
        }
        this.selectLoading = false
        return v
      })
    },
    // 获取food数据
    getData(name = '') {
      this.selectLoading = true
      let url = `${this.$store.state.apiUrl}/food?foodCategory_like=${Number(this.activeTabs) + 1}&name_like=${name}`
      this.$axios({
        method: 'get',
        url: url
      }).then(response => {
        this.selectData = this.selectOk(response.data)
      })
    },
    // 切换选项卡
    tabsClick(tab, event) {
      console.log(this.activeTabs)
      this.getData()
    },
    // 搜索数据
    querySearch(el) {
      if (el instanceof Object) {
        this.getData(this.searchData)
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.getData(el)
      }, 3000 * Math.random())
    },
    // 点击选择食材按钮
    editCk(row) {
      let select = this.data.foods[this.activeTabs]
      console.log('select', select)
      if (!select) {
        select = []
      }
      row.select = !row.select
      console.log('8888888888', row)
      if (row.select) {
        select.push({
          id: row.id,
          dosage: 0
        })
      } else {
        select = select.filter(i => i.id !== row.id)
      }
      this.data.foods[this.activeTabs] = select
      console.log('0101010101', this.data)
    },
    ok() {
      this.selectEdit = false
      this.selectOkLoading = true
      let urls = []
      try {
        this.data.foods.forEach((item, index) => {
          let ids = []
          if (item) {
            item.forEach((value, key) => {
              ids.push(value.id)
            })
            urls[index] = ids.join('&id=')
          }
        })
        this.$axios.all([
          this.$axios.get(`${this.$store.state.apiUrl}/food?id=${urls[0]}`),
          this.$axios.get(`${this.$store.state.apiUrl}/food?id=${urls[1]}`),
          this.$axios.get(`${this.$store.state.apiUrl}/food?id=${urls[2]}`),
          this.$axios.get(`${this.$store.state.apiUrl}/food?id=${urls[3]}`)
        ]).then(response => {
          response.forEach((value, key) => {
            console.log('bbbbb', this.data.foods[key], value.data, urls)
            this.$set(this.selectOkData, key, value.data.map(v => {
              this.$set(v, 'dosage', this.data.foods[key].filter(i => i.id === v.id)[0].dosage)
              this.$set(v, 'edit', true)
              return v
            }))
          })
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.sumPrice()
      }
      console.log(this.selectOkData)
    },
    // 
    sumPrice(id, index, e) {
      if (id) {
        this.data.foods[index] = this.data.foods[index].map(v => {
          if (v.id === id) {
            v.dosage = e
          }
          return v
        })
      }
      let price = 0
      for (let i = 0; i < 4; i++) {
        console.log('000000000', this.selectOkData[i])
        if (this.selectOkData[i]) {
          this.selectOkData[i].forEach((value) => {
            if (value.unitPrice && value.dose && value.dosage) {
              price += ((value.unitPrice / value.dose) * value.dosage)
            }
          })
        }
      }
      this.data.unitPrice = price.toFixed(2)
      console.log(price, this.data.unitPrice)
      this.selectOkLoading = false
    },
    del(id, index) {
      this.selectOkData[index] = this.selectOkData[index].filter(i => i.id !== id)
      this.data.foods[index] = this.data.foods[index].filter(i => i.id !== id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
