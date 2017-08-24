<template>
  <div>
    <div v-for="(item, index) in goodsSelectData" :key="index" style="float:left">
      <p>{{item[0].setGoodsSelect}}</p>
      <el-cascader @change="goodsSelect" v-model="item[0].setGoodsSelect" :options="item" change-on-select expand-trigger="hover" size="small" clearable :placeholder="item[0].name" :props="{value: 'id', label:'name' }"></el-cascader>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    goodsCategorySelectData: Array
  },
  data() {
    return {
      goodsSelectData: null
    }
  },
  // 挂载前获取数据
  beforeMount() {
    console.log('123123123', this.$store.state.goodsCategoryData)
    if (!this.goodsCategoryData) {
      this.$store.dispatch('goodsCategoryData')
    } else if (this.goodsCategorySelectData) {
      this.dealGoods()
    }
  },
  watch: {
    goodsCategoryData() {
      console.log('aaaaaaaaaaaaaaaaaaaaa', this.goodsCategoryData)
      this.dealGoods()
    },
    goodsCategorySelectData(val) {
      console.log('1010000000000  ')
      this.dealGoods()
    }
  },
  // 计算属性
  computed: {
    ...mapState({
      goodsCategoryData: 'goodsCategoryData'
    })
  },
  methods: {
    // 处理商品分类显示
    dealGoods() {
      let d = this.$unity.copyObj(this.goodsCategoryData.data)
      try {
        if (d) {
          let arr = []
          for (let item of d) {
            // item.setGoodsSelect = []
            let s = []
            if (this.goodsCategorySelectData) {
              s = this.goodsCategorySelectData.filter(i => i === item.id)
              if (s.length > 0) {
                let l = item['children']
                if (l) {
                  for (let item2 of l) {
                    let l2 = this.goodsCategorySelectData.filter(i => i === item2.id)
                    if (l2.length > 0) {
                      l = item['children']
                      s.push(l2[0])
                    }
                  }
                }
              }
            }
            item.setGoodsSelect = s
          }
          for (let item of d) {
            arr.push([item])
          }
          this.goodsSelectData = arr.concat()
          this.goodsSelect()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 选择商品分类时
    goodsSelect() {
      let arr = []
      for (let item of this.goodsSelectData) {
        if (item[0].setGoodsSelect) {
          arr = arr.concat(item[0].setGoodsSelect)
        }
      }
      console.log(arr)
      console.log('gx', this.goodsCategoryData)
      this.$emit('update:foo', arr)
      // this.$emit('goodsSelect', {data: arr})
    }
  }
}
</script>
