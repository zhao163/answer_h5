<template>
<div>
  <div class="activity1" v-if='activity1Homepage'>
    <img src="../assets/image/personal/activity2.png" class="activity1_bg">
    <img src="../assets/image/img/go_Main.png" class="gomainBtn" @click='gomain'>
    <div class="homePage">
      <div class="home">
        <div class="userInfo">
          <div class="avatar">
            <img src="../assets/image/userpic.png" alt="">
          </div>
          <div class="nickName">{{userName}}</div>
          <div class="answerRank">
            绿证数量第<span>{{activity1Homepage.rankSelf.rownum}}</span>名
          </div>
          <!-- <img src="../assets/image/personal/activity2_icon.png" class='activity2_icon.png'> -->
          <button @click='buyGreenCard'  lang="zh_CN" class="save-btn">继续购买绿证</button>
          <!-- <span v-for="(item,index) in time" :key="index" :class="[!isNaN(item)? 'activeTime' : '',  'time']">{{item}}</span> -->
          <div class='activityTime'>
            距离活动结束: <span v-for="(item, index) in time" :key="index" :class="[!isNaN(item)? 'activeTime' : '',  'time']">{{item}}</span>
          </div>
          <!-- <img src="../assets/image/personal/activity1_icon.png" class='activity1_icon' v-show="moreflag" id="phoneX?'phoneX':''" > -->
        </div>
        <div class="rank">
          <div class='rank_title'>当前排行</div>
          <div class="table">
            <div class="tr">
              <div v-for="(item,index) in rankTitle" :index="index" :key="item" :class="['th',index==2 ? 'phone' : '']">{{item}}</div>
            </div>
            <div class="tr" v-for="(item,index) in activity1Homepage.list" :key="index">
              <div class="td">
                <img :src="'/static/rank_'+(item.rownum > 3 ? 4 : index+1)+'.png'" class="icon_trophy">
                <div :class="['rank_num',item.rownum > 3 ? 'color_4F4F4F' : '']"><span>{{item.rownum}}</span></div>
              </div>
              <div class="td">{{item.fdUserRealName}}</div>
              <div class="td phone">{{item.fdUserIdentity}}</div>   
              <div :class="['td', item.rownum < 4 ? 'color_F19E38' : '']">{{item.fdGreenCardCount}}</div>
            </div>
          </div>
          <div class='rank_title down'>当前排名第{{activity1Homepage.rankSelf.rownum}}名，继续加油哦～</div>
        </div>
        <div class="activity_des">活动期间，参与“苏富比模式”的用户，都有机会获得2018北京马拉松直通名额，10个北马直通名额等您赢！</div>
      </div>
    </div>
    <div class="green_dialog_wrap" v-show="greenDialog_show" catchtouchmove="preventTouchMove">
      <div class="green_dialog" @click='close'>
        <img src='../assets/image/img/close_dialog.png' class='close_dialog' @click='close'>
        <div class="green_text">每购买一张2018北马纪念版绿证，金风科技将为指定贫困地区学校捐赠价值50元图书或其他学校需要的教学用品。</div>
        <div class="textcenter">
          <button class="green_btn" lang="zh_CN" @click='buyCommemorate'>购买2018北马纪念版绿证</button>
        </div>
        <div class="textcenter">
          <button class="green_btn custom_btn" lang="zh_CN" @click='buyCustom'>购买常规版绿证</button>
        </div>
        
      </div>
    </div>
  </div>
  <toast v-model="showPositionValue" type="text" :time="1000" :text="toastText"></toast>
</div>

</template>
<script>
import { Toast } from 'vux'
import { format } from '../utils/Date/DateUtil'
import { getActivityTwoUserInfo } from '../api/index'

export default {
  name:'activetwo',
  components: { Toast },
  data:function(){
    return {
      time: '',
      clearTimer: '',
      activityEndTime: '',
      greenDialog_show: false,
      rankTitle: ['排名', '姓名', '身份证后六位', '绿证数'],
      activity1Homepage: null,
      commemorateGreenCart: false,
      conventionalGreenCart: false,
      moreflag:false,
      phoneX: '',
      showPositionValue: false,
      toastText: '',
      userName: JSON.parse(localStorage.getItem('userInfo')).fdUserName,
      activityTime: JSON.parse(localStorage.getItem('activityTime')),
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    }
  },
  created() {
    //距活动时间
    this.getCurrentTime(this.getActivityTimeDifference)
    //获取个人信息及排名
    this.getUserAndRankInfo()
  },
  methods:{
    countTime: function (activityEndTime, clearTimer) {
      clearTimer ? activityEndTime -= 1000 : ''
      this.activityEndTime = activityEndTime
      if (activityEndTime > 0) {
        let d = Math.floor(activityEndTime / 1000 / 60 / 60 / 24)
        let h = Math.floor(activityEndTime / 1000 / 60 / 60 % 24)
        let m = Math.floor(activityEndTime / 1000 / 60 % 60)
        let s = Math.floor(activityEndTime / 1000 % 60)
        let time = (d < 10 ? '0' + d : d) + '天' + (h < 10 ? '0' + h : h) + '时' + (m < 10 ? '0' + m : m) + '分' + (s < 10 ? '0' + s : s) + '秒'
        this.time = time.split('')
      }else {
        clearInterval(clearTimer)
        this.$router.push('/index')
      }
    },

    
    getActivityTimeDifference: function () {
      this.activityEndTime = format(this.activityTime.playtwoEndTime) - this.constant.time || format(this.activityTime.playtwoEndTime) - new Date().getTime()
      var clearTimer =  setInterval(() => { this.countTime(this.activityEndTime, clearTimer) }, 1000)
      this.countTime(this.activityEndTime)
    },

    getUserAndRankInfo: function () {
      let that = this
      getActivityTwoUserInfo({fdUserPhone: this.userInfo.telPhone}).then(res => {
        function processCard(data) {
          data.list.map(item => {
            item.fdUserIdentity = item.fdUserIdentity.substr(-6)
          })
          return data
        }
        res.code == 200 ? that.activity1Homepage = processCard(res.data)  : (that.showPositionValue = true, that.toastText = res.desc)
      })
    },

    gomain(){
      this.$router.push('/index');
    },
    
    buyGreenCard(){
      this.greenDialog_show=true;                
    },
    close(){
      this.greenDialog_show=false;
    },
    buyCommemorate(){
      window.location.href='https://bmweixin.tianrun.cn/gctrade/wshop/loginAndRegistration/goLogin.jhtml?hd=152&redirectUrl=%2Fgctrade%2Fwshop%2Fproduct%2Fcontent%2F152.jhtml'
    },
    buyCustom(){
      window.location.href='https://bmweixin.tianrun.cn/gctrade/wshop/product/list.jhtml';
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style/base/_mixin";
.time {
  display: inline-block;
  @include pxCalc(width,30px);
  @include pxCalc(height,30px);
  @include pxCalc(line-height,30px);
  @include pxCalc(margin,0px,2px);
}
.activeTime{
  background: #1CCFD1
}
page{
  width: 100%;
  height: 100%;
  background: #fff;
}
.activity1{
  width: 100%;
  height: 100%;
  background: #fff;
}
.activity1_bg{
  width: 100%;
//   height: 460rpx;
  @include pxCalc(height, 460px);
  vertical-align: top
}

.homePage{
  position: relative;
  //   top: -70rpx;
  @include pxCalc(top,-70px);
  //   width: 704rpx;
  @include pxCalc(width,704px);
  height: 100%;
  background: #fff;
  margin: 0 auto;
//   border-radius: 12rpx;
  @include pxCalc(border-radius,12px);
}

.home{
  width: 100%;
  height: 100%;
  position: absolute;
//   top: -76rpx
  @include pxCalc(top,-76px);
}

.userInfo{
  text-align: center;
  color: #404040;
}
.userInfo img{
  width: 100%;
}
.avatar{
//   width: 195rpx;
  @include pxCalc(width,195px);
//   height: 195rpx;
  @include pxCalc(height,195px);
  border-radius: 50%;
  overflow:hidden;
  display:block;
  margin: 0 auto;
}
.avatar img{
  display: block;
  width: 100%;
}
.nickName{
  display: block;
//   margin-top: 48rpx;
  @include pxCalc(margin-top,48px);
}

.answerRank{
//   font-size: 66rpx;
  @include pxCalc(font-size,66px);
//   margin: 52rpx 0 14rpx;
  @include pxCalc(margin,52px,0,14px);
//   letter-spacing: 4rpx;
  @include pxCalc(letter-spacing,4px);
}
.answerRank span{
  color: #1D9796
}

.questionNum{
  display: flex;
  justify-content: space-around;
//   font-size: 26rpx;
  @include pxCalc(font-size,26px);
  align-items: flex-end;
}

.questionNum div{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.questionNum .num{
//   font-size: 36rpx;
  @include pxCalc(font-size,36px);
  font-weight: bold;
}

.border_l{
//   height: 58rpx;
  @include pxCalc(height, 58px);
//   border-left: 2rpx solid #DCDCDC;
  @include pxCalc(border-left-width, 2px);
  border-left-style: solid;
  border-left-color: #DCDCDC;
}

.save-btn,
.rank_title{
//   width: 704rpx;
  @include pxCalc(width,704px);
//   height: 108rpx;
  @include pxCalc(height,108px);
//   line-height: 108rpx;
  @include pxCalc(line-height,108px);
  text-align: center;
//   border-radius: 12rpx;
  @include pxCalc(border-radius,12px);
  color: #404040;
  box-sizing: border-box;
}

.save-btn{
  border: none;
  background: #1CCFD1;
//   font-size: 34rpx;
  @include pxCalc(font-size,34px);
//   margin:68rpx 0 48rpx 0;
  @include pxCalc(margin,68px,0,48px,0); 
//   border-radius: 0 0 12rpx 12rpx
  @include pxCalc(border-radius,0,0,12px,12px);
}

.activity1_icon{
//   width: 56rpx;
  @include pxCalc(width,56px);
//   height: 20rpx;
  @include pxCalc(height,20px);
  vertical-align: top;
  animation: shaketwo 2s infinite both;
   z-index:100;
  left:50%;
//   margin-left:-25rpx;
  @include pxCalc(margin-left,-25px);
//   top:950rpx;
  @include pxCalc(top,950px);
}
#phonoeX{
//   width: 56rpx;
  @include pxCalc(width,56px);
//   height: 20rpx;
  @include pxCalc(height, 20px);
  animation: shaketwo 2s infinite both;
  position: absolute;
  z-index:100;
  left:50%;
//   margin-left:-25rpx;
  @include pxCalc(margin-left,-25px);
//   top:1000rpx;
  @include pxCalc(top,1000px);
  }
.rank {
  width: 100%;
  border: 2rpx solid #EEEEEE;
  @include pxCalc(border-width,2px);
  border-style: solid;
  border-color: #EEEEEE;
  border-top: none;
//   border-radius: 12rpx;
  @include pxCalc(border-radius,12px);
  box-shadow: -2rpx 0 20rpx #E5E5E5;
//   margin-top: 34rpx;
  @include pxCalc(margin-top,34px);
}

.rank_title{
  width: 100%;
  color: #404040;
  background: #E5E5E5;
//   font-size: 32rpx;
  @include pxCalc(font-size,32px);
//   border-radius: 12rpx 12rpx 0 0;
  @include pxCalc(border-radius,12px,12px,0,0);
}

.down{
//   border-radius: 0 0 12rpx 12rpx;
  @include pxCalc(border-radius,0,0,12px,12px)
}

.table {
  border-right: 0;
  border-bottom: 0;
}

.tr {
  width: 100%;
//   height: 108rpx;
  @include pxCalc(height,108px);
//   line-height: 108rpx;
  @include pxCalc(line-height,108px);
//   font-size: 30rpx;
  @include pxCalc(font-size,30px);
  display: flex;
  color: #3D3D3D;
  justify-content: space-between;
//   border-bottom: 1rpx solid #EEEEEE;
  @include pxCalc(border-bottom-width,1px);
  border-bottom-style: solid;
  border-bottom-color: #EEEEEE;
}

.th,.td {
  text-align: center;
  width:20%;
}

.phone{
  width: 40%;
}

.td{
  color: #3D3D3D;
  position: relative
}

.th {
  color: #A2A2A2
}

.icon_trophy{
//   width: 69rpx;
  @include pxCalc(width,69px);
//   height: 69rpx;
  @include pxCalc(height,69px);
  vertical-align: middle
}

.rank_num{
//   width: 30rpx;
  @include pxCalc(width,30px);
  text-align: center;
  position: absolute;
  left: 40%;
//   top: 10rpx;
  @include pxCalc(top,10px);
//   font-size: 20rpx;
  @include pxCalc(font-size,20px);
  color: #fff
}

.color_4F4F4F{
  color: #4F4F4F;
//   font-size: 18rpx;
  @include pxCalc(font-size,18px);
}

.activity_des{
//   width: 548rpx;
  @include pxCalc(width,548px);
//   height: 146rpx;
  @include pxCalc(height,146px);
  word-wrap: break-word;
  color: #929292;
//   font-size: 26rpx;
  @include pxCalc(font-size,26px);
  @include pxCalc(line-height,40px);
//   margin: 58rpx auto 200rpx
  margin: 0 auto;
  @include pxCalc(margin-top,58px);
  @include pxCalc(margin-bottom,200px);
}
.time_box{
  display: inline-block;
//   width: 42rpx;
  @include pxCalc(width,42px);
  background: #1CCFD1;
//   margin-right: 4rpx;
  @include pxCalc(margin-right,4px);
}
.color_F19E38{
  color: #F19E38
}
.activity2_icon{
//   width: 326rpx;
  @include pxCalc(width,4px);
//   height: 100rpx;
  @include pxCalc(height,100px);
}

.green_dialog_wrap{
  position:fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,.5);
  z-index:11;
  transition: all 1s ease;
}
.green_text{
//   width: 590rpx;
  // @include pxCalc(width,620px);
  color: #444444;
//   font-size: 30rpx;
  @include pxCalc(font-size,30px);
  @include pxCalc(line-height,50px);
//   padding: 100rpx 40rpx;
  @include pxCalc(padding,100px,40px);
  word-wrap: break-word;
  word-break: break-all;
  text-indent: 2em;
}
.green_dialog{
//   width: 670rpx;
  @include pxCalc(width,670px);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 100;
//   border-radius: 10rpx;
  @include pxCalc(border-radius,10px);
}
.close_dialog{
  float: right;
//   width: 58rpx;
  @include pxCalc(width,58px);
//   height: 58rpx;
  @include pxCalc(height,58px);
//   padding: 8rpx
  @include pxCalc(padding,8px);
}
.green_btn{
  border: none;
//   width: 522rpx; 
  @include pxCalc(width,522px);
//   height: 84rpx;
  @include pxCalc(height,84px);
  background: #23BE81;
//   line-height: 84rpx;
  @include pxCalc(line-height,84px);
  text-align: center;
//   font-size: 28rpx;
  @include pxCalc(font-size,28px);
//   border-radius: 40rpx;
  @include pxCalc(border-radius,40px);
  color: #fff;
}
.custom_btn{
  border: none;
  background: #545454;
//   margin: 48rpx auto 100rpx;
  margin: 0 auto;
  @include pxCalc(margin-top,48px);
  @include pxCalc(margin-bottom,100px);
}
.activityTime{
//   font-size: 38rpx;
  @include pxCalc(font-size,28px);
  color: #797979;
}
.gomainBtn{
//   width:126rpx;
  @include pxCalc(width,126px);
  height:52rpx;
  @include pxCalc(height,52px);
  position: absolute;
  @include pxCalc(top,20px);

//   right:20rpx;
  @include pxCalc(right,30px);
  z-index:30;
  animation: shake 3s infinite both;
	transform: translate3d(0, 0, 0);
	backface-visibility: hidden;
    perspective: 1000px;
    // @include pxCalc(perspective,1000px);
}
.textcenter{
  width:100%;
  text-align: center;
}
@keyframes shake {
	10%, 90% {
		transform: translate3d(-1px, 0, 0);
	}
	20%, 80% {
		transform: translate3d(2px, 0, 0);
	}
	30%, 50%, 70% {
		transform: translate3d(-4px, 0, 0);
	}
	40%, 60% {
		transform: translate3d(4px, 0, 0);
	}
}

@keyframes shaketwo {
	10%, 90% {
		transform: translate3d(0px, 2px, 0);
	}
	20%, 80% {
		transform: translate3d(0px, -2px, 0);
	}
	30%, 50%, 70% {
		transform: translate3d(0px, 2px, 0);
	}
	40%, 60% {
		transform: translate3d(px, -2px, 0);
	}
}
</style>

