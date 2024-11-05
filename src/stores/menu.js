const state = {
  isCollapse: false, //控制菜单的展开和收起
  selectMenu: [], //tag
  userRole: 'doctor', // 存储用户角色
  // userRole: 'admin',
  menuActive: '1-1', //默认菜单页
  isPrinting: false //打印状态
}
const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  setUserRole(state, role) {
    state.userRole = role
  },
  addMenu(state, payload) {
    //对数据要去重
    if (state.selectMenu.findIndex((item) => item.path === payload.path) === -1) {
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state, payload) {
    //找到点击数据的索引
    const index = state.selectMenu.findIndex((val) => val.name === payload.name)
    //通过索引删除数组中的指定元素
    state.selectMenu.splice(index, 1)
  },
  updateMenuActive(state, payload) {
    state.menuActive = payload
  },
  //更新打印状态
  setIsPrinting(state, value) {
    state.isPrinting = value
  }
}
const actions = {
  updateUserRole({ commit }, role) {
    commit('setUserRole', role)
  }
}
const getters = {
  getUserRole: (state) => state.userRole
}

export default {
  state,
  mutations,
  actions,
  getters
}
