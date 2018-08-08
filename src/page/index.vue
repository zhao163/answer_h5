<template>
  <div class='flex-wrp'>
    <div class="one">
      <img src='../assets/image/img/rank.png' class="ranklogo" @click='getWinnersList' v-if="activitytwoShow">
      <img src='../assets/image/img/main_bg2.png' class="mainbg" v-if="activitytwoShow">
      <img src='../assets/image/img/main_bg.png' class="mainbg" v-if="!activitytwoShow">
      <img src='../assets/image/img/main_btn.png' class="mainbtn" @click='describeShow'>
    </div>
    <!-- 二期活动预测 -->
    <div class="forcasttwo_wrap" v-if="activityNotice" @click='hideFrocastTwo'>
      <img src="../assets/image/img/forcasttwo.png" class="forcasttwo_img">
      <div class="forcasttwo_text">“绿电侠归来”第二阶段活动将于{{activitytwoTime}}上线，最后的机会赢取北马直通名额不要错过哦~</div>
    </div>
  </div>
</template>
<script>
import { getResourceDetail } from '../api/index'
import { format } from '../utils/Date/DateUtil'
import { defaultCipherList } from 'constants';
export default {
  name: 'index',
  data () {
    return {
      activitytwoShow: false,
      activityNotice: false,
      activitytwoEndShow: false,
      activitytwoTime: '',
      activityTime: JSON.parse(localStorage.getItem('activityTime'))
    }
  },
  mounted () {
    //活动时间
    this.constant.endTime = false
    getResourceDetail({}).then(res => {
      res.code === 200 ? (this.activityTime = res.data, localStorage.setItem('activityTime', JSON.stringify(res.data))) : ''
      //活动预测
      this.getCurrentTime(this.getNoticeAndAward)
    })
  },
  
  methods: {

    getNoticeAndAward: function () {
      this.activitytwoTime = this.activityTime.playtwoStartTime
      // this.activitytwoTime = this.constant.activityTime.playtwoStartTime.split("-").slice(1, 3).map((item, index) => {
      //     return index == 1 ? item.split(" ").splice(0, 1) + '号' : item + '月'
      //   }).join('')
      if (this.constant.time >= format(this.activityTime.playoneEndTime) - 1000 * 60 * 60 * 24 && this.constant.time < format(this.activityTime.playtwoStartTime )) {
        this.activityNotice = true
      }
      //获奖名单按钮
      if (this.constant.time > format(this.activityTime.playoneEndTime)) {
        this.activitytwoShow = true
        this.constant.time >= format(this.activityTime.playtwoEndTime) ? this.activitytwoEndShow = true : ''
      }
    },

    getWinnersList(){
      !this.activitytwoEndShow ? this.$router.push('/resultone') : this.$router.push('/resulttwo')
    },

    describeShow(){
      this.$router.push('/rules')
    },

    hideFrocastTwo(){
      this.activityNotice = false;
    },

  },

  }
</script>
<style lang="scss" scoped>
@import "../style/base/_mixin.scss";
body,html {
  height: 100%;
  width: 100%;
  position: relative;
}

.flex-wrap {
  width: 100%;
  height: 100%;
}

.one {
  width: 100%;
  height: 100%;
}

.mainbg {
  height: 100%;
  width: 100%;
  position: absolute;
}

.describtion {
  @include pxCalc(width,143px);
  @include pxCalc(height,40px);
  position: absolute;
  right: 0;
  @include pxCalc(top,320px);
}

.mainbtn {
  position: absolute;
  top: 30%;
  left: 50%;
  @include pxCalc(margin-left,-190px);
  @include pxCalc(width,380px);
  @include pxCalc(height,114px);
  animation: mymove 1s infinite both;
	transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  @include pxCalc(perspective,1000px);
}
@keyframes mymove{
  0% {
    transform:scale(1,1);
  }
  50% {
    transform:scale(1.1,1.1);
  }
  100% {
    transform:scale(1,1);
  }
}

.code {
  @include pxCalc(height,200px);
  @include pxCalc(width,200px);
  position: absolute;
  @include pxCalc(right,10px);
  @include pxCalc(bottom,10px);
}

.describe {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 100;
  background: rgba(0, 0, 0, 0.1);
}

.describe .describe_img {
  position: absolute;
  z-index: 200;
  @include pxCalc(width,716px);
  @include pxCalc(height,1128px);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.close {
  position: absolute;
  @include pxCalc(height,30px);
  @include pxCalc(width,30px);
  @include pxCalc(top,90px);
  @include pxCalc(right,124px);
  z-index: 300;
}

.save-btn, .cancel-btn {
  @include pxCalc(width,690px);
  @include pxCalc(height,80px);
  @include pxCalc(line-height,80px);
  text-align: center;
  @include pxCalc(margin-top,30px);
  @include pxCalc(border-radius,6px);
  box-sizing: border-box;
}

.forcasttwo_wrap {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 50;
  background: rgba(0, 0, 0, 0.7);
}
.forcasttwo_text{
  position: absolute;
  z-index: 20;
  @include pxCalc(font-size,28px);
  @include pxCalc(width,420px);
  @include pxCalc(height,200px);
  @include pxCalc(margin-left,180px);
  @include pxCalc(margin-top,580px);
  @include pxCalc(letter-spacing,2px);
  @include pxCalc(line-height,46px);
  color:#0b7159;
}
.forcasttwo_img {
  position: absolute;
  @include pxCalc(height,771px);
  @include pxCalc(width,579px);
  @include pxCalc(margin-left,86px);
  @include pxCalc(margin-top,200px);
}

.save-btn {
  background-color: #e64340;
  color: #fff;
}

button[type="default"] {
  background-color: #fff;
  color: #000;
}

.ranklogo{
  @include pxCalc(width,108px);
  @include pxCalc(height,111px);
  position: absolute;
  @include pxCalc(right,50px);
  z-index:30;
  animation: shake 1.2s infinite both;
	transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  @include pxCalc(perspective,1000px);
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
</style>

