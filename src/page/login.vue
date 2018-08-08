<template>
	<div id="login">
		<button class="greenCardBtn" @click="greenDialog">购买绿证</button>
		<p class="prompt_text">完成个人绿证购买即可参加跑马活动</p>
		<div class="green_aisle">
			<div class="grad_wrap">
				<img src="../assets/image/personal/line.png" class="line">
				<p class="green_title">开启您的绿色北马之路</p>
			</div>
			<div class="row-wrap">
				<p class="label">身份证号</p>
				<div class="label-right">
					<input v-model="userInfo.idCardLast" @focus="bindfocus" :disabled="isDisable" type="text" placeholder="身份证号后六位" maxlength="6"/>
				</div>
			</div>
			<div class="row-wrap">
				<p class="label">手机号码</p>
				<div class="label-right">
					<!-- onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" -->
					<input v-model="userInfo.telPhone" @focus="bindfocus" :disabled="isDisable" type="tel" placeholder="11位手机号码" maxlength="11"/>
				</div>
			</div>
			<div v-show="!getUserInfoBtn" class="row-wrap">
				<p class="label"> 姓  名 </p>
				<div class="label-right">
					<input v-model="userInfo.userName" :disabled="isDisable"/>
				</div>
			</div>
			<div v-show="!getUserInfoBtn" class="row-wrap">
				<p class="label">绿证个数</p>
				<div class="label-right">
					<input v-model="userInfo.greenCard" :disabled="isDisable"/>
				</div>
			</div>
			<button v-show="getUserInfoBtn || isGreenCard" :class="[isGreenCard ? 'errorBtn' : '', 'allInfoBtn']"  @click="getAllMsg" :disabled="!getUserInfoBtn || isGreenCard">验证您的个人信息及绿证信息</button>
			<p v-show="isGreenCard" class="prompt_err">没有购买绿证或输入账号密码输入有误，请确认信息无误再次尝试登陆</p>
			<button v-show="!getUserInfoBtn" class="allInfoBtn" @click="confirm">确认无误参与活动</button>
		</div>
		<div v-show="greenDialogShow" class="green_dialog_wrap">
			<div class="green_dialog">
				<img class='close_dialog' src="../assets/image/img/close_dialog.png" @click="close"/>
				<p class="green_text">每购买一张2018北马纪念版绿证，金风科技将为指定贫困地区学校捐赠价值50元图书或其他学校需要的教学用品。</p>
				<a class="green_btn" @click="buyGreenCard('commemorate')">购买2018北马纪念版绿证</a>
				<a class="green_btn custom_btn" @click="buyGreenCard('Custom')">购买常规版绿证</a>
			</div>
		</div>

		<toast v-model="showPositionValue" type="text" :time="1000" :text="toastText"></toast>

	</div>
</template>
<script>
import { Toast } from 'vux'
import { format } from '../utils/Date/DateUtil'
import { getUserInfo } from '../api/index'
import { userInfo } from 'os';

export default {
	name: 'login',
	components: { Toast },
	data(){
		return{
			userInfo: {
				idCardLast:'',
				telPhone:'',
			},
			showPositionValue: false,
			toastText: '',
			getUserInfoBtn: true,
			isGreenCard: false,
			greenDialogShow:false,
			isDisable:false,
			activityTime: JSON.parse(localStorage.getItem('activityTime'))
		}
	},
	created () {
		var auth = JSON.parse(localStorage.getItem('userInfo'))
		auth ? this.userInfo = auth : ''
	},

	methods:{
		//获取全部信息
		getAllMsg(){
			var params = {
				userIdentity: this.userInfo.idCardLast,
        userPhone: this.userInfo.telPhone
			}
			
			if (this.userInfo.idCardLast == '' || !(/^\d{5}[0-9Xx]$/).test(this.userInfo.idCardLast)) {
				this.showPositionValue = true
        this.toastText = '请填写身份证后六位'
				return
			}
			if (this.userInfo.telPhone == '' || !(/^[1][3,4,5,7,8][0-9]{9}$/).test(this.userInfo.telPhone)) {
				this.showPositionValue = true
        this.toastText = '请正确填写手机号码'
				return
			}

			getUserInfo(params).then(res => {
				if(res.code == 200) {
					var useInfo = res.data.userInfo
					localStorage.setItem('userInfo', JSON.stringify(Object.assign({}, this.userInfo, {fdUserName: res.data.userInfo.fdUserName})))
					this.userInfo = {
						idCardLast: useInfo.fdUserIdentity.substr(-6),
						telPhone: useInfo.fdUserPhone,
						userName: useInfo.fdUserRealName,
						greenCard: res.data.list.length
					}
					this.getUserInfoBtn = false,
					this.isDisable = true
				} else {
					res.code == 500 ? (this.showPositionValue = true, this.toastText = res.desc) : (this.showPositionValue = true, this.toastText = res.desc, this.isGreenCard = true)
				}
			})
		},

		jumpActivity: function () {
			if (this.constant.time >= format(this.activityTime.playoneStartTime) && this.constant.time < format(this.activityTime.playoneEndTime)) {
				this.$router.push('/activeone')
			} else if (this.constant.time >= format(this.activityTime.playtwoStartTime) && this.constant.time < format(this.activityTime.playtwoEndTime)) {
				this.$router.push('/activetwo')
			}
		},
	

		//确认无误
		confirm(){
			this.getCurrentTime(this.jumpActivity)
		},
		
		buyGreenCard(value) {
			window.location.href =  value === 'commemorate' ? "https://bmweixin.tianrun.cn/gctrade/wshop/loginAndRegistration/goLogin.jhtml?hd=152&redirectUrl=%2Fgctrade%2Fwshop%2Fproduct%2Fcontent%2F152.jhtml" : "https://bmweixin.tianrun.cn/gctrade/wshop/product/list.jhtml"
		},

		greenDialog(){
			this.greenDialogShow = true
		},

		bindfocus: function () {
			this.isGreenCard = false
		},

		close: function () {
			this.greenDialogShow = false
		}
	},
}
</script>
<style lang="scss">
	@import "../style/base/_mixin";
	#login{
		width: 100%;
		height: 100%;
		background-color: #fff;
		@include pxCalc(margin-top,20px);
		
		.greenCardBtn{
			@include pxCalc(width,670px);
			@include pxCalc(height,88px);
			@include pxCalc(line-height,88px);
			@include pxCalc(font-size,28px);
			@include pxCalc(border-radius,40px);
			@include pxCalc(margin-top,50px);
			@include pxCalc(margin-left,40px);
			text-align: center;
			color: #fff;
		    background: #1CC07F;
			border:none;
		}
		.prompt_text{
			@include pxCalc(width,670px);
			@include pxCalc(margin,18px,40px);
			@include pxCalc(font-size,26px);
			color: #AFAFAF;
		}
		
		.green_aisle{
			.grad_wrap{
				position: relative;
				@include pxCalc(margin,148px,0,100px);
				text-align: center;
				.line{
					@include pxCalc(width,670px);
					@include pxCalc(height,2px);
				}
				.green_title{
					position: absolute;
					@include pxCalc(top,16px);
					left: 31%;
					@include pxCalc(font-size,28px);
					color: #AFAFAF;
				}
			}
			.row-wrap{
				width:100%;
				@include pxCalc(height,88px);
				@include pxCalc(line-height,88px);
				@include pxCalc(margin-left,30px);
				@include pxCalc(font-size,28px);
				border-bottom: 1px solid #eee;
				display: flex;
				.label{
					@include pxCalc(width,160px);
					color: #000;
				}
				.label-right{
					flex: 1;
					@include pxCalc(height,88px);
					@include pxCalc(line-height,88px);
					input{
						border:none;
						@include pxCalc(font-size,28px);
						@include pxCalc(padding-right,30px);
					}
				}
			}
			.allInfoBtn{
				@include pxCalc(width,670px);
				@include pxCalc(height,88px);
				@include pxCalc(line-height,88px);
				@include pxCalc(font-size,28px);
				@include pxCalc(border-radius,40px);
				@include pxCalc(margin,24px,40px,0,40px);
				text-align: center;
				color: #fff;
				border: none;
				background: #1EC4C5;
			}
			.errorBtn{
				background: #F7F7F7;
				color: #B9B9B9;
			}
			.prompt_err{
				@include pxCalc(width,670px);
				@include pxCalc(margin-top,24px);
				@include pxCalc(margin-left,40px);
				@include pxCalc(font-size,26px);
				color: #FF2E2C;
			}
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
			.green_dialog{
				@include pxCalc(width,670px);
				@include pxCalc(border-radius,10px);
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				background: #fff;
				z-index: 100;
				.close_dialog{
					float: right;
					@include pxCalc(width,80px);
					@include pxCalc(height,80px);
					@include pxCalc(padding,12px);
				}
				.green_text{
					width:100%;
					@include pxCalc(font-size,28px);
					@include pxCalc(padding,100px,40px);
					@include pxCalc(line-height,50px);
					word-wrap: break-word;
					word-break: break-all;
					text-indent: 2em;
					color: #444444;
				}
				.green_btn{
					display: block;
					border:none;
					@include pxCalc(width,522px);
					@include pxCalc(height,84px);
					@include pxCalc(line-height,84px);
					@include pxCalc(font-size,28px);
					@include pxCalc(border-radius,40px);
					@include pxCalc(margin,0,74px);
					text-align: center;
					color: #fff;
					background: #23BE81;
				}
				.custom_btn{
					@include pxCalc(margin,48px,74px);
					background: #545454;
				}
			}
		}
		.error_dialog{
			@include pxCalc(width,335px);
			@include pxCalc(height,90px);
			@include pxCalc(padding,10px,20px);
			background:rgba(0,0,0,.5);
			position:fixed;
			left:25%;
			top:40%;
			@include pxCalc(border-radius,10px);
			color: #FFFFFF;
			text-align: center;
			.error_dialog_text{
				@include pxCalc(font-size,28px);
				@include pxCalc(line-height,36px);
			}
		}
		input{
			background: #fff!important;
			}
	}
	.prompt_err{
	@include pxCalc(line-height,36px);
	}
</style>
