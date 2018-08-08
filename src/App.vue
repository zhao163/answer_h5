<template>
  <div id="app" style="height: 100%;" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
 
</script>

<style lang="less">
  @import '~vux/src/styles/1px.less';
</style>
<style lang="scss">
  @import './style/style';
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    /*top: 46px;*/
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }
  .vux-pop-out-enter {
     opacity: 0;
     transform: translate3d(-100%, 0, 0);
   }
  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
</style>
