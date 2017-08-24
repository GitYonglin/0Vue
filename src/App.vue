<template>
  <div id="app" v-loading.fullscreen.lock="this.$store.state.fullscreenLoading">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: #f2f2f2;
}

li {
  list-style-type: none;
}

#app {
  font-family: Helvetica, STHeiti, 'Microsoft YaHei', Verdana, Arial, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}

// 过度动画
.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
// 表格中元素样式
td {
  .el-input-number {
    width: auto;
  }
  img {
    width: 50px;
    height: 50px;
    padding-top: 7px;
  }
  .el-button+.el-button {
    margin: 0;
  }
  .mark-i{
    position: relative;
    top: 3px;
  }
  .price{
    color:#ff4949;
  }
  .g{
    color: #F7BA2A
  }
}
// 上传图片按钮
.pictureText {
  .operation {
    padding-top: 7px;
  }
  .item {
    padding-left: 215px;
  }
  p,h2{
    color: #8391a5;
    margin: 0;    
  }
}
.divImgage {
  width: 200px;
  height: 250px;
  margin: 5px;
  position: absolute;
  left: 0;
  img {
    width: 200px;
    height: 200px;
    display: block;
  }
}
.file {
  position: relative;
  display: inline-block;
  background: #dfe6ec;
  top: 1px;
  /*border: 1px solid #99D3F5;*/
  border-radius: 4px;
  /*padding: 4px 12px;*/
  overflow: hidden;
  color: #20a0ff;
  text-decoration: none;
  text-align: center;
  line-height: 50px;
  height: 50px;
  width: 200px;
  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }

  &:hover {
    background: #20a0ff;
    color: #fff;
    text-decoration: none;
  }
}
// 头部搜索样式
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
.el-loading-spinner{
  margin-top: 0;
}
.page{
  position: fixed;
  background-color: rgb(255, 255, 255);
  bottom: 0px;
  padding-bottom: 10px;
  z-index: 1;
}
</style>
