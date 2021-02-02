<template>
  <a-spin :spinning="loadDeal > 0">
    <div style="margin: .5rem">
      <a-month-picker v-model="month" @change="getDeal" placeholder="Выбрать месяц" style="margin: 0 .25rem 0 .25rem"/>
      <a-button type="primary" :disabled="!month" @click="getDeal(month)" style="margin: 0 .25rem 0 .25rem">найти</a-button>
      <a-button :disabled="true" type="dashed" style="float: right" @click="$router.push({name:'slozno'})">не понимаю</a-button>
      <a-switch v-model="columns" @click="setColumns"/>
    </div>

    <a-result v-if="!size(listDeal) || !month" status="404" title="Не выбран месяц" sub-title="Пожалуйста, выберете месяц отчётности">
      <template #extra>
        <a-month-picker v-model="month" @change="getDeal" placeholder="Выбрать месяц" style="margin: 0 .25rem 0 .25rem"/>
        <a-button  type="primary" :disabled="!month" @click="getDeal(month)">найти</a-button>
      </template>
    </a-result>

    <a-card
        v-if="month && size(listDeal) && ['4','8','*'].includes(user)"
        style="margin: 0 .5rem 1rem .5rem; border-left: 6px solid #1890ff!important;"
        hoverable
        @click="$router.push({name:'conversionUser', params: {data:mathSall[1], rate:getRate(conversion(mathSall[1].target), conversionCash(mathSall[1].target))}})"
    >

      <a-row>
        <a-col :span="8">
          <h4>Конверсия по отделу</h4>
          <a-progress style="margin: 1rem" :strokeColor=" conversion(mathSall[1].target) > 40 ? 'green' : conversion(mathSall[1].target) >= 30 ? 'yellow' : 'red'" type="circle" :percent="conversion(mathSall[1].target)" />
        </a-col>
        <a-col :span="8">
          <a-statistic :title="'Замерено / холостых'" :value="mathSall[1].target.length" :suffix="'/ ' + mathSall[1].blank.length"/>
          <a-statistic :title="'Передано / подписано дизайнов'" :value="getSuccess(mathSall[1].target).length" :suffix="'/ '+getDesing(mathSall[1].target).length" />
          <a-tooltip title="Догоняющие замеры">
            <a-statistic v-if="mathSall[1].untarget.length" title="Подписано после 7-го" :value="mathSall[1].untarget.length"/>
          </a-tooltip>

        </a-col>

        <a-col :span="8">
          <a-statistic :precision="2" suffix="₽" title="Общая сумма замеров" :value="sumBy(mathSall[1].target, (i) => Number(i.UF_CRM_1569506341))" />
          <a-statistic :precision="2" suffix="₽" title="Сумма взятых замеров" :value="sumBy(getSuccess(mathSall[1].target), (i) => Number(i.UF_CRM_1569506341))" />
          <a-statistic :precision="2" suffix="₽" v-if="mathSall[1].untarget.length" title="Сумма взятых замеров после 7-го" :value="sumBy(mathSall[1].untarget, (i) => Number(i.UF_CRM_1569506341))"/>
        </a-col>
      </a-row>
      <div>
        <h4>Конверсия в деньгах</h4>
        <a-progress
            :strokeColor="conversionCash(mathSall[1].target) < 30 ? 'red' : conversionCash(mathSall[1].target) < 40?  'yellow' : 'green'"
            :percent="conversionCash(mathSall[1].target)"/>
      </div>

    </a-card>

    <masonry v-if="columns" :cols="{default: 2, 968: 1}">

      <div
          v-for="i in mathSall[0]"
          :key="i.id"
      >
        <a-card
            style="margin: 0 .5rem 1rem .5rem;"
            v-if="(i.target.length || i.untarget.length)  && i.name !== undefined"
            hoverable
            @click="$router.push({name:'conversionUser', params: {id:i.UF_CRM_1568623658, data:i, date: month, rate:getRate(conversion(i.target), conversionCash(i.target))}})"
        >

          <a-row>
            <a-col :span="8">
              <h4>Конверсия {{i.name}}</h4>
              <a-progress style="margin: 1rem" :strokeColor=" conversion(i.target) > 40 ? 'green' : conversion(i.target) >= 30 ? 'yellow' : 'red'" type="circle" :percent="conversion(i.target)" />
            </a-col>
            <a-col :span="8">
              <a-statistic :title="'Замерено / холостых'" :value="i.target.length" :suffix="'/ ' + i.blank.length"/>
              <a-statistic :title="'Передано / подписано дизайнов'" :value="getSuccess(i.target).length" :suffix="'/ '+getDesing(i.target).length" />
              <a-tooltip title="Догоняющие замеры">
                <a-statistic v-if="i.untarget.length" title="Подписано после 7-го" :value="i.untarget.length"/>
              </a-tooltip>

            </a-col>

            <a-col :span="8">
              <a-statistic :precision="2" suffix="₽" title="Общая сумма замеров" :value="sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" title="Сумма взятых замеров" :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" v-if="i.untarget.length" title="Сумма взятых замеров после 7-го" :value="sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341))"/>
            </a-col>
          </a-row>
          <div>
            <h4>Конверсия в деньгах</h4>
            <a-progress
                :strokeColor="conversionCash(i.target) < 30 ? 'red' : conversionCash(i.target) < 40?  'yellow' : 'green'"
                :percent="conversionCash(i.target)"/>
          </div>

          <a-divider>Зарплата:</a-divider>
          <a-col :span="8">
            <a-statistic title="Ставка" :precision="2" suffix="%"
                         :value="getRate(conversion(i.target), conversionCash(i.target))"/>
          </a-col>
          <a-tooltip :title="`${sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)).toFixed(2)} * ${getRate(conversion(i.target), conversionCash(i.target))}%`">
            <a-col :span="8">
                <a-statistic suffix="₽"
                             :title="`Зарплата текущего месяца`" :precision="2"
                             :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`${sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)).toFixed(2)} * ${getRate(conversion(i.target), conversionCash(i.target))}%`">
            <a-col :span="8">
              <a-statistic suffix="₽" v-if="i.untarget.length"
                           :title="`Зарплата предыдущих месяцев`" :precision="2"
                           :value="sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`Бонусы текущего месяца`">
            <a-col :span="8">
              <a-statistic suffix="₽"  v-if="sumBy(getSuccess(i.target), (i) => Number(i.sale))"
                           :title="`Бонусы текущего месяца`" :precision="2"
                           :value="sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`Бонусы с предыдущих месяцев`">
            <a-col :span="8">
              <a-statistic suffix="₽"  v-if="sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"
                           :title="`Бонусы с предыдущих месяцев`" :precision="2"
                           :value="sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`${sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100).toFixed(2)} + ${sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100).toFixed(2)}`">
          <a-col :span="8">
            <a-statistic suffix="₽" v-if="i.untarget.length || sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"
                         :title="`Итого по зарплате`" :precision="2"
                         :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)
                          + sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)
                          + sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"/>
          </a-col>
          </a-tooltip>
        </a-card>
      </div>

    </masonry>


    <div v-if="!columns">
      <div
          v-for="i in mathSall[0]"
          :key="i.id"
      >
        <a-card
            style="margin: 0 .5rem 1rem .5rem;"
            v-if="(i.target.length || i.untarget.length)  && i.name !== undefined"
            hoverable
            @click="$router.push({name:'conversionUser', params: {id:i.UF_CRM_1568623658, data:i, date: month, rate:getRate(conversion(i.target), conversionCash(i.target))}})"
        >

          <a-row>
            <a-col :span="8">
              <h4>Конверсия {{i.name}}</h4>
              <a-progress style="margin: 1rem" :strokeColor=" conversion(i.target) > 40 ? 'green' : conversion(i.target) >= 30 ? 'yellow' : 'red'" type="circle" :percent="conversion(i.target)" />
            </a-col>
            <a-col :span="8">
              <a-statistic :title="'Замерено / холостых'" :value="i.target.length" :suffix="'/ ' + i.blank.length"/>
              <a-statistic :title="'Передано / подписано дизайнов'" :value="getSuccess(i.target).length" :suffix="'/ '+getDesing(i.target).length" />
              <a-tooltip title="Догоняющие замеры">
                <a-statistic v-if="i.untarget.length" title="Подписано после 7-го" :value="i.untarget.length"/>
              </a-tooltip>

            </a-col>

            <a-col :span="8">
              <a-statistic :precision="2" suffix="₽" title="Общая сумма замеров" :value="sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" title="Сумма взятых замеров" :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" v-if="i.untarget.length" title="Сумма взятых замеров после 7-го" :value="sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341))"/>
            </a-col>
          </a-row>
          <div>
            <h4>Конверсия в деньгах</h4>
            <a-progress
                :strokeColor="conversionCash(i.target) < 30 ? 'red' : conversionCash(i.target) < 40?  'yellow' : 'green'"
                :percent="conversionCash(i.target)"/>
          </div>

          <a-divider>Зарплата:</a-divider>
          <a-col :span="8">
            <a-statistic title="Ставка" :precision="2" suffix="%"
                         :value="getRate(conversion(i.target), conversionCash(i.target))"/>
          </a-col>
          <a-tooltip :title="`${sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)).toFixed(2)} * ${getRate(conversion(i.target), conversionCash(i.target))}%`">
            <a-col :span="8">
              <a-statistic suffix="₽"
                           :title="`Зарплата текущего месяца`" :precision="2"
                           :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`${sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)).toFixed(2)} * ${getRate(conversion(i.target), conversionCash(i.target))}%`">
            <a-col :span="8">
              <a-statistic suffix="₽" v-if="i.untarget.length"
                           :title="`Зарплата предыдущих месяцев`" :precision="2"
                           :value="sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`Бонусы текущего месяца`">
            <a-col :span="8">
              <a-statistic suffix="₽"  v-if="sumBy(getSuccess(i.target), (i) => Number(i.sale))"
                           :title="`Бонусы текущего месяца`" :precision="2"
                           :value="sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`Бонусы с предыдущих месяцев`">
            <a-col :span="8">
              <a-statistic suffix="₽"  v-if="sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"
                           :title="`Бонусы с предыдущих месяцев`" :precision="2"
                           :value="sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"/>
            </a-col>
          </a-tooltip>
          <a-tooltip :title="`${sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100).toFixed(2)} + ${sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100).toFixed(2)}`">
            <a-col :span="8">
              <a-statistic suffix="₽" v-if="i.untarget.length || sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"
                           :title="`Итого по зарплате`" :precision="2"
                           :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)
                          + sumBy(getSuccess(i.untarget), (i) => Number(i.UF_CRM_1569506341)) * (getRate(conversion(i.target), conversionCash(i.target))/100)
                          + sumBy(getSuccess(i.target), (i) => Number(i.sale)) + sumBy(getSuccess(i.untarget), (i) => Number(i.sale))"/>
            </a-col>
          </a-tooltip>
        </a-card>
      </div>
    </div>


  </a-spin>
</template>

<script>
import {mapActions,mapState} from 'vuex'
import { forEach, sumBy, round,size } from 'lodash'
import moment from 'moment'
import Bitrix24 from "bitrix24-vue";

export default {
  data() {
    return {
      columns : !localStorage.getItem('columns') ? true : localStorage.getItem('columns') === 'true' ? true : false,
      month: new Date().getDate() > 16 ? moment() : moment().subtract(1, 'months'),
      user:'',
    }
  },

  computed:{
    ...mapState({
      listDeal: state => state.deal.all.data,
      loadDeal: state => state.deal.all.loading,
      listUser: state => state.user.all.data,
    }),


    otch(){
      if (!this.month) return 1
      return this.month.clone().endOf('month').add(7,'days')?this.month.clone().endOf('month').add(7,'days'):1
    },

    mathSall(){
      let a = {
      };
      let sum = {
          target:[],
          untarget:[],
          blank:[],
        }
      if (!this.month) return
      forEach(this.listDeal, (data) => {
        let DateEstimate = moment(data.UF_CRM_1595577914)
        let DateSuccess = moment(data.UF_CRM_1591089625)
        if (DateSuccess.isAfter(moment('2021-01-31'), "day") && DateEstimate.isAfter(moment('2021-01-31'), "day")) {
          const s1 = data.UF_CRM_1582722192816 === null ? null : Number(data.UF_CRM_1582722192816);
          data.sale = s1 < 10 ? s1 <= 5 ? s1 === 5 ? 0.5 : s1 === 0 ? 1 : '?' : 0 : 0;
          data.sale = data.sale > 0 ? (data.sale/100) * data.UF_CRM_1569506341 : 0;
        } else data.sale = 0;
        /* Убрал дополнительную проверку 02.11.2020*/
        if (!data.UF_CRM_1568623658) return;
        if (!a[data.UF_CRM_1568623658]){
          a[data.UF_CRM_1568623658] = {
            target:[],
            untarget:[],
            blank:[],
            name: this.listUser[data.UF_CRM_1568623658]?this.listUser[data.UF_CRM_1568623658].NAME : data.UF_CRM_1568623658
          }
        }
        // UF_CRM_1582722192816
        if (DateEstimate.isSame(this.month, 'month') && data.UF_CRM_1591100871 != 510) {
          a[data.UF_CRM_1568623658].target.push(data)
          sum.target.push(data)
        }
        if (DateEstimate.isSame(this.month, 'month') && data.UF_CRM_1591100871 == 510) {
          a[data.UF_CRM_1568623658].blank.push(data)
          sum.blank.push(data)
        }
        /*if (DateSuccess.isSame(this.month, 'month') && DateEstimate.isBefore(this.month, 'month')){
          if  (
                ( DateEstimate.isSame(this.month.clone().add(-1, 'months'), 'month') && DateSuccess.isAfter(this.month.clone().startOf('month').add(7,'days') ) ||
                ( DateEstimate.isBefore(this.month.clone().add(-1, 'months'), 'month')))
              )   a[data.UF_CRM_1568623658].untarget.push(data)
        }*/
        if (DateEstimate.isBefore(this.month.clone(), 'month') &&
            moment(DateSuccess).isBetween(this.month.clone().startOf('month').add(7,'days'), this.month.clone().add(1,'months').startOf('month').add(7,'days'), undefined, '(]')){
          a[data.UF_CRM_1568623658].untarget.push(data)
          sum.untarget.push(data)
        }

      })
      return [a,sum]
    }

  },

  methods:{
    sumBy,round,size,

    conversionCash(target){
      return round(((sumBy(this.getSuccess(target), (i) => Number(i.UF_CRM_1569506341)))*100/sumBy(target, (i) => Number(i.UF_CRM_1569506341))),2)
    },

    conversion(target){
      return round(((this.getSuccess(target).length+ this.getDesing(target).length ) / target.length) * 100, 2)
    },

    setColumns(){
      localStorage.setItem('columns', this.columns)
    },
    getSuccess(data){
      return data.filter((i) =>  { return (i.UF_CRM_1591100871 !== null && i.UF_CRM_1591100871 == 421) && moment(i.UF_CRM_1591089625).isSameOrBefore(this.otch)})
    },
    getDesing(data){
      return data.filter((i) =>  { return i.UF_CRM_1593965424 && moment(i.UF_CRM_1595577914).isSameOrBefore(this.otch)})
    },
    getBlank(data){
      return data.filter((i) =>  { return i.UF_CRM_1591100871 == 510})
    },
    getRate(conversion,conversionCash){
      let c = round(conversion, 2);
      let stavka = 0
      switch (true) {
        case (c < 30):
          stavka = 1.5;
          break;
        case (c >= 30 && c < 35):
          stavka = 2;
          break;
        case (c >= 35 && c < 40):
          stavka = 2.5;
          break;
        case (c >= 40 && c < 50):
          stavka = 3;
          break;
        case c >= 50 :
          stavka = 3.5;
          break;
          case c >= 60 :
          stavka = 4.5;
          break;
        default: stavka = 1.5
      }
      if (conversionCash >= 35) stavka += 0.5
      return stavka
    },

    async getFullData(){

      if (process.env.NODE_ENV === 'development') this.user = '*'
      const adm = ["4","8","159"]
      const BX24 = await Bitrix24.init()
      if (!BX24) return
      await BX24.init(() => {
        BX24.callMethod('user.current', {}, (result) =>
            {
              this.user = (adm.includes(result.data().ID))?'*':result.data().ID
            }
        )})

    },

    ...mapActions({
      getDealData: 'deal/getAll',
    }),

    async getDeal(date) {

      await this.getDealData({
        filter: {
          '>=UF_CRM_1595577914':moment(date).startOf('month').format('DD.MM.YYYY HH:mm:ss'),
          '<=UF_CRM_1595577914':moment(date).endOf('month').format('DD.MM.YYYY HH:mm:ss'),
          '=UF_CRM_1568623658':(this.user === '*')?[]:this.user,
        },
        select: ['ID','TITLE', 'UF_CRM_1582722192816','UF_CRM_1568623658','UF_CRM_1572957177','UF_CRM_1569506341','UF_CRM_1595577914','UF_CRM_1591089625','UF_CRM_1572957239','UF_CRM_1593965424','UF_CRM_1591100871']
      })
     await this.getDealData({
        filter: {
          'UF_CRM_1572957239': "1",
          '>=UF_CRM_1591089625':moment(date).startOf('month').format('DD.MM.YYYY HH:mm:ss'),
          '<=UF_CRM_1591089625':moment(date).endOf('month').add('days', 7).format('DD.MM.YYYY HH:mm:ss'),
          '=UF_CRM_1568623658':(this.user === '*')?[]:this.user,
          '<=UF_CRM_1595577914':moment(date).endOf('month').format('DD.MM.YYYY HH:mm:ss'),
        },
        select: ['ID','TITLE', 'UF_CRM_1582722192816','UF_CRM_1568623658','UF_CRM_1572957177','UF_CRM_1569506341','UF_CRM_1595577914','UF_CRM_1591089625','UF_CRM_1572957239','UF_CRM_1593965424','UF_CRM_1591100871']
      })
    },

  },
  mounted() {
    this.getFullData();
  }

}

</script>

<style scoped>

</style>
