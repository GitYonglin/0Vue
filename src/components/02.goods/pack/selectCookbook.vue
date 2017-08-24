<template>
  <div>
    <div style="padding-bottom: 15px">
      <el-button type="primary" @click="addSelect(), selectEdit = true" size="small"> 添加菜谱 </el-button>
    </div>
    <!--  选择食材  -->
    <el-dialog title="选择食材" :visible.sync="selectEdit" size="large">
      <div class="opeartion">
        <div class="right">
          <div>
            <el-cascader size="small" :options="goodsCategoryData" change-on-select filterable clearable v-model="searchCategore" :props="{value: 'id', label:'name' }"></el-cascader>
          </div>
          <div>
            <el-input size="small" placeholder="请输入内容" filterable v-model="searchName"> </el-input>
          </div>
          <div>
            <el-button size="small" type="primary" icon="search" @click="querySearch">搜索</el-button>
          </div>
        </div>
      </div>
      <el-table :data="selectData" style="width: 100%" ref="multipleTable" v-loading.body="selectLoading">
        <el-table-column label="图片" width="86">
          <template scope="scope">
            <img :src="scope.row.pictureText | imgV" alt="没有图片">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="价格" min-width="180">
          <template scope="scope">
            <span>
              <i class="price mark-i">￥ </i>
              {{scope.row.unitPrice | priceV}}
            </span>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectEdit = false">取 消</el-button>
        <el-button type="primary" @click="ok()">确 定</el-button>
      </span>
    </el-dialog>
    <!--  选好的菜谱  -->
    <el-table :data="selectOkData" v-loading.body="selectOkLoading" style="width: 100%" ref="multipleTable">
      <el-table-column label="图片" width="86">
        <template scope="scope">
          <img :src="scope.row.pictureText | imgV" alt="没有图片">
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="价格/剂量=单价" min-width="180">
        <template scope="scope">
          <span>
            <i class="price mark-i">￥ </i>{{scope.row.unitPrice | priceV}}</span>
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
            <i class="price mark-i">￥ </i>{{(scope.row.unitPrice * scope.row.dosage) | priceV}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用量" min-width="125">
        <template scope="scope">
          <el-input size="small" v-model.number="scope.row.dosage" type="number" @change="sumPrice(scope.row)">
            <template slot="end">份</template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template scope="scope">
          <div type="primary">
            <el-button size="small" icon="delete" @click="del(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'selectCookbook',
  computed: {
    ...mapState(['goodsCategoryData'])
  },
  props: [
    'data'
  ],
  data() {
    return {
      searchCategore: [],
      searchName: '',
      listLoading: false,
      selectEdit: false,
      selectData: [],
      selectOkData: [],
      selectOkLoading: false,
      selectLoading: false
    }
  },
  watch: {
    data() {
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
      this.getData()
    },
    // 获取菜谱数据
    getData(search = '') {
      this.selectLoading = true
      this.$axios({
        method: 'get',
        url: `${this.$store.state.apiUrl}/cookbook${search}`
      }).then(response => {
        this.selectData = this.selectOk(response.data)
        console.log('000000', this.selectData)
      })
    },
    // 搜索数据
    querySearch() {
      let l = `?goodsCategory_like=${this.searchCategore[this.searchCategore.length - 1] ? this.searchCategore[this.searchCategore.length - 1] : ''}&name_like=${this.searchName}`
      console.log(this.searchCategore, this.searchName, l)
      this.getData(l)
    },
    // 判断已选择数据处理
    selectOk(data) {
      let select = this.data.cookbooks
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
    // 确定选择食材
    ok() {
      this.selectOkLoading = true
      let select = this.data.cookbooks
      console.log('获取选择food数据和处理', select)
      this.selectEdit = false
      let urls = ''
      try {
        let ids = []
        if (select) {
          select.forEach((value, key) => {
            ids.push(value.id)
          })
          urls = ids.join('&id=')
        }
        this.$axios({
          method: 'get',
          url: `${this.$store.state.apiUrl}/cookbook?id=${urls}`
        }).then(response => {
          this.$set(this, 'selectOkData', response.data.map(v => {
            console.log(select.filter(i => i.id === v.id))
            this.$set(v, 'dosage', select.filter(i => i.id === v.id)[0].dosage)
            this.$set(v, 'edit', true)
            return v
          }))
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.sumPrice()
      }
    },
    // 点击选择食材按钮
    editCk(row) {
      let select = this.data.cookbooks
      row.select = !row.select
      console.log('8888888888', row)
      if (row.select) {
        select.push({
          id: row.id,
          dosage: 0
        })
      } else {
        this.data.cookbooks = select.filter(i => i.id !== row.id)
      }
      // this.$emit('update:foodsSelect', this.foodsSelect)
      console.log('0101010101', this.data)
    },
    sumPrice(row = '') {
      if (row) {
        this.data.cookbooks = this.data.cookbooks.map(v => {
          if (v.id === row.id) {
            v.dosage = row.dosage
          }
          return v
        })
      }
      let price = 0
      this.selectOkData.forEach((value) => {
        if (value.unitPrice && value.dosage) {
          price += (value.unitPrice * value.dosage)
        }
      })
      if (row && !this.data.foodsPrice) {
        this.data.foodsPrice = 0
      }
      this.data.cookbooksPrice = price
      if (row) {
        this.data.unitPrice = (price + this.data.foodsPrice).toFixed(2)
      }
      console.log('1223123000000000000000000000000000', this.data.unitPrice)
      this.selectOkLoading = false
    },
    del(id) {
      this.selectOkData = this.selectOkData.filter(i => i.id !== id)
      this.data.cookbooks = this.data.cookbooks.filter(i => i.id !== id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
