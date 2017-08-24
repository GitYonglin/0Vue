<template>
  <div>
    <div class="pictureText" v-for="(item, index) in pictureText" :key="index">
      <div class="el-dialog__headerbtn operation" @click="delpictureText(index)">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </div>
      <h2>{{index}}</h2>
      <div class="item">
        <div class="divImgage el-card">
          <img :src="item.imgUrl">
          <div class="file">
            选择图片
            <input type="file" 
              @change="fileUP($event,item)"
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"  
            >
              <!-- accept="image/*"  -->
          </div>
        </div>
        <p>图片地址:{{item.imgUrl}}</p>
        <div style="padding-top:14px;">
          <p>描述</p>
          <el-input type="textarea" v-model="item.desc" :rows="9" placeholder="请输入描述"></el-input>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pictureText: Array
  },
  methods: {
    delpictureText(index) {
      this.pictureText.splice(index, 1)
    },
    // 上传图片缩略图显示
    fileUP(e, item) {
      // 获取图片文件
      let file = e.target.files[0]
      // 设置<img>src路径
      item.imgUrl = window.URL.createObjectURL(file)
      item.imgFile = file
    }
  }
}
</script>
