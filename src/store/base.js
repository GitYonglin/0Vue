const data = {
  foodCategoryBase: {
    id: '',
    name: '',
    imgFile: '',
    imgUrl: ''
  },
  goodsCategoryBase: {
    id: '',
    name: String,
    ingUrl: String,
    createDate: Date,
    modifyDate: Date,
    imdex: Number,
    upId: ''
  },
  foodBase: {
    id: '',
    name: '食材',
    unitPrice: 12.99,
    inventory: 999,
    desc: '不可描述',
    dose: 500,
    shelves: true,
    minNumber: 1,
    minAmount: 100,
    maxAmount: 100000,
    purchaseDate: '2017-07-11',
    createDate: '2017-07-11',
    modifyDate: '2017-07-11',
    hedgeDate: '2017-07-11',
    vendorInformation: {
      name: '大厂',
      address: '火星',
      contactInformation: '12345674567',
      productionDate: '2017-07-11',
      harvestDate: '2017-07-11'
    },
    pictureText: [
      // {
      //   imgUrl: '',
      //   desc: '蛮好的',
      //   imgFile: ''
      // }
    ],
    foodCategory: [],
    goodsCategory: []
  },
  cookbookBase: {
    id: '',
    name: '食材',
    unitPrice: 12.99,
    inventory: 999,
    desc: '不可描述',
    shelves: true,
    createDate: '2017-07-11',
    modifyDate: '2017-07-11',
    pictureText: [
      // {
      //   imgUrl: '',
      //   desc: '不错',
      //   imgFile: ''
      // }
    ],
    pictureTextCoures: [
      // {
      //   imgUrl: '',
      //   desc: '蛮好的',
      //   imgFile: ''
      // }
    ],
    // foods: {
    //   staple: [{
    //     foodId: '',
    //     dosage: Number
    //   }],
    //   season: [{
    //     foodId: '',
    //     dosage: Number
    //   }],
    //   sauce: [{
    //     foodId: '',
    //     dosage: Number
    //   }],
    //   other: [{
    //     foodId: '',
    //     dosage: Number
    //   }]
    // },
    foods: [],
    goodsCategory: []
  },
  packBase: {
    id: '',
    name: '食材',
    unitPrice: 12.99,
    inventory: 999,
    desc: '不可描述',
    shelves: true,
    createDate: '2017-07-11',
    modifyDate: '2017-07-11',
    pictureText: [
      {
        imgUrl: '',
        desc: '不错',
        imgFile: ''
      }
    ],
    foods: [],
    cookbooks: [],
    goodsCategory: []
  }

}

export default {
  ...data
}
