<!--'Content-Type': 'application/x-www-form-urlencoded'-->
<!--'Content-Type': 'multipart/form-data'-->
<template>
  <div>
    <h1>{{$route.query.id}}</h1>
    <el-form id="formData" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="a">
          <el-form-item label="食材名称" prop="name">
            <el-input name="ruleForm.name" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="食材描述" prop="desc">
            <el-input name="ruleForm.desc" type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input name="ruleForm.price" type="price" v-model.number="ruleForm.price">
              <template slot="prepend">
                ¥
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="剂量" prop="dose">
            <el-input name="ruleForm.dose" type="dose" v-model.number="ruleForm.dose">
              <template slot="append">
                g
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最小剂量" prop="minDose">
            <el-input name="ruleForm.minDose" type="minDose" v-model.number="ruleForm.minDose">
              <template slot="append">
                g
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最大剂量" prop="maxDose">
            <el-input name="ruleForm.maxDose" type="maxDose" v-model.number="ruleForm.maxDose">
              <template slot="append">
                g
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否上架">
            <input type="text" name="ruleForm.shelves" v-model="ruleForm.shelves" hidden="hidden">
            <el-switch v-model="ruleForm.shelves" on-text="YES" off-text="NO" @change="ruleForm.shelves = $event" :width="60"> </el-switch>
          </el-form-item>
          <el-form-item label="进货日期" required>
            <el-col :span="11">
              <el-form-item prop="purchaseDate">
                <input type="text" name="ruleForm.purchaseDate" hidden="hidden" v-model="ruleForm.purchaseDate">
                <el-date-picker @change="ruleForm.purchaseDate = $event" type="date" placeholder="选择日期" v-model="ruleForm.purchaseDate" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <hr>
          <el-form-item label="食材分类" prop="categorys">
            <el-checkbox-group v-model="ruleForm.categorys">
              <el-checkbox :label="category[0]" name="ruleForm.categorys" :key="category[0]">主料</el-checkbox>
              <el-checkbox :label="category[1]" name="ruleForm.categorys" :key="category[1]">辅料</el-checkbox>
              <el-checkbox :label="category[2]" name="ruleForm.categorys" :key="category[2]">酱料</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上架分类" prop="categorys">
            <el-checkbox-group v-model="ruleForm.categorys">
              <el-checkbox :label="category[0]" name="ruleForm.categorys" :key="category[0]">主料</el-checkbox>
              <el-checkbox :label="category[1]" name="ruleForm.categorys" :key="category[1]">辅料</el-checkbox>
              <el-checkbox :label="category[2]" name="ruleForm.categorys" :key="category[2]">酱料</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="图文描述" name="b">
          <div v-for="(item, index) in ruleForm.imgs" :key="item.id">
            <div class="el-dialog__headerbtn" @click="ruleForm.imgs.splice(index,1)">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </div>
            <h2>{{index}}</h2>
            <el-form-item label="Url">
              <el-input :name="'imgs[' +index + '].url'" v-model="item.url"></el-input>
            </el-form-item>

            <el-form-item label="标题">
              <el-input :name="'imgs[' +index + '].title'" v-model="item.title"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input :name="'imgs[' +index + '].desc'" type="textarea" v-model="item.desc"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <img :src="item.url" style="width:80px;height:80px;" >
              <input type="file" :name="'imgs[' +index + '].file'" @change="fileUP($event,item)" size="small">
            </el-form-item>
            <hr >
          </div>
          <el-button type="primary" @click="addImgs"> + 添加</el-button>
        </el-tab-pane>
        <el-tab-pane label="生产资料" name="c">生产资料</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="d">定时任务补偿</el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="kv">测试</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import $ from 'jquery';
// import axios from 'axios';
// import qs from 'qs';

export default {
  data() {
    return {
      activeName: 'a',
      category: [1, 2, 3],
      ruleForm: {
        id: 'ID',
        name: '名称',
        price: 9.99,
        desc: '描述',
        shelves: false,
        dose: 500,
        minDose: 100,
        maxDose: 10000,
        purchaseDate: '',
        imgs: [],
        categorys: []
      },
      rules: {
        name: [
          { required: true, message: '请输入食材名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填食材描述', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空' },
          { type: 'float', message: '价格必须为数字值' }
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
  created() {
    // this.$axios({
    //   method: 'get',
    //   url: 'http://192.168.31.119/Home/tabdata'
    // }).then(response => {
    //   this.tableData5 = response.data.map(v => {
    //     v.edit = false
    //     return v
    //   })
    //   console.log(response.status)
    //   console.log(response.statusText)
    //   console.log(response.headers)
    //   console.log(response.config)
    // })
    console.log('**********************', this.$route.params)
  },
  methods: {
    // 测试fromdata转换数据
    kv() {
      let tt = this.ruleForm
      for (let i in tt) {
        console.log(i, '---', tt[i], '---', typeof tt[i])
      };
      for (let i in tt.categorys) {
        console.log(i, '---', tt.categorys[i], '---', typeof tt.categorys[i])
      };
      tt.imgs.forEach(item => {
        for (var i in item) {
          console.log(i, '---', item[i], '---', typeof item[i])
          console.log(`i, '---', ${item[i]}, '---', ${typeof item[i]}`)
        };
      })
      console.log(...tt)
    },
    // 数据提交到后台
    submitForm(formName) {
      let formData = new FormData(document.getElementById('formData'))
      // 获取form对象内容 赋值给FormData对象
      // let formData = new FormData($('#formData')[0]);

      // let ll = qs.stringify({ 'bar': 123 });
      let tt = this.ruleForm
      let fd = new FormData()

      for (var i in tt) {
        console.log(i, '---', tt[i], '---', typeof tt[i])
        if (typeof tt[i] !== 'object') {
          fd.append('food.' + i, tt[i])
        }
      };
      tt.categorys.forEach((value, index) => {
        console.log(`food.categorys[${index}]`, '----', value)
        fd.append(`food.categorys[${index}].id`, value)
      })
      tt.imgs.forEach((item, index) => {
        for (var i in item) {
          console.log(i, '---', item[i], '---', typeof item[i])
          fd.append(`food.imgs[${index}].${i}`, item[i])
        };
      })

      // fd.append('data', tt);

      console.log(fd)
      console.log(formData)

      this.$axios({
        method: 'post',
        url: '/food/edit',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: fd
      }).then(response => {
        console.log(response.data)
        console.log(response.status)
        console.log(response.statusText)
        console.log(response.headers)
        console.log(response.config)
      })
      // axios({
      //    method: 'post',
      //    url: '/sfood/edit',
      //    headers: {
      //        'Content-Type': 'application/x-www-form-urlencoded'
      //    },
      //    data: { 'bar': 123 }
      // }).then(response => {
      //    console.log(response.data);
      //    console.log(response.status);
      //    console.log(response.statusText);
      //    console.log(response.headers);
      //    console.log(response.config);
      // });
      // $.ajax({
      //    type: "POST",
      //    url: '/sfood/edit',
      //    data: formData,
      //    cache: false,
      //    contentType: false,
      //    processData: false,
      //    success: function (message) {
      //        console.log(message);
      //        //then.$router.push({ name: 'food', params: { index: then.$route.params.index } });
      //    },
      //    error: function () {
      //        alert("There was error uploading files!");
      //    }
      // });
    },
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加一组图文描述
    addImgs() {
      this.ruleForm.imgs.push({
        url: '',
        title: '',
        desc: '',
        file: null
      })
    },
    // 上传图片缩略图显示
    fileUP(e, item) {
      // 获取图片文件
      let file = e.target.files[0]
      // 设置<img>src路径
      item.url = window.URL.createObjectURL(file)
      item.file = file
    }
  }
}
</script>