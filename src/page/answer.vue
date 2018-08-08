<template>
  <div class="question">
    
    <div class="question_wrap">
        <div class="question_content">
            <div class="time">
              <img src="../assets/image/question/time.png" alt="">
              <span class="tim">{{countDown}}</span>
            </div>
            <div class="content"> 
              <div class="title">{{activeQ+1}}. {{question.name}}</div>
              <div v-for="(item,index) in question.options" :key="item.unique" class="option" @click="checkChange(index+1)">
              <div :class="['checkbas',checkNum==index+1 ? 'check' : 'noCheck']">{{index==0 ? 'A' : index==1 ? 'B' : 'C'}}</div>
              <span :class="[checkNum==index+1 ? 'answer' : 'basAnswer']">{{item}}</span>
            </div>
          </div>
        </div>
        <button @click="nextQuestion" lang="zh_CN" class="save-btn">下一题</button>
    </div>
    <toast v-model="showPositionValue" type="text" :time="1000" :text="toastText"></toast>
    <!-- <div v-transfer-dom>
      <confirm v-model="show"
      title='Confirm deleting the item'
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="!onShow">
      <p style="text-align:center;">'Are you sure?'</p>
    </confirm>
  </div> -->

  </div>
</template>

<script>
import { Toast } from "vux";
import { getNextQuestion } from "../api/index";
import { defaultCoreCipherList, defaultCipherList } from "constants";

export default {
  name: "answer",
  components: { Toast },
  beforeRouteLeave(to, from, next) {
    let _this = this;
    if (this.isBack && !this.constant.endTime) {
      this.$vux.confirm.show({
        title: "提示",
        content: "退出答题页面，视为消耗一次答题机会，是否确认退出？",
        // 组件除show外的属性
        onCancel() {
          _this.$vux.confirm.hide();
        },
        onConfirm() {
          _this.sendQuestionStatus("quit");
          if (to.fullPath === "/activeone") {
            next();
            setTimeout(() => {
              _this.$router.push("/index");
            }, 10);
            setTimeout(() => {
              _this.$router.replace("/activeone");
            }, 30);
          }
        }
      });
    } else if (this.constant.endTime) {
      this.toast('本期活动已结束')
       _this.sendQuestionStatus("quit");
      if (to.fullPath === "/index") {
        next();
        setTimeout(() => {
          _this.$router.replace("/index");
        }, 10);
      }
    } else {
      next();
    }
  },
  data() {
    return {
      countDown: "",
      time: 5 * 60,
      checkNum: 0,
      question: {},
      activeQ: 0,
      showPositionValue: false,
      toastText: "",
      isBack: true
    };
  },
  mounted() {
    let that = this;
    this.question = this.$route.query.question;
    this.countminutes(this.time);
    this.clearTimer = setInterval(() => {
      that.countminutes(this.time);
    }, 1000);
  },
  methods: {
    toast: function(text) {
      (this.showPositionValue = true), (this.toastText = text);
    },
    countminutes: function(time) {
      if (time >= 0) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        --this.time;
        // (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
        this.countDown = minutes + "分" + seconds + "秒";
      } else {
        clearInterval(this.clearTimer);
        this.sendQuestionStatus();
      }
    },

    sendQuestionStatus: function(quit) {
      var params = {
        qid: this.question.id,
        userPhone: JSON.parse(localStorage.getItem("userInfo")).telPhone,
        isRight: quit ? this.question.correct = 0 : (this.checkNum == this.question.correct ? 1 : 0),
        degreeDay: this.question.degreeDay
      };
      getNextQuestion(params).then(res => {
        let that = this;
        //quit 是否放弃答题
        if (quit) {
          return;
        }
        if (this.checkNum != this.question.correct) {
          this.isBack = false;
          this.checkNum == 0
            ? this.toast("答题时间已到")
            : (this.toast("答案错误,本轮答题结束"),
              clearInterval(this.clearTimer));
          setTimeout(() => {
            that.$router.replace("/activeone");
          }, 1000);
        } else {
          //处理check，下题数据{}
          (this.checkNum = 0),
            (this.question = res),
            (this.activeQ = ++this.activeQ);
        }
      });
    },

    checkChange(index) {
      this.checkNum = index;
    },

    nextQuestion: function() {
      !this.checkNum
        ? ((this.showPositionValue = true), (this.toastText = "您还未选择答案"))
        : this.sendQuestionStatus();
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../style/base/_mixin";
.question {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: url(../assets/image/question/question_bg.png) no-repeat;
  background-size: cover;
}
.question_bg {
  height: 100%;
  width: 100%;
}
.question_wrap {
  position: absolute;
  @include pxCalc(top, 68px);
  @include pxCalc(left, 26px);
  @include pxCalc(right, 26px);
}
.question_content {
  background: #56ca98;
  @include pxCalc(border-radius, 30px, 30px, 0, 0);
  @include pxCalc(margin-bottom, 56px);
}
.time {
  @include pxCalc(line-height, 160px);
  @include pxCalc(height, 160px);
  @include pxCalc(font-size, 45px);
  @include pxCalc(padding, 24px, 0, 23px, 24px);
  color: #333333;
}
.tim {
  position: absolute;
  left: 17%;
  top: 1%;
}
.time image {
  @include pxCalc(width, 60px);
  @include pxCalc(height, 68px);
  @include pxCalc(padding-right, 20px);
  vertical-align: middle;
}
.content {
  @include pxCalc(padding, 80px, 40px);
  background: #fff;
}
.title {
  @include pxCalc(font-size, 34px);
  @include pxCalc(margin-bottom, 30px);
  @include pxCalc(line-height, 50px);
  font-weight: 400;
}
.option {
  @include pxCalc(font-size, 32px);
  @include pxCalc(padding, 20px, 0);
}
.checkbas {
  @include pxCalc(width, 60px);
  @include pxCalc(height, 60px);
  @include pxCalc(border-radius, 25px);
  @include pxCalc(line-height, 60px);
  @include pxCalc(margin, 20px, 20px, 10px, 14px);
  text-align: center;
  border-radius: 50%;
  display: inline-block;
}
.check {
  background: #34d1a7;
  color: #fff;
}
.noCheck {
  border: 1px solid #666666;
}

.answer {
  color: #34d1a7;
}
.basAnswer {
  color: #666666;
}

.save-btn {
  @include pxCalc(font-size, 30px);
  @include pxCalc(width, 532px);
  @include pxCalc(height, 88px);
  @include pxCalc(margin-left, 70px);
  background: #ffc844;
  @include pxCalc(border-radius, 10px);
  color: #fff;
}
</style>
