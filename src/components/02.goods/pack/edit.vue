<!--'Content-Type': 'application/x-www-form-urlencoded'-->
<!--'Content-Type': 'multipart/form-data'-->
<template>
  <div>
    <el-form id="formData" :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="a">
          <el-form-item label="食材名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="食材描述" prop="desc">
            <el-input type="textarea" v-model="formData.desc"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="unitPrice">
            <el-input type="unitPrice" v-model="formData.unitPrice" :disabled="true">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存" prop="inventory">
            <el-input v-model.number="formData.inventory">
            </el-input>
          </el-form-item>
          <el-form-item label="是否上架">
            <input type="text" v-model="formData.shelves" hidden="hidden">
            <el-switch v-model="formData.shelves" on-text="YES" off-text="NO" @change="formData.shelves = $event" :width="60"> </el-switch>
          </el-form-item>
          <hr>
          <el-form-item label="商品分类选择">
            <goods-category-select :goodsCategorySelectData="formData.goodsCategory" :foo.sync="syncgoodsCategory"></goods-category-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="菜谱选择" name="c">
          <seclect-cookbook :data.sync="formData">

          </seclect-cookbook>
        </el-tab-pane>

        <el-tab-pane label="食材选择" name="b">
          <select-food :data.sync="formData">

          </select-food>
        </el-tab-pane>

        <el-tab-pane label="图文描述" name="d">
          <el-button type="primary" @click="addpictureText(formData.pictureText)" size="small">添加</el-button>
          <picture-text :pictureText.sync="formData.pictureText" ></picture-text>
        </el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="f">定时任务补偿</el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="submitForm">{{subTitle}}</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button @click="kv">测试</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import $ from 'jquery';
// import axios from 'axios';
// import qs from 'qs';
import SeclectCookbook from './selectCookbook'
import SelectFood from './selectFood'
import GoodsCategorySelect from '../../00.common/goodsCategorySelect'
import PictureText from '../../00.common/pictureText'

export default {
  data() {
    return {
      subTitle: '创建保存',
      syncgoodsCategory: null,
      activeName: 'a',
      activeNames2: [0, 1, 2, 3],
      collapseData: ['主料', '辅料', '酱料', '其他'],
      selectFoodEdit: false,
      foodsSelect: null,
      foodsSelectDataOk: {},
      formData: {},
      formDataBase: {},
      rules: {
        name: [
          { required: true, message: '请输入食材名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填食材描述', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '价格不能为空' }
        ],
        dose: [
          { required: true, message: '剂量不能为空' },
          { type: 'number', message: '剂量必须为数字值' }
        ],
        minDose: [
          { required: true, message: '最小剂量不能为空' },
          { type: 'number', message: '最小剂量必须为数字值' }
        ],
        maxDose: [
          { required: true, message: '最大剂量不能为空' },
          { type: 'number', message: '最大剂量必须为数字值' }
        ],
        imgFile: [
          { required: true, message: '上传图片不能为空', trigger: 'blur' }
        ],
        categorys: [
          { type: 'array', required: true, message: '请至少选择一个分类', trigger: 'change' }
        ],
        purchaseDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    SelectFood, GoodsCategorySelect, PictureText, SeclectCookbook
  },
  // 界面渲染前处理数据
  beforeMount () {
    this.formData = this.$unity.copyObj(this.$store.state.base.packBase)
    // 检测新增或编辑
    if (this.$route.params.id) {
      this.subTitle = '修改保存'
      this.$axios({
        method: 'get',
        url: `${this.$store.state.apiUrl}/pack?id=${this.$route.params.id}`
      }).then(response => {
        this.formDataBase = response.data[0]
        this.resetForm()
      })
    } else {
      this.formDataBase = this.$unity.copyObj(this.$store.state.base.packBase)
    }
  },
  methods: {
    // 测试fromdata转换数据
    kv() {
      console.log(this.formData)
      console.log(this.formData.foods)
    },
    // 数据提交到后台
    submitForm() {
      // 商品分类
      this.formData.goodsCategory = this.syncgoodsCategory

      let m = 'patch'
      let url = `${this.$store.state.apiUrl}/pack/${this.formData.id}`
      let msg = '菜谱修改成功'
      if (!this.formData.id) {
        m = 'post'
        url = `${this.$store.state.apiUrl}/pack`
        msg = '菜谱添加成功'
        // 获取创建日期
        this.formData.createDate = new Date().toLocaleString()
      }
      // 获取修改日期
      this.formData.modifyDate = new Date().toLocaleString()
      // 表单验证方法
      this.$refs.formData.validate((result) => {
        if (result) {
          // 验证通过,调用module里的setUserInfo方法
          this.$axios({
            method: m,
            url: url,
            headers: {
              'Content-Type': 'application/json'
            },
            data: this.formData
          }).then(response => {
            this.$router.push('/goods/pack')
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
      console.log(this.formData)
    },
    // 重置数据
    resetForm() {
      this.formData = this.$unity.copyObj(this.formDataBase)
      console.log('添加食材', this.formData, this.formDataBase)
    },
    // 添加一组图文描述
    addpictureText(pictureText) {
      pictureText.push({
        imgUrl: '',
        desc: '',
        imgFile: null
      })
    },
    // 添加一组图文描述
    addImgs() {
      this.formData.imgs.push({
        url: '',
        title: '',
        desc: '',
        file: null
      })
    }
  }
}
</script>
