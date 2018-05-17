<template>
	<div class="main-app">
    <issue-header class="top-bar"/>
		<transition name="fade" class="router">
			<router-view class="main-content"></router-view>
		</transition>
	</div>
</template>
<script>
  import issueHeader from './components/header.vue';
  
  export default{
    data(){
      return{
      }
    },
    computed: {
    },
    methods: {
    },
    components: {
      issueHeader
    }
  }
</script>
<style lang="sass">
	.fade-enter-active, .fade-leave-active {
		transition: all .3s ease;
		transform: translateX(0px);
	}
	.fade-enter, .fade-leave-active {
		transform: translateX(-100%);
		opacity: 0;
	}
	.router {
		width: 100%;
		/*transform: translateX(-300px);*/
		/*position: absolute;*/
		/*transition: all .9s cubiz-bezier(.55, 0, .1, 1);*/
	}
	.r {
		width: 100%;
		position: absolute;
	}
	.main-app {
	  display: flex;
	  flex-direction: column;
	  flex: 1;
	}
	.main-content {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	}
</style>