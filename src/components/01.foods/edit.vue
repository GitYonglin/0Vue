<!--'Content-Type': 'application/x-www-form-urlencoded'-->
<!--'Content-Type': 'multipart/form-data' 包含文件请求-->
<template>
  <div>
    <h1>{{$route.query.id}}</h1>
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-tabs v-model="activeName">
         <el-tab-pane label="基本信息" name="a">
          <el-form-item label="食材名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="食材描述" prop="desc">
            <el-input name="formData.desc" type="textarea" v-model="formData.desc"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="unitPrice">
            <el-input type="price" v-model.number="formData.unitPrice" @blur="price2(formData.unitPrice)">
              <template slot="prepend">
                ¥
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="剂量" prop="dose">
            <el-input v-model.number="formData.dose" min="0">
              <template slot="append">
                g
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存" prop="inventory">
            <el-input v-model.number="formData.inventory" min="0">
              <template slot="append">
                g
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最小购买数量" prop="minNumber">
            <el-input v-model.number="formData.minNumber" min="0"> </el-input>
          </el-form-item>
          <el-form-item label="最小购买量" prop="minAmount" min="0">
            <el-input v-model.number="formData.minAmount">
              <template slot="append">
                g
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最大购买量" prop="maxAmount">
            <el-input v-model.number="formData.maxAmount" min="0">
              <template slot="append">
                g
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否上架">
            <input type="text" name="formData.shelves" v-model="formData.shelves" hidden="hidden">
            <el-switch v-model="formData.shelves" on-text="YES" off-text="NO" @change="formData.shelves = $event" :width="60"> </el-switch>
          </el-form-item>
          <el-form-item label="进货日期" required>
            <el-col :span="11">
              <el-form-item prop="purchaseDate">
                <el-date-picker 
                  @change="formData.purchaseDate = $event" 
                  type="date" 
                  placeholder="选择日期" 
                  v-model="formData.purchaseDate" 
                  style="width: 100%;"
                  :picker-options="$store.state.dateRules.purchaseDate"
                  >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="保值日期" required>
            <el-col :span="11">
              <el-form-item prop="hedgeDate">
                <el-date-picker 
                  @change="formData.hedgeDate = $event" 
                  type="date" 
                  placeholder="选择日期" 
                  v-model="formData.hedgeDate" 
                  style="width: 100%;"
                  :picker-options="$store.state.dateRules.hedgeDate"
                  >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <hr>
          <el-form-item label="食材分类选择" prop="foodCategory">
            <el-checkbox-group v-model="formData.foodCategory">
              <el-checkbox v-for="(item, index) in foodCategory.data" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="商品分类选择">
            <goods-category-select :goodsCategorySelectData="formData.goodsCategory" :foo.sync="syncgoodsCategory"></goods-category-select>
          </el-form-item>
        </el-tab-pane> 
         <el-tab-pane label="图文描述" name="b">
          <el-button type="primary" @click="addpictureText" size="small">添加</el-button>
          <picture-text :pictureText.sync="formData.pictureText"></picture-text>
        </el-tab-pane> 
         <el-tab-pane label="生产资料" name="c">
          <el-form-item label="名称">
             <el-input v-model="formData.vendorInformation.name"></el-input> 
          </el-form-item>
          <el-form-item label="地址">
             <el-input v-model="formData.vendorInformation.address"></el-input> 
          </el-form-item>
          <el-form-item label="联系方式">
             <el-input v-model="formData.vendorInformation.contactInformation"></el-input> 
          </el-form-item>
          <el-form-item label="生产日期" required>
            <el-col :span="11">
              <el-form-item prop="">
                <el-date-picker 
                  @change="formData.vendorInformation.productionDate = $event" 
                  type="date" 
                  placeholder="选择日期" 
                  v-model="formData.vendorInformation.productionDate" 
                  style="width: 100%;"
                  :picker-options="$store.state.dateRules.purchaseDate"
                  >
                </el-date-picker>  
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="收获日期" required>
            <el-col :span="11">
              <el-form-item prop="purchaseDate">
                <el-date-picker 
                  @change="formData.vendorInformation.harvestDate = $event" 
                  type="date" 
                  placeholder="选择日期" 
                  v-model="formData.vendorInformation.harvestDate" 
                  style="width: 100%;"
                  :picker-options="$store.state.dateRules.purchaseDate"
                  >
                </el-date-picker> 
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-tab-pane> 
        <el-tab-pane label="定时任务补偿" name="d">定时任务补偿</el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">{{subTitle}}</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button @click="kv">测试</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import $ from 'jquery';
// import axios from 'axios';
// import qs from 'qs'
import { mapState } from 'vuex'
import GoodsCategorySelect from '../00.common/goodsCategorySelect'
import PictureText from '../00.common/pictureText'

export default {
  data() {
    return {
      subTitle: '创建保存',
      syncgoodsCategory: null,
      goodsSelectData: null,
      activeName: 'a',
      formData: {},
      formDataBase: {},
      rules: {
        name: [
          { required: true, message: '请输入食材名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填食材描述', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '价格不能为空' },
          { pattern: /^\d/, message: '价格应该是正数' }
        ],
        dose: [
          { required: true, message: '剂量不能为空' },
          { type: 'number', message: '剂量必须为数字值' }
        ],
        inventory: [
          { required: true, message: '库存不能为空' },
          { type: 'number', message: '库存必须为数字值' }
        ],
        minNumber: [
          { required: true, message: '最小购买数量不能为空' },
          { type: 'number', message: '最小购买数量必须为数字值' }
        ],
        minAmount: [
          { required: true, message: '最小购买量不能为空' },
          { type: 'number', message: '最小购买量必须为数字值' }
        ],
        maxAmount: [
          { required: true, message: '最大购买量不能为空' },
          { type: 'number', message: '最大购买量必须为数字值' }
        ],
        imgFile: [
          { required: true, message: '上传图片不能为空', trigger: 'blur' }
        ],
        foodCategory: [
          { type: 'array', required: true, message: '请至少选择一个分类', trigger: 'change' }
        ],
        purchaseDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    GoodsCategorySelect, PictureText
  },
  watch: {
    formData() {
      console.log('1123456789')
    }
  },
  // 挂载前获取数据
  beforeMount() {
    console.log('3-beforeMount 挂载之前')
    this.formData = this.$unity.copyObj(this.$store.state.base.foodBase)
    // 获取食材分类数据
    if (!this.foodCategory) {
      this.$store.dispatch('foodCategoryData')
    }
    // 检测新增或编辑
    if (this.$route.params.id) {
      console.log(this.$route.params.id)
      this.subTitle = '修改保存'
      this.$axios({
        method: 'get',
        url: `${this.$store.state.apiUrl}/food/${this.$route.params.id}`
      }).then(response => {
        this.formDataBase = response.data
        this.resetForm()
      })
    } else {
      this.formDataBase = this.$unity.copyObj(this.$store.state.base.foodBase)
    }
  },
  // 计算属性
  computed: {
    ...mapState({
      goodsCategoryDataX: 'goodsCategoryData',
      foodCategory: 'foodCategoryData'
    })
  },
  methods: {
    // 测试fromdata转换数据
    kv() {
      // 表单验证方法
      this.$refs.formData.validate((result) => {
        if (result) {
          // 验证通过,调用module里的setUserInfo方法
          // this.$store.dispatch('setUserInfo')
          alert('表达验证合法')
        } else {
          alert('表达验证不合法')
        }
      })
    },
    // 数据提交到后台
    submitForm() {
      // 商品分类添加处理
      this.formData.goodsCategory = this.syncgoodsCategory
      let m = 'patch'
      let url = `${this.$store.state.apiUrl}/food`
      let msg = '食材修改成功'
      if (!this.formData.id) {
        m = 'post'
        msg = '食材添加成功'
      }
      // 表单验证方法
      this.$refs.formData.validate((result) => {
        if (result) {
          // 验证通过,调用module里的setUserInfo方法
          let formData = new FormData()
          console.log(this.formData)
          for (let i in this.formData) {
            console.log('kkkkkkkkkkkkk', i)
            switch (i) {
              case 'foodCategory':
              case 'goodsCategory':
                console.log('bbbbbbbbb', this.formData[i])
                for (let n in this.formData[i]) {
                  formData.append(`${i}[${n}]`, this.formData[i][n])
                }
                break
              case 'pictureText':
                console.log('bbbbbbbbb', this.formData[i])
                for (let n in this.formData[i]) {
                  for (let m in this.formData[i][n]) {
                    formData.append(`${i}[${n}].${m}`, this.formData[i][n][m])
                  }
                }
                break
              case 'vendorInformation':
                for (let n in this.formData[i]) {
                  formData.append(`${i}.${n}`, this.formData[i][n])
                }
                break
              default:
                formData.append(i, this.formData[i])
            }
          }
          this.$axios({
            method: m,
            url: url,
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: formData
          }).then(response => {
            this.$router.push('/foods')
            // this.$message.success(msg)
            this.$notify({
              title: '成功',
              message: msg,
              type: 'success'
            })
          }).catch(function(err) {
            this.$message.error(err)
          })
        } else {
          this.$message.error('表单填写有误!请检测表单!')
        }
      })
    },
    // 重置数据
    resetForm() {
      this.formData = this.$unity.copyObj(this.formDataBase)
      console.log(this.formData)
    },
    // 添加一组图文描述
    addpictureText() {
      this.formData.pictureText.push({
        imgUrl: '',
        desc: '',
        imgFile: null
      })
    },
    // 价格小数处理
    price2(data) {
      if (data) {
        console.log(data.toFixed(2))
        this.formData.unitPrice = data.toFixed(2)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log('离开')
    next()
  }
}
</script>
