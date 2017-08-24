
<template>
  <div>
    <div class="opeartion">
      <div style="float:left;">
        <el-button size="small" type="primary" :disabled="loading[0]" @click="FAddCategory()">添加分类</el-button>
        <el-button size="small" type="primary" :disabled="loading[2]" :loading="loading[2]" v-show="loading[0]" @click="$store.dispatch('foodCategoryData')">刷新</el-button>
      </div>
      <div style="float:right;">
        <el-select size="small" v-model="value8" filterable placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div v-loading="loading[0]" :element-loading-text="loading[1]">
      <el-table :data="categoryData.data" style="width: 100%" ref="multipleTable" >
        <el-table-column label="图片" inline-template width="86">
          <template>
            <img :src="row.imgUrl" alt="没有图片">
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="创建日期" prop="createDateText"></el-table-column>
        <el-table-column label="修改日期" prop="modifyDateText"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="FEditCategory(scope.row)"></el-button>
            <el-button size="small" icon="delete" @click="del(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  
    <el-dialog :title="editCategoryTitle ? '添加分类' : '修改分类'" :visible.sync="editCategory">
      <el-form :model="category" ref="category">
        <input type="text" v-model="category.id">
        <el-form-item label="分类名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="category.name"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" :label-width="formLabelWidth">
          <span>{{category.imgUrl}}</span>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl" :label-width="formLabelWidth">
          <div class="divImgage el-card">
            <img :src="category.imgUrl">
  
            <div class="file">
              选择图片
              <input type="file" @change="fileUP($event)">
            </div>
          </div>
        </el-form-item>
  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">重　置</el-button>
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import qs from 'qs'
import { mapState } from 'vuex'
export default {
  name: 'foodCategory',
  data() {
    return {
      // 0显示 1文字 2刷新按钮状态
      loading: [true, '正在加载中...', true],
      msg: '食材概览',
      options: [{
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
      }],
      value8: '',
      categorySwitch: false,
      categoryBase: {
        id: '',
        name: '',
        imgFile: '',
        imgUrl: ''
      },
      category: {
        id: '',
        name: '',
        imgFile: '',
        imgUrl: ''
      },
      editData: {},
      formLabelWidth: '120px',
      editCategory: false,
      editCategoryTitle: true
    }
  },
  computed: ({
    ...mapState({
      categoryData: 'foodCategoryData'
    })
  }),
  watch: {
    categoryData(data) {
      this.loading = data.loading
    }
  },
  // 挂载前获取数据
  beforeMount: function () {
    console.log('3-beforeMount 挂载之前', this.$store.state.base.foodCategoryBase)
    if (this.categoryData.data) {
      this.loading = [false, '完成', false]
    }
  },
  methods: {
    // 编辑分类
    FEditCategory(data) {
      if (data) {
        Object.assign(this.category, data)
        Object.assign(this.categoryBase, data)
      }
      console.log('修改分类数据', this.categoryBase)
      this.editCategoryTitle = false
      this.editCategory = true
    },
    // 添加分类
    FAddCategory() {
      this.categoryBase = this.$unity.copyObj(this.$store.state.base.foodCategoryBase)
      this.categoryBase.id = this.categoryData.data.length ? this.categoryData.data.length + 1 : 1
      this.resetForm()
      this.editCategoryTitle = true
      this.editCategory = true
    },
    // 添加修改提交数据
    submit() {
      this.loading = [true, '数据正在提交...', true]
      let fromData = new FormData()
      let url = `${this.$store.state.apiUrl}/foodCategory`
      let m = 'patch'
      let msg = `修改成功`
      // 判断是添加还是更新
      if (this.editCategoryTitle) {
        msg = `添加成功`
        m = 'post'
        for (let i in this.category) {
          fromData.append(i, this.category[i])
        }
      } else {
        for (let i in this.category) {
          fromData.append(i, (i !== 'id' && this.category[i] === this.categoryBase[i]) ? '' : this.category[i])
        }
      }
      console.log('category====', this.category)
      this.cancel()
      this.ajax(
        {
          method: m,
          url: url,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: fromData
        },
        msg
      )
    },
    // 重置数据
    resetForm() {
      this.category = this.$unity.copyObj(this.categoryBase)
    },
    // 取消
    cancel() {
      this.categoryBase = this.$unity.copyObj(this.$store.state.base.foodCategoryBase)
      this.editCategory = false
    },
    /** 删除数据
     * @param {id} 删除数据的id
    */
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
            url: `${this.$store.state.apiUrl}/foodCategory/${id}`
          },
          '删除成功!'
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /** 上传图片缩略图显示
     * @param {e} DOM返回的event
    */
    fileUP(e) {
      // 获取图片文件
      var file = e.target.files[0]
      // 设置<img>src路径
      this.category.imgUrl = window.URL.createObjectURL(file)
      this.category.imgFile = file
      console.log('999999999999999999', this.category)
    },
    /**
     * @param {header} int 请求头部数据
     * @param {msg} string 返回msg提示框内容
    */
    ajax(header, msg = null) {
      console.log('ajax', header)
      this.$axios(
        header
      ).then(response => {
        if (msg) {
          this.$message.success(msg)
        }
        this.categoryData.data = response.data
        this.loading = [false, '完成', false]
      }).catch(error => {
        this.loading = [true, `服务器错误!${error}`, false]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
