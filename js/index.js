/* ES6新语法，使用属性修饰符，看不懂的用后面注释里的写法 */
/* 单件商品的数据 */
class UIGoods {
  constructor(g) {
    Object.defineProperty(this, 'data', {
      get: function () {
        return g
      },
      set: function (value) {
        throw new Error('data 是只读属性，不能修改')
      },
      configurable: false, // 不能重新更改配置
    })
    let internalChooseValue = 0
    Object.defineProperty(this, 'choose', {
      get: function () {
        return internalChooseValue
      },
      set: function (value) {
        if (typeof value !== 'number') {
          throw new Error('choose属性必须是数字')
        }
        var temp = parseInt(value)
        if (temp !== value) {
          throw new Error('choose属性必须是整数')
        }
        if (value < 0) {
          throw new Error('choose属性必须大于等于 0')
        }
        internalChooseValue = value
      },
      configurable: false, // 不可以重新更改配置
    })
  }
  // ES6 语法糖，getter 直接拿出来写，不用写 Object.defineProperty() 了
  get TotalPrice() {
    return this.choose * this.data.price
  }
  // 是否选中了此件商品
  get isChoose() {
    return this.choose > 0
  }
  // 选择的商品数量加 1
  increase() {
    this.choose++
  }
  // 选择的商品数量减 1
  decrease() {
    if (this.choose === 0) return
    this.choose--
  }
}
/* ES6新语法，看不懂的用后面注释里的写法 */
/* 单件商品的数据 */
/*
class UIGoods {
  构造函数
  constructor(g) {
    this.data = g
    this.choose = 0
  }
  获取商品总价
  getTotalPrice() {
    return this.data.price * this.choose
  }
  是否选中了此件商品
  isChoose() {
    return this.choose > 0
  }
  选择的商品数量加 1
  increase() {
    this.choose++
  }
  选择的商品数量减 1
  decrease() {
    if(this.choose === 0) return
    this.choose--
  }
}
*/
/* 与上面写法效果一样，上面的是ES6的新语法
构造函数，使用对象来调用方法
function UIGoods(g) {
  this.data = g
  this.choose = 0
}
获取商品总价
UIGoods.prototype.getTotalPrice = function () {
  return this.data.price * this.choose
}
是否选中了此件商品
UIGoods.prototype.isChoose = function () {
  return this.choose > 0
}
选择的商品数量加 1
UIGoods.prototype.increase = function () {
  return this.choose++
}
选择的商品数量减 1
UIGoods.prototype.decrease = function () {
  if(this.choose === 0) return
  return this.choose--
}
*/
/* 整个界面的数据 */
class UIData {
  constructor() {
    let UiGoods = []
    goods.map(g => {
      UiGoods.push(new UIGoods(g))
    })
    this.UiGoods = UiGoods
    // 起送门槛
    this.deliveryThreshold = 30
    // 配送费
    this.deliveryPrice = 5
  }
  // 获取总价
  getTotalPrice() {
    let sum = 0
    this.UiGoods.map(g => {
      sum += g.TotalPrice
    })
    return sum
  }
  // 是否选中了某件商品
  isChoose(index) {
    return this.UiGoods[index].isChoose
  }
  // 增加某件商品的选中数量
  increase(index) {
    this.UiGoods[index].increase()
  }
  // 减少某件商品的选中数量
  decrease(index) {
    this.UiGoods[index].decrease()
  }
  // 得到总共的选择数量
  getTotalChooseNumber() {
    let sum = 0
    this.UiGoods.map(g => {
      sum += g.choose
    })
    return sum
  }
  // 购物车中是否有商品
  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0
  }
  // 价格是否跨过了配送门槛
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold
  }
}
/* 整个界面 */
class UI {
  constructor() {
    this.uiData = new UIData()
    this.doms = {
      goodsContainer: document.querySelector('.goods-list'),
      deliveryPrice: document.querySelector('.footer-car-tip'),
      footerPay: document.querySelector('.footer-pay'),
      footerPayInnerSpan: document.querySelector('.footer-pay span'),
      totalPrice: document.querySelector('.footer-car-total'),
      car: document.querySelector('.footer-car'),
      badge: document.querySelector('.footer-car-badge'),
    }
    // 购物车图标位置  也是后面添加图标跳跃动画的目标点
    let carRect = this.doms.car.getBoundingClientRect()
    let jumpTarget = {
      x: carRect.left + carRect.width / 2, // 距左边的距离加上宽度的一半
      y: carRect.top + carRect.height / 5  // 距顶部的距离加上一小段距离，随意写，这里用了高度的 1 / 5
    }
    this.jumpTarget = jumpTarget
    this.createHTML()
    this.updateFooter()
    this.listenEvent()
  }
  // 监听各种事件
  listenEvent() {
    this.doms.car.addEventListener('animationend', function () {
      this.classList.remove('animate')
      // this.doms.car.classList.remove('animate') 这要用箭头函数就这么写
    })
  }
  // 创建商品列表的HTML
  createHTML() {
    let HTML = ''
    this.uiData.UiGoods.map((g, i) => {
      HTML += `<div class="goods-item">
          <img src="${g.data.pic}" alt="" class="goods-pic" />
          <div class="goods-info">
            <h2 class="goods-title">${g.data.title}</h2>
            <p class="goods-desc">${g.data.desc}</p>
            <p class="goods-sell">
              <span>月售 ${g.data.sellNumber}</span>
              <span>好评率${g.data.favorRate}%</span>
            </p>
            <div class="goods-confirm">
              <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${g.data.price}</span>
              </p>
              <div class="goods-btns">
                <i data-index="${i}" class="iconfont i-jianhao"></i>
                <span>${g.choose}</span>
                <i data-index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
              </div>
            </div>
          </div>
        </div>`
    })
    this.doms.goodsContainer.innerHTML = HTML
  }
  // 增加某件商品的选中数量
  increase(index) {
    this.uiData.increase(index)
    this.updateGoodsItem(index)
    this.updateFooter()
    this.jump(index)
  }
  // 减少某件商品的选中数量
  decrease(index) {
    this.uiData.decrease(index)
    this.updateGoodsItem(index)
    this.updateFooter()
  }
  // 更新某件商品的显示状态
  updateGoodsItem(index) {
    let goodsDom = this.doms.goodsContainer.children[index]
    if (this.uiData.isChoose(index)) {
      goodsDom.classList.add('active')
    } else {
      goodsDom.classList.remove('active')
    }
    let span = goodsDom.querySelector('.goods-btns span')
    span.textContent = this.uiData.UiGoods[index].choose
  }
  // 更新页脚
  updateFooter() {
    // 得到总价数据
    let total = this.uiData.getTotalPrice()
    // 显示配送费
    this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`
    // 显示是否够起送以及还差多少元起送
    if (this.uiData.isCrossDeliveryThreshold()) {
      // 到达起送门槛
      this.doms.footerPay.classList.add('active')
    } else {
      this.doms.footerPay.classList.remove('active')
      // 更新还差多少元起送
      let dis = this.uiData.deliveryThreshold - total
      dis = Math.round(dis) // 四舍五入
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`
    }
    // 显示总价
    this.doms.totalPrice.textContent = total.toFixed(2) // 保留两位小数
    // 设置购物车图标的样式状态
    if (this.uiData.hasGoodsInCar()) {
      this.doms.car.classList.add('active')
    } else {
      this.doms.car.classList.remove('active')
    }
    // 设置购物车图标上的数字
    this.doms.badge.textContent = this.uiData.getTotalChooseNumber()
  }
  // 购物车动画
  carAnimate() {
    this.doms.car.classList.add('animate')
  }
  // 添加商品按钮实现抛物线跳跃动画
  jump(index) {
    // 找到对应商品的加号图标
    let btnAdd = this.doms.goodsContainer.children[index].querySelector('.i-jiajianzujianjiahao')
    // 得到按钮的位置信息
    let rect = btnAdd.getBoundingClientRect()
    // 跳跃动画的起始坐标
    let start = {
      x: rect.left,
      y: rect.top
    }
    // 实现跳跃动画
    let div = document.createElement('div')
    div.className = 'add-to-car'
    let i = document.createElement('i')
    i.className = 'iconfont i-jiajianzujianjiahao'
    // 设置初始位置
    div.style.transform = `translateX(${start.x}px)`
    // 实现抛物线，外面的div横向匀速运动，里面的 i 数值加速运动
    i.style.transform = `translateY(${start.y}px)`
    div.appendChild(i)
    document.body.appendChild(div)
    // 强制渲染  读取位置使浏览器强制 reflow ，不然不会有过渡，只会直接渲染到目标位置
    div.clientWidth
    // 设置结束位置
    div.style.transform = `translateX(${this.jumpTarget.x}px)`
    // 实现抛物线，外面的div横向匀速运动，里面的 i 数值加速运动
    i.style.transform = `translateY(${this.jumpTarget.y}px)`
    // transition 结束的事件监听
    div.addEventListener('transitionend', () => {
      div.remove()
      this.carAnimate()
    }, {
      once: true // 事件仅触发一次，不然 i 还会冒泡到 div 再触发一次事件
    })
  }
}

let ui = new UI()

/* 事件绑定 */
ui.doms.goodsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('i-jiajianzujianjiahao')) {
    let index = e.target.dataset.index // H5的 data-index 属性
    ui.increase(index)
  } else if (e.target.classList.contains('i-jianhao')) {
    let index = e.target.dataset.index // H5的 data-index 属性
    ui.decrease(index)
  }
})