import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import dataBase from './base'
import DateRules from './dateRules'
// import ajax from '../commonJs/ajax'

Vue.use(Vuex)

const state = {
  base: dataBase,
  dateRules: DateRules,
  apiUrl: 'http://localhost:5001',
  // 数据加载等待
  fullscreenLoading: false,
  // 菜单参数
  navMenu: {
    one: '',
    two: '',
    title: ''
  },
  foodCategoryData: '',
  goodsCategoryData: '',
  // 商品分类编辑
  goodsCategoryEdit: {
    editCategoryTitle: '',
    editCategory: false,
    category: {
      id: '',
      name: '',
      imgFile: '',
      imgUrl: '',
      createDate: '',
      modifyDate: '',
      index: 1,
      upId: ''
    }
  }
}

const mutations = {
  httpUrl(state, data) {
    axios.get('../AppSettings.json').then(response => {
      console.log('000000000000000000111111111111111111111', response.data.apiUrl)
      // state.apiUrl = response.data.apiUrl
    }, response => {
      // error callback
    })
  },
  // 菜单数据
  navMenu(state, data) {
    state.navMenu = data
  },
  // 食材分类数据
  foodCategoryData(state, data) {
    // 食材分类获取
    state.foodCategoryData = data
  },
  // 商品分类编辑控制
  goodsCategoryEdit(state, data) {
    // 这个方法不会触发watch监听方法, 模板可以更新
    Object.assign(state.goodsCategoryEdit, data)
  },
  // 商品分类数据
  goodsCategoryData(state, data) {
    let item = data.data
    console.log('item0000000', data)
    let c = []
    let i = 1
    // index分组
    if (item) {
      for (let index = 0; index < item.length; index = 0) {
        c.push(item.filter(item => item.index === i))
        item = item.filter(item => item.index !== i)
        i++
      }
      // upId分组
      for (let ii = c.length - 1; ii > 0; ii--) {
        c[ii - 1].forEach((item, index) => {
          let l = c[ii].filter(im => im.upId === item.id)
          if (l.length > 0) {
            item.children = l
          }
        })
      }
      state.goodsCategoryData = { loading: data.loading, data: c[0] }
      return
    }
    state.goodsCategoryData = { loading: data.loading, data: null }
  }
}

const actions = {
  /**
   * 商品分类数据处理
   * @param {*} context vuex上下文
   */
  goodsCategoryData(context) {
    context.commit('goodsCategoryData', { loading: [true, `正在加载数据...`, true], data: null })
    axios({
      method: 'get',
      url: `${context.state.apiUrl}/goodsCategory`
    }).then(response => {
      context.commit('goodsCategoryData', { loading: [false, '完成', false], data: response.data })
    }).catch(error => {
      context.commit('goodsCategoryData', { loading: [true, `服务器故障!${error}`, false], data: null })
    })
  },
  foodCategoryData(context) {
    // 食材分类获取
    context.commit('foodCategoryData', { loading: [true, `正在加载数据...`, true], data: null })
    axios({
      method: 'get',
      url: `${context.state.apiUrl}/foodCategory`
    }).then(response => {
      context.commit('foodCategoryData', { loading: [false, '完成', false], data: response.data })
    }).catch(error => {
      context.commit('foodCategoryData', { loading: [true, `服务器故障!${error}`, false], data: null })
    })
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
