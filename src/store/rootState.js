const shouldUseTransition = !/transition=none/.test(location.href);
const state = {
  headerHeight: 0,
  showHeader: true,
  showFooter: false,
  isSingleUser: true,
  isLoading: false,
  direction: shouldUseTransition ? 'forward' : '',
  pageScrollTop: {
    index : 0,
    indexSingle : 0,
  },
  region:'',//区域
  stationId: '',//电厂id
  isLogin: false,//登陆状态
}

export default state;


