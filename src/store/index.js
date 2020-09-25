import Vue from 'vue'
import Vuex from 'vuex'
import * as deal from './modules/deal'
import * as lead from './modules/lead'
import * as user from './modules/user'


Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        deal,lead,user
    }
})

export default store