const state={
    showUser:false
};
const getters={
    isShow(state){
       return state.showUser;
    }
}
const mutations={
    hide(state){
        state.showUser=false;
    },
    show(state){
        state.showUser=true;
    }
}
const actions={
    showDailog({commit}){
        commit('show');
    },
    hideDailog({commit}){
        commit('hide');
    }
}
export default{
    namespaced:true,
    getters,
    mutations,
    actions,
    state
}