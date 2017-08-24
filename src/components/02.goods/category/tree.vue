<template>
  <div>
    <li>
      <div class="bold" @click="toggle" @dblclick="changeType">
        <i v-if="isFolder" :class="{ 'el-icon-arrow-down':open, 'el-icon-arrow-up': !open}"></i>
        <img :src="model.imgUrl"> 
        {{ model.name }}--{{ model.index + 1 }}--{{model.upId}}
        <div class="operating">
          <i class="el-icon-plus" @click.stop="addCategoryFunc(model)"></i>
          <i class="el-icon-edit" @click.stop="editCategoryFunc(model)"></i>
          <i class="el-icon-delete" @click.stop="del(model.id)"></i>
        </div>
      </div>
      <ul v-show="open" v-if="isFolder">
        <item class="bold" v-for="(model, index) in model.children" :key="index" :model="model" >
        </item>
      </ul>
    </li>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'item',
  props: {
    model: Object
  },
  data() {
    return {
      open: true
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children &&
        this.model.children.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    // 添加一个子类
    addCategoryFunc(model) {
      let l = {
        id: '',
        name: '',
        imgFile: '',
        imgUrl: 'https://cn.vuejs.org/images/logo.png',
        createDate: '',
        modifyDate: '',
        index: model.index + 1,
        upId: model.id
      }
      // vuex操作
      this.$store.commit('goodsCategoryEdit', {editCategoryTitle: '添加子分类', editCategory: true, category: l})
    },
    // 修改分类
    editCategoryFunc(model) {
      this.$store.commit('goodsCategoryEdit', {editCategoryTitle: '修改分类', editCategory: true, category: model})
    },
    // 删除数据
    del(id) {
      console.log('商品删除触发')
      // this.$emit('del', {id: id})
      this.$store.commit('goodsCategoryDel', {del: true, id: id})
      console.log('12312312', id)
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('goodsCategoryData', {loading: [true, '正在提交数据...']})
        this.$axios({
          method: 'delete',
          url: `${this.$store.state.apiUrl}/goodsCategory/${id}`
        }).then(response => {
          this.$store.commit('goodsCategoryData', {loading: [false, '完成'], data: response.data})
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.bold {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  color: #48576a;
  cursor: pointer;
  border-bottom: 1px solid #dfe6ec;
  font-size: 18px;
  img{
    height: 50px;
    width:50px;
    float: left;
    padding-right: 7px;
  }
  i{
    float: left;
    padding: 16px 7px 0 0;
  }
  .operating{
    float: right;
  }
}
.el-icon-edit{
  &:hover{
    color: #20a0ff
  }
}
.el-icon-plus{
  &:hover{
    color: #13CE66
  }
}
.el-icon-delete{
  &:hover{
    color: #FF4949
  }
}
</style>

