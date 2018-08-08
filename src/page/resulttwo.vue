<template>
	<div id="resulttwo">
		<div class="main_bg">
			<img src="../assets/image/result/result_bg.png"/>
		</div>
		<!--答题量中奖名单  -->
		<div class="container">
			<div class="play_one">
				<img src="../assets/image/result/playtwo_1.png" class="play_one_title"/>
			</div>
			<div class="table_title">
				<div class="rank">综合排名</div>
				<div class="name">姓名</div>
				<div class="tel">身份证后六位</div>
				<div class="num">绿证数</div>
			</div>
			<div class="table_content">
				<div class="tr" v-for="(item, index) in listArrRank" :key="index">
					<div class="rank">
						<img src="../assets/image/result/gold.png" v-if="item.rownum==1"/>
						<img src="../assets/image/result/second.png" v-else-if="item.rownum==2"/>
						<img src="../assets/image/result/thrid.png" v-else-if="item.rownum==3"/>
						<span v-else>{{item.rownum}}</span> 
					</div>
					<div class="name">{{item.fdUserRealName}}</div>
					<div class="tel">{{item.fdUserIdentity}}</div>
					<div class="num">{{item.fdGreenCardCount}}</div>
				</div>
				<div class="detail">
				注：绿证数相同，以随机抽取的方式决定排名。
				</div>
			</div>
		</div>

		<!--随机活动抽取中奖名单  -->
		<div class="container container_second" v-if="listArrRandom.length>0">
			<div class="play_one">
				<img src="../assets/image/result/playone_2.png" class="play_two_title"/>
			</div>
			<div class="table_title">
				<div class="rank">综合排名</div>
				<div class="name">姓名</div>
				<div class="tel">身份证后六位</div>
				<div class="num">绿证数</div>
			</div>
			<div class="table_content">
				<div class="tr" v-for="(item,index) in listArrRandom" :key="index">
					<div class="rank">{{index+1}}</div>
					<div class="name">{{item.fdUserRealName}}</div>
					<div class="tel">{{item.fdUserIdentity}}</div>
					<div class="num">{{item.fdGreenCardCount}}</div>
				</div>
				<div class="detail">
					注：每人最多仅允许获得一次奖励。
				</div>
			</div>
		</div>
		<div class="forcast">
			感谢您关注北马绿电侠活动,
			恭喜每一位幸运的北马绿电侠,
			并预祝大家在马拉松赛道上风驰电掣！
			中奖人员，稍后工作人员会联系您！
		</div>
		<div class="winn_btn" @click='pageToActivityOne'>一期中奖名单<img src="../assets/image/result/leftArrow.png" class="leftArrow"/></div>
		<img src="../assets/image/result/result_bottom.png" class="bottom_img"/>
		<toast v-model="showPositionValue" type="text" :time="1000" :text="toastText"></toast>
	</div>
</template>
<script>
	
import { Toast } from 'vux'
import { format } from '../utils/Date/DateUtil'
import { getActivityTwoAward, getRandomRank } from '../api/index'	

export default {
	name: 'resulttwo',
	components: { Toast },
  data(){
    return {
			listArrRank: this.constant.activityTwoRankList || [] ,
			listArrRandom: this.constant.randList || [],
			showPositionValue: false,
			toastText: '',
			activityTime: JSON.parse(localStorage.getItem('activityTime'))
    }
	},

  mounted(){
		if (!this.constant.activityTwoRankList && !this.constant.randList) {
			//活动二排名
			getActivityTwoAward().then(res => {
				this.constant.activityTwoRankList = this.listArrRank = res.code == 200 ? this.filterIdentity(res.data) : ''
				//随机
				this.getCurrentTime(this.determineCurrentTime)
			})
		}
		
	},
	
  methods: {
		filterIdentity: function (list, type) {
			list.map(item => {
				item.fdUserIdentity = item.fdUserIdentity.substr(-6);
			})
			return list
		}, 

		getRandomRank: function () {
			getRandomRank().then(res => {
				res.code == 200 ? this.constant.randList = this.listArrRandom = this.filterIdentity(res.data) : (this.showPositionValue = false, this.toastText = res.message)
			})
		},
	
		determineCurrentTime: function () {
			this.constant.time - format(this.activityTime.playtwoEndTime) >= 1000 * 60 * 60 ? 
			(!this.constant.randList ? this.getRandomRank() : '') : ''
		},

  	/*点击一期中奖名单的跳转*/
  	pageToActivityOne(){
  		this.$router.push("/resultone");
  	},
  }
}
</script>
<style lang="scss" scope>
	@import "../style/base/_mixin";
	/*公共样式部分*/
	@import "../style/scss/result/result.scss";
   #resulttwo{
	.winn_btn{
	  @include pxCalc(width,334px);
	  @include pxCalc(height,68px);
	  @include pxCalc(line-height,68px);
	  text-align: center;
	  @include pxCalc(font-size,28px);
	  @include pxCalc(border-radius,34px);
	  @include pxCalc(border,2px);
	  border-style:solid;
	  border-color:#fff;
	  background: #379E72;
	  color: #fff;
	  @include pxCalc(box-shadow,0,0,5px,#fff);
	  box-shadow: 0 0 5rpx #fff;
	  letter-spacing: 0.08em;
	  margin:0 auto;
	  @include pxCalc(margin-top,70px);
	  @include pxCalc(margin-bottom,70px);
	}
	.winn_btn::after{
	  border: none;
	}
	.leftArrow{
	  @include pxCalc(width,20px);
	  @include pxCalc(height,20px);
	  @include pxCalc(margin-left,10px);
	}
  }
  	.name{
		white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
	}
</style>