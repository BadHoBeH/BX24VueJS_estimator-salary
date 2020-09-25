import Vue from 'vue'
export const namespaced = true;
import Bitrix24 from 'bitrix24-vue'

export const state = {


    all: {
        status: 'empty', //busy,init,loaded,error
        error: '',
        data: {},
        history: [],
    },


}
const generateMutations = {};
['ALL'].forEach(name => {
    ['LOADING','ERROR','DATA','HISTORY'].forEach(type => {
        generateMutations[`SET_${name}_${type}`] = function (state, array){
            state[name.toLowerCase()][type.toLowerCase()] = array
        };

        generateMutations[`PUSHK_${name}_${type}`] = function (state, data){
            data.array.forEach(i => {
                Vue.set(state[name.toLocaleLowerCase()][type.toLowerCase()], i[data.key], i)
            })
        }

    })
})

export const mutations = {
    ...generateMutations
}

export const getters = {

}

export const actions = {


    async getSelect({state,commit}, find){
        console.log('getUserSync data: ',find)
        if (!find) return false;
        commit('SET_ALL_LOADING', state.all.loading+1);
        try  {
            const BX24 = await Bitrix24.init()
            if (!BX24) return
            await BX24.init(() => {
                BX24.callMethod('user.get', find, function(result)
                    {
                        if(result.error()) alert("Error: " + result.error());
                        else commit('PUSHK_ALL_DATA',{array:result.data(), key:find.key})
                        if (result.more()) result.next();
                        else  commit('SET_ALL_LOADING', state.all.loading-1);
                    }
                )})
        }catch (e){
            console.log('Error'. e.message)
            commit('SET_ALL_STATUS', 'error')
            commit('SET_ALL_ERROR', e.message)
        }
    }
}
