<template>
  <div>
    <div class="nav-left">
      <nav class="left">
        <div class="logo">
          <img src="../assets/logo.png" @click="routePush('/')">
        </div>
        <ul>
          <li :class=" $route.matched[0].path==item.url ? 'active' : '' " v-for="item in $store.state.navMenu.one" :key="item.url" @click="routePush(item.path)">
            <i class="el-icon-edit"></i>
            {{item.name}}
          </li>
        </ul>
      </nav>
      <nav class="left2" v-if="$store.state.navMenu.two">
        <div class="title">
          <span>{{$store.state.navMenu.title}}</span>
        </div>
        <ul>
          <li :class=" $route.matched[1].path== item.url ? 'active' : '' " v-for="item in $store.state.navMenu.two" :key="item.path" v-if="!item.heddin" @click="routePush(item.url)">
            {{item.name}}
          </li>
        </ul>
      </nav>
    </div>
    <div class="nav-top" :style="{ marginLeft: $store.state.navMenu.two ? '200px' : '90px'}">
      <nav v-if="$store.state.navMenu.two">
        <ul>
          <!--<li class="active" v-for="item in 5" :key="item">
                    概览
                  </li>-->
          <li>{{$store.state.navMenu.threeTitle}}</li>
        </ul>
      </nav>
      <div class="content" :style="{ margin: $store.state.navMenu.two ? '10px' : '0'}">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  naem: 'navMenu',
  data() {
    return {
    }
  },
  methods: {
    routePush(url) {
      this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  padding: 15px;
  min-width: 750px;
  min-height: 500px;
}

nav {
  margin: 0;
  padding: 0;
  border: 0;
  color: #CACACA;
  ul {
    margin: 0;
    padding: 0;
    border: 0;
  }
  li {
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    margin-bottom: 14px;
  }
}

.nav-left {
  li.active {
    color: #333;
    background: #F8F8F8;
  }
  .logo {
    display: block;
    width: 90px;
    height: 63px;
    overflow: hidden;
    text-align: center;
  }
  img {
    width: 32px;
    height: 32px;
    margin: 15px auto 0;
  }
  nav {
    position: fixed;
    top: 0px;
    bottom: 0;
    z-index: 9;
  }
  .left {
    left: 0;
    width: 90px;
    background: #444;
    text-align: start;
    li {
      padding-left: 15px;
      &:hover {
        color: #fff;
        background: #666;
      }
    }
  }
  .left2 {
    left: 90px;
    width: 110px;
    background: #fff;
    color: #666;
    text-align: center;
    border-right: 1px solid #CACACA;
    .title {
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #f2f2f2;
    }
    ul {
      padding: 13px 10px;
    }
    li {
      padding: 0 5px;
      &:hover {
        color: #38f;
      }
    }
  }
}

.nav-top {
  // margin-left: 200px;
  nav {
    position: relative;
    height: 50px;
    min-width: 750px;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
    border-left: 1px solid #e5e5e5;
    padding-left: 5px;
    color: #333
  }
  li {
    float: left;
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
  }
  li.active {
    border-bottom: 2px solid #38F
  }
}
</style>
