import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		// 打开的issue清单， issue对象 {id: xx, code: xx}
		issues : [],
    activeName: 'second'
	},
	actions: {
		openIssue({commit}, issue) {
      commit('OPENISSUE', issue);
		},
		closeIssue({commit}, issueid) {
			commit('CLOSEISSUE', issueid);
		},
	},
	mutations: {
		OPENISSUE (state, issue) {
      let finded = state.issues.find( isu => isu.id === issue.id );
      if(finded){
      }else{
        state.issues.push(issue);
      }
      state.activeName = issue.id;
		},
		
		CLOSEISSUE (state, issueid) {
      let finded = state.issues.findIndex( isu => isu.id === issueid );
      state.issues.splice(finded, 1);
      
      let nextIndex = finded;
      if(nextIndex > state.issues.length-1){
        nextIndex --;
      }
      if(nextIndex >= 0){
        state.activeName = state.issues[nextIndex].id;
      }else{
        state.activeName = 'second';
      }
		}
	},
	getters: {
		getOpenIssues (state) {
			return state.issues;
		},
    getActiveName (state) {
      return state.activeName;
    }
	}
})

export default store;