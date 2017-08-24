<template>
  <div>
    <el-button size="small" type="primary" @click="addCategoryFunc(1)">添加</el-button>
    <el-button size="small" :disabled="loading[2]" @click="$store.dispatch('goodsCategoryData')" v-show="loading[0]">刷新</el-button>
    <div v-loading="loading[0]" :element-loading-text="loading[1]">
      <ul id="demo" v-for="(item, index) in treeData.data" :key="index" >
        <item class="item" :model="item" >
        </item>
      </ul>
    </div>

    <el-dialog :title="category.editCategoryTitle" :visible.sync="category.editCategory">
      <el-form>
        <p>imgUrl-{{category.category.imgUrl}}</p>
        <p>index-{{category.category.index}}</p>
        <p>upId-{{category.category.upId}}</p>
        <p>创建日期-{{category.category.createDate}}</p>
        <p>修改日期-{{category.category.modifyDate}}</p>
        <el-form-item label="分类名称" prop="name" label-width="120px">
          <el-input v-model="category.category.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl" label-width="120px">
          <div class="divImgage el-card">
            <img :src="category.category.imgUrl">
            <div class="file">
              选择图片
              <input type="file" @change="fileUP($event)">
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('goodsCategoryEdit', {editCategory: false})">取 消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Item from './category/tree'
import { mapState } from 'vuex'
export default {
  name: 'goodsCategory',
  data() {
    return {
      loading: [true, '正在加载数据...', true]
    }
  },
  components: {
    Item
  },
  computed: ({
    ...mapState({
      category: 'goodsCategoryEdit',
      treeData: 'goodsCategoryData'
    })
  }),
  watch: {
    treeData(data) {
      console.log('开始123456', data)
      this.loading = data.loading
    }
  },
  methods: {
    // 获取商品分类数据
    getCatagoryData() {
      // this.$store.dispatch('goodsCategoryData')
    },
    // 添加分类
    addCategoryFunc(index) {
      let l = {
        id: '',
        name: '',
        imgFile: '',
        imgUrl: '',
        createDate: '',
        modifyDate: '',
        index: index,
        upId: ''
      }
      this.$store.commit('goodsCategoryEdit', { editCategoryTitle: '添加主分类', editCategory: true, category: l })
    },
    // 添加修改提交数据
    submit() {
      console.log(this.category.category)
      this.loading = [true, '正在提交数据...', true]
      this.category.editCategory = false
      let url = `${this.$store.state.apiUrl}/goodsCategory`
      let m = 'patch'
      let msg = '商品分类修改成功'
      if (!this.category.category.id) {
        msg = '商品分类添加成功'
        m = 'post'
      }

      // 真后台数据处理
      let fromData = new FormData()
      for (var i in this.category.category) {
        fromData.append(i, this.category.category[i])
      }

      this.$axios({
        method: m,
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: fromData
      }).then(response => {
        this.$store.commit('goodsCategoryData', {loading: [false, '完成'], data: response.data})
        this.$message.success(msg)
        this.loading = [false, '完成', false]
      }).catch(error => {
        this.loading = [true, `服务器错误!!${error}`, false]
      })
    },
    // 上传图片缩略图显示
    fileUP(e) {
      console.log('log', e, this.category)
      // 获取图片文件
      var file = e.target.files[0]
      // 设置<img>src路径
      this.category.category.imgUrl = window.URL.createObjectURL(file)
      this.category.category.imgFile = file
    }
  },
  // 挂载前获取数据
  beforeMount: function () {
    console.log('3-beforeMount 挂载之前', this.treeData)
    if (this.treeData.data) {
      this.loading = [false, '完成', false]
    }
  }
}
</script>

<style scoped>
.item {
  cursor: pointer;
}


ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>

