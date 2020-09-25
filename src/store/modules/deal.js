import Vue from 'vue'
export const namespaced = true;
import axios from 'axios'


export const state = {

    all: {
        loading: 0,
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

    //
    getAll: state => i => {
        return state[i].data
    }

}

export const actions = {

    /*
    *   getAll
    *       - query array: {
    *               filter {object}
    *               select [array]
    *       }
    */
    async getAll({state,commit}, query){
        console.log('getDeal data: ',query)
        if (!query) return false;
        commit('SET_ALL_LOADING', state.all.loading+1);
        try  {
            console.log('dfdf', query)
            const resp = await axios.get('https://crm.sknebo.ru/rest/4/gejvakwi1ftwa6i0/crm.deal.list.json', {params:{

                }})
            console.log(resp)
        } catch (e){
            commit('SET_ALL_STATUS', 'error')
            commit('SET_ALL_ERROR', e.message)
            console.log('Error'. e.message)
        }
    },

}
