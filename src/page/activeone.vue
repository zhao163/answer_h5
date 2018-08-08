<template>
<div class="activity1">
  <img src="../assets/image/personal/activity1.png" class="activity1_bg">
  <img src="../assets/image/img/go_Main.png" class="gomainBtn" @click='gomain'>
  <div class="homePage">
    <div class="home">
      <div class="userInfo">
        <div class="avatar">
          <img src="../assets/image/userpic.png" alt="">
        </div>
        <div class="nickName">{{userName}}</div>
        <div class="answerRank" v-show="personalRank">
          答题排名第<span>{{activity1Homepage.personalRank}}</span>名
        </div>
        <div class="answerRank" v-show="!personalRank">未进排名</div>  
        <div class="questionNum">
          <div>
            <span>今日答题</span>
            <span class="num">{{activity1Homepage.today_question}}</span>
          </div>
          <div class="border_l"></div>
          <div>
            <span>累计答题</span>
            <span class="num">{{activity1Homepage.total_question}}</span>
          </div>
        </div>
        <button @click='startAnswer'  lang="zh_CN" class="save-btn">开始答题</button>
        <div class="activityTime"> 
          距离活动结束:<span v-for="(item, index) in time" :key="index" :class="[!isNaN(item)? 'activeTime' : '',  'time']">{{item}}</span>
        </div>
        <!-- <img src="../assets/image/personal/activity1_icon.png" class='activity1_icon' v-show="moreflag" :id="phoneX?'phoneX':''"> -->
      </div>
      <div class="rank">
        <div class='rank_title'>当前排行</div>
        <div class="table">
          <div class="tr">
            <div v-for="(item,index) in rankTitle"  :key="index" :class="['th', index==2 ? 'phone' : '']">{{item}}</div>
          </div>
          <div class="tr" v-for="(item,index) in activity1Homepage.rankList" :index="index" :key="item.ranking">
            <div class="td">
              <img :src="'/static/rank_'+(item.ranking > 3 ? 4 : index+1)+'.png'" class="icon_trophy">
              <div :class="['rank_num', item.ranking>3 ? 'color_4F4F4F' : '']"><span>{{item.ranking}}</span></div>
            </div>
            <div class="td">{{item.userName}}</div>
            <div class="td phone">{{item.identity}}</div>
            <div :class="['td', item.ranking < 4 ? 'color_F19E38' : '']">{{item.answerCount}}</div>
          </div>
        </div>
        <div class='rank_title down'>
          <span v-show="personalRank">当前排名第 {{activity1Homepage.personalRank}} 名，继续加油哦～</span>
          <span v-show="!personalRank">您尚未进排名，请先答题哦~</span>
        </div>
      </div>
      <div class="activity_des">活动期间，每位用户都可参与每天2轮的答题游戏，3天内累计答对题目前10名赢得直通名额。每轮答题时间5分钟，任一题目答错，本轮游戏即行终止。(注:为求公正，答题期间不允许退出答题页面，否则消耗一次答题机会)</div>
    </div>
  </div>

  <toast v-model="showPositionValue" type="text" :time="1000" :text="toastText"></toast>

</div>
</template>
<script>
import { Toast } from 'vux'
import { format } from '../utils/Date/DateUtil'
import { getActivityOneUserInfo, getAnswer } from '../api/index'
import { userInfo } from 'os';

export default {
  name:'activeone',
  components: { Toast },
  data: function() {
    return {
      personalRank: true,
      userName: JSON.parse(localStorage.getItem('userInfo')).fdUserName,
      clearTimer: '',
      currentTime: new Date().getTime(),
      time: '',
      rankTitle: ['排名', '姓名', '身份证后六位', '答题数'],
      activity1Homepage: {},
      activityEndTime: '',
      moreflag: true,
      phoneX:'',
      showPositionValue: false,
      toastText: '',
      activityTime: JSON.parse(localStorage.getItem('activityTime')),
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    };
  },

  created() {
    this.getCurrentTime(this.getActivityTimeDifference)
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
      } else {
        clearInterval(clearTimer)
        this.constant.endTime = true
        this.$router.replace('/index')
      }
    },

    //距活动时间
    getActivityTimeDifference: function () {
      this.activityEndTime = format(this.activityTime.playoneEndTime) - this.constant.time || format(this.activityTime.playoneEndTime) - new Date().getTime()
      var clearTimer =  setInterval(() => { this.countTime(this.activityEndTime, clearTimer) }, 1000)
      this.countTime(this.activityEndTime)
    },

    //个人信息及排名
    getUserAndRankInfo: function () {
      getActivityOneUserInfo({userPhone: this.userInfo.telPhone}).then(res => {
        function processCard(data) {
          res.rankList.map(item => {
            item.identity = item.identity.substr(-6)
          })
          return data
        }
        if (res.status == 200) {
          !res.unAnswered ? (this.personalRank=true, this.activity1Homepage = processCard(res)) : 
          this.activity1Homepage = Object.assign({}, processCard(res), { today_question: 0, total_question: 0 })
        }
      })
    },

    gomain(){
      this.$router.replace('/index');
    },

    startAnswer: function () {
      getAnswer({userPhone: this.userInfo.telPhone}).then(res => {
        if (res.status == 200){
          res.degreeDay > 2 ? (this.showPositionValue = true, this.toastText = '今天的答题机会已用完，明天记得再来哦') : 
          this.$router.push({path: '/answer/:question', query: {question: res}})
        }
      })
    },
  },
  mounted(){

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
  // height: 460rpx;
  @include pxCalc(height, 460px);
  vertical-align: top
}

.homePage{
  position: relative;
  // top: -70rpx;
  @include pxCalc(top,-70px);
  // width: 704rpx;
  @include pxCalc(width,704px);
  height: 100%;
  background: #fff;
  margin: 0 auto;
  // border-radius: 12rpx;
  @include pxCalc(border-radius,12px);
}

.home{
  width: 100%;
  height: 100%;
  position: absolute;
  // top: -76rpx
  @include pxCalc(top,-76px);
}

.userInfo{
  text-align: center;
  color: #404040;
}

.avatar{
  // width: 195rpx;
  @include pxCalc(width,195px);
  // height: 195rpx;
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
  // margin-top: 48rpx;
  @include pxCalc(margin-top,48px);
}

.answerRank{
  // font-size: 66rpx;
  @include pxCalc(font-size,66px);
  // margin: 60rpx 0;
  @include pxCalc(margin,60px,0);
  // letter-spacing: 4rpx;
  @include pxCalc(letter-spacing,4px);
}

.answerRank span{
  color: #1D9796
}

.questionNum{
  display: flex;
  justify-content: space-around;
  // font-size: 26rpx;
  @include pxCalc(font-size,26px);
  align-items: flex-end;
}

.questionNum div{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.questionNum .num{
  // font-size: 36rpx;
  @include pxCalc(font-size,36px);
  @include pxCalc(margin-top,20px);
  font-weight: bold;
}

.border_l{
  // height: 58rpx;
  @include pxCalc(height, 58px);
  // border-left: 2rpx solid #DCDCDC;
  @include pxCalc(border-left-width, 2px);
  border-left-style: solid;
  border-left-color: #DCDCDC;
}

.save-btn,
.rank_title{
  // width: 704rpx;
  @include pxCalc(width,704px);
  // height: 108rpx;
  @include pxCalc(height,108px);
  // line-height: 108rpx;
  @include pxCalc(line-height,108px);
  text-align: center;
  // border-radius: 0 0 12rpx 12rpx;
  @include pxCalc(border-radius,0,0,12px,12px);
  color: #404040;
  box-sizing: border-box;
}

.save-btn{
  border: none;
  background: #1CCFD1;
  // font-size: 34rpx;
  @include pxCalc(font-size,34px);
  // margin:68rpx 0 48rpx 0; 
  @include pxCalc(margin,68px,0,48px,0);
}

.activity1_icon{
    // width: 56rpx;
    @include pxCalc(width,56px);
    // height: 20rpx;
    @include pxCalc(height,20px);
    vertical-align: top;
    // margin:-70rpx 0 34rpx 0;
    @include pxCalc(margin,-70px,0,34px,0);
    animation: shaketwo 2s infinite both;
    z-index:100;
    left:50%;
    // margin-left:-25rpx;
    @include pxCalc(margin-left,-25px);
    // top:950rpx;
    @include pxCalc(top,950px);
}
#phonoeX{
    // width: 56rpx;
    @include pxCalc(width,56px);
    // height: 20rpx;
    @include pxCalc(height, 20px);
    animation: shaketwo 2s infinite both;
    position: absolute;
    z-index:100;
    left:50%;
    // margin-left:-25rpx;
    @include pxCalc(margin-left,-25px);
    // top:1050rpx;
    @include pxCalc(top,1050px);
    }
.rank {
  width: 100%;
  border: 2rpx solid #EEEEEE;
  @include pxCalc(border-width,2px);
  border-style: solid;
  border-color: #EEEEEE;
  border-top: none;
  // border-radius: 12rpx;
  @include pxCalc(border-radius,12px);
  box-shadow: -2rpx 0 20rpx #E5E5E5;//????????????????
  
  // margin-top: 34rpx;
  @include pxCalc(margin-top,34px);
}

.rank_title{
  width: 100%;
  color: #404040;
  background: #E5E5E5;
  // font-size: 32rpx;
  @include pxCalc(font-size,32px);
  // border-radius: 12rpx 12rpx 0 0;
  @include pxCalc(border-radius,12px,12px,0,0);
}

.down{
  // border-radius: 0 0 12rpx 12rpx;
  @include pxCalc(border-radius,0,0,12px,12px)
}

.table {
  border-right: 0;
  border-bottom: 0;
}

.tr {
  width: 100%;
  // height: 108rpx;
  @include pxCalc(height,108px);
  // line-height: 108rpx;
  @include pxCalc(line-height,108px);
  // font-size: 30rpx;
  @include pxCalc(font-size,30px);
  display: flex;
  color: #3D3D3D;
  justify-content: space-between;
  // border-bottom: 1rpx solid #EEEEEE;
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
  // width: 69rpx;
  @include pxCalc(width,69px);
  // height: 69rpx;
  @include pxCalc(height,69px);
  vertical-align: middle
}

.rank_num{
  // width: 30rpx;
  @include pxCalc(width,30px);
  text-align: center;
  position: absolute;
  left: 40%;
  // top: 10rpx;
  @include pxCalc(top,10px);
  // font-size: 20rpx;
  @include pxCalc(font-size,20px);
  color: #fff
}

.color_4F4F4F{
  color: #4F4F4F;
  // font-size: 18rpx;
  @include pxCalc(font-size,18px);
}

.activity_des{
  // width: 548rpx;
  @include pxCalc(width,548px);
  // height: 146rpx;
  @include pxCalc(height,146px);
  word-wrap: break-word;
  color: #929292;
  // font-size: 25rpx;
  @include pxCalc(font-size,25px);
  // margin: 58rpx auto 200rpx
  @include pxCalc(line-height,40px);
  margin: 0 auto;
  @include pxCalc(margin-top,58px);
  @include pxCalc(margin-bottom,200px);
}
.time_box{
  display: inline-block;
  // width: 42rpx;
  @include pxCalc(width,42px);
  background: #1CCFD1;
  // margin-right: 4rpx;
  @include pxCalc(margin-right,4px);
}
.color_F19E38{
  color: #F19E38
}
.activityTime{
  // font-size: 38rpx;
  @include pxCalc(font-size,28px);
  color: #797979;
}
.gomainBtn{
  // width:126rpx;
  @include pxCalc(width,126px);
  // height:52rpx;
  @include pxCalc(height,52px);
  position: absolute;
  @include pxCalc(top,20px);
  // right:20rpx;
  @include pxCalc(right,30px);
  z-index:30;
  animation: shake 3s infinite both;
	transform: translate3d(0, 0, 0);
	backface-visibility: hidden;
  perspective: 1000px;
  // @include pxCalc(perspective,1000px);
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

