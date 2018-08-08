<template>
  <div class="des_wrap">
    <img src="../assets/image/img/rulesbg.png" alt="">
    <img src="../assets/image/img/participate.png" class="participateBtn" @click="goLogin">
    <toast v-model="showPositionValue" type="text" :time="1000" :text="toastText"></toast>
  </div>
</template>
<script>
import { Toast } from 'vux'
import { format } from '../utils/Date/DateUtil'
import { defaultCipherList } from 'constants';

export default {
  name:'rules',
  components: { Toast },
  data(){
    return{
      showPositionValue: false,
      toastText: '',
      activityTime: JSON.parse(localStorage.getItem('activityTime'))
    }
  },
  mounted(){
  },
  methods:{
    goLogin(){
      this.getCurrentTime(this.getActivityTimeShow)
    },

    getActivityTimeShow() {
      if (this.constant.time < format(this.activityTime.playoneStartTime) || (this.constant.time > format(this.activityTime.playoneEndTime) && this.constant.time < format(this.activityTime.playtwoStartTime)) || this.constant.time >= format(this.activityTime.playtwoEndTime)) {
        this.showPositionValue = true
        this.toastText = '非活动时间，无法登陆'
        return
      }
      this.$router.push('/login')
    }
    
  }
}
</script>
<style lang="scss" scoped>
@import "../style/base/_mixin.scss";
body,html{
  width:100%;
  height:100%;
}

.des_wrap {
  position: absolute;
  left: 0;
  top: 0
}

img{
  @include pxCalc(width,750px);
  @include pxCalc(height,2806px);
  vertical-align: bottom
}

.participateBtn{
  position: absolute;
  @include pxCalc(bottom,510px);
  @include pxCalc(left,200px);
  @include pxCalc(width,300px);
  @include pxCalc(height,84px);
  @include pxCalc(line-height,84px);
  animation: mymove 1s infinite both;
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
</style>
