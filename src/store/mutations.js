const shouldUseTransition = !/transition=none/.test(location.href);
//位置
function updatePosition (state, payload) {
  state.pageScrollTop[payload.pageName] = payload.top
}

//loading
function updateLoadingStatus (state, payload) {
  state.isLoading = payload.isLoading
}

//路由方向
function updateDirection (state, payload) {
  if (!shouldUseTransition) {
    return
  }
  state.direction = payload.direction
}

//header 高度
function updateHeaderHeight (state, payload) {
  state.headerHeight = payload.height
}

//header 显示
function updateShowHeader (state, payload) {
  state.showHeader = payload.state
}

//footer 显示
function updateShowFooter (state, payload) {
  state.showFooter = payload.state
}

//用户类型  单个电站 多电站
function updateUserInfo (state, payload) {
  state.isSingleUser = payload.userType
}

//区域
function updateRegion (state, payload) {
  state.region = payload.regionType
}

//电厂 id
function updateStationId (state, payload) {
  state.stationId = payload.stationId
}

//登陆状态
function updateLoginState (state, payload) {
  state.isLogin = payload.loginState
}

//重置所有
function resetAll (state) {
  state.headerHeight = 0;
  state.showHeader = true;
  state.showFooter = false;
  state.isSingleUser = true;
  state.isLoading = false;
  state.direction = shouldUseTransition ? 'forward' : '';
  state.pageScrollTop.index = 0;
  state.pageScrollTop.indexSingle = 0;
  state.region = '';
  state.stationId = '';
  state.isLogin = false;
}

export {
  updatePosition,
  updateLoadingStatus,
  updateDirection,
  updateHeaderHeight,
  updateShowHeader,
  updateShowFooter,
  updateUserInfo,
  updateRegion,
  updateStationId,
  updateLoginState,
  resetAll,
}
