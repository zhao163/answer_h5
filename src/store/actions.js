function updatePosition ({commit}, obj) {
  if(undefined == obj.pageName){
    obj.pageName = 'index';
  }
  commit({type: 'updatePosition', top: obj.top, pageName: obj.pageName})
}

function updateHeaderHeight ({commit}, height) {
  commit({type: 'updateHeaderHeight', height: height})
}

//header 显示
function updateShowHeader ({commit}, state) {
  commit({type: 'updateShowHeader', state: state})
}

//footer 显示
function updateShowFooter ({commit}, state) {
  commit({type: 'updateShowFooter', state: state})
}

//用户类型  单个电站 多电站
function updateUserInfo ({commit}, userType) {
  commit({type: 'updateUserInfo', userType: userType})
}

//区域
function updateRegion ({commit}, regionType) {
  commit({type: 'updateRegion', regionType: regionType})
}

//电厂 id
function updateStationId ({commit}, stationId) {
  commit({type: 'updateStationId', stationId: stationId})
}

//登陆状态
function updateLoginState ({commit}, loginState) {
  commit({type: 'updateLoginState', loginState: loginState})
}

//重置所有
function resetAll ({commit}) {
  commit({type: 'resetAll'})
}

export {
  updatePosition,
  updateHeaderHeight,
  updateShowHeader,
  updateShowFooter,
  updateUserInfo,
  updateRegion,
  updateStationId,
  updateLoginState,
  resetAll,
}
