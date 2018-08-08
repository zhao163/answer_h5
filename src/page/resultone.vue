<template>
	<div>
		<div id="resultone">
			<div class="main_bg">
				<img src="../assets/image/result/result_bg.png"/>
			</div>
			<!--答题量中奖名单  -->
			<div class="container">
				<div class="play_one">
					<img src="../assets/image/result/playone_1.png" class="play_one_title"/>
				</div>
				<div class="table_title">
					<div class="rank">综合排名</div>
					<div class="name">姓名</div>
					<div class="tel">身份证后六位</div>
					<div class="num">答题数</div>
				</div>
				<div class="table_content">
					<div class="tr" v-for="item in rankList" :key="item.ranking">
						<div class="rank">
							<img src="../assets/image/result/gold.png" v-if="item.ranking==1"/>
							<img src="../assets/image/result/second.png" v-else-if="item.ranking==2"/>
							<img src="../assets/image/result/thrid.png" v-else-if="item.ranking==3"/>
							<span v-else>{{item.ranking}}</span>
						</div>
						<div class="name">{{item.userName}}</div>
						<div class="tel">{{item.identity}}</div>
						<div class="num">{{item.answerCount}}</div>
					</div>
					<div class="detail">
						注：答题正确量相同，以随机抽取的方式决定排名。
					</div>
				</div>
			</div>
			<div class="forcast">
				本期活动暂告一段落，恭喜每一位幸运的北马绿电侠,活动仍将继续，持续关注哦；中奖人员，稍后工作人员会联系您！
			</div>
			<img src="../assets/image/result/result_bottom.png" class="bottom_img"/>
		</div>
		<toast v-model="showPositionValue" type="text" :time="1000" :text="toastText"></toast>
	</div>
</template>
<script>
import { getActivityOneAward } from "../api/index";
import { Toast } from "vux";

export default {
  name: "resultone",
  components: { Toast },
  data() {
    return {
      rankList: [],
      showPositionValue: false,
      toastText: ""
    };
  },
  mounted() {
    getActivityOneAward().then(res => {
      res.status == 200
        ? (this.rankList = this.filterIdentity(res.rankList))
        : ((this.showPositionValue = false), (this.toastText = res.message));
    });
  },
  methods: {
    filterIdentity: function(list, type) {
      list.map(item => {
        item.identity = item.identity.substr(-6);
      });
      return list;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/base/_mixin";
/*公共样式部分*/
@import "../style/scss/result/result.scss";
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>