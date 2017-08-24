<template>
    <div>
      <el-table :data="foodData[foodIndex]" v-loading.body="listLoading" style="width: 100%" ref="multipleTable">
        <el-table-column label="图片" width="86">
          <template scope="scope">
            <img :src="scope.row.imgUrl" alt="没有图片">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="价格/剂量=单价" min-width="180">
          <template scope="scope">
            <span >
              <i class="price mark-i">￥ </i>{{scope.row.unitPrice}} / {{scope.row.dose}} = {{(scope.row.unitPrice / scope.row.dose) | priceV}}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存">
          <template scope="scope">
            <span >{{scope.row.inventory}} </span>
          </template>
        </el-table-column>
        <el-table-column label="单价" min-width="100">
          <template scope="scope">
            <span >
              <i class="price mark-i">￥ </i>{{((scope.row.unitPrice / scope.row.dose) * scope.row.dosage) | priceV}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用量" min-width="125">
          <template scope="scope">
            <el-input size="small" v-model.number="scope.row.dosage" type="number" @change="sumPrice">
            <!-- <el-input size="small" v-model="scope.row.dosage" type="number" @blur="blurEdit(scope.row,$event)" @focus="blurEdit(scope.row,$event)" @change="editFunc(scope.row,$event)"> -->
              <template slot="end">g</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template scope="scope">
            <div type="primary">
              <!-- <el-button v-show='!scope.row.edit' type="success" @click='editSave(scope.row)' size="small" icon="check">保存</el-button>
              <el-button v-show='!scope.row.edit' type="danger" @click='editIf=false, scope.row.edit=false' size="small" icon="check">取消</el-button> -->
              <el-button size="small" icon="delete"  @click="del(scope.row.id, foodIndex)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  name: 'selectOk',
  props: ['foodData', 'foodIndex'],
  data() {
    return {
      listLoading: false
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
    editFunc(row, e) {
      console.log(e, row.dosage, row.dosageOld)
      row.edit = false
      if (row.dosage === row.dosageOld) {
        row.edit = true
      }
    },
    blurEdit(row, e) {
      row.dosageOld = row.dosage
      console.log(row.dosage, row.dosageOld)
    },
    del(id, index) {
      this.$emit('del', {id, index})
    },
    sumPrice() {
      let price = 0
      for (let i = 0; i < 4; i++) {
        console.log('000000000', this.foodData[i])
        this.foodData[i].forEach((value) => {
          if (value.unitPrice && value.dose && value.dosage) {
            price += ((value.unitPrice / value.dose) * value.dosage)
          }
        })
      }
      this.$emit('update:unitPrice', Number(price.toFixed(2)))
      console.log(price)
      // value.forEach((value2) => {
      // })
      // if (value.unitPrice && value.dose && value.dosage) {
      //   price += ((value.unitPrice / value.dose) * value.dosage)
      // }
      // clearTimeout(this.timeout)
      // this.timeout = setTimeout(() => {
      //   console.log(price)
      // }, 3000 * Math.random())
      // console.log(this.foodData.foods)
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
