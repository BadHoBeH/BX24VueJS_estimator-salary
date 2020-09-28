<template>
  <div>
    <div style="margin: .5rem">
      <a-month-picker v-model="month" @change="getDeal" placeholder="Выбрать месяц" style="margin: 0 .25rem 0 .25rem"/>
      <a-button :disabled="!month" @click="getDeal(month)">найти</a-button>
    </div>

        <!--<a-card style="margin: 0 .5rem 1rem .5rem;" v-for="i in test" :key="i.id" hoverable>
          <a-row>
            <a-col :span="8">
              <h4>Конверсия {{i.name}}</h4>
              <a-progress style="margin: 1rem" :strokeColor="(getSuccess(i.target).length/i.target.length)*100 < 50?'yellow':'green'" type="circle" :percent="((getSuccess(i.target).length/i.target.length)*100).toFixed(2)" />
            </a-col>
            <a-col :span="8">
              <a-statistic title="Замерено/холостых" :value="i.target.length" :suffix="'/ '+i.blank.length"/>
              <a-statistic title="Запущено/дизайнов" :value="getSuccess(i.target).length-getDesing(i.target).length" :suffix="'/ '+getDesing(i.target).length" />
              <a-statistic v-if="i.untarget.length" title="Догоняющие замеры" :value="i.untarget.length"/>
            </a-col>
            <a-col :span="8">
              <a-statistic :precision="2" suffix="₽" title="В деньгах" :value="sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" title="В деньгах" :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" v-if="i.untarget.length" title="В деньгах" :value="sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341))"/>
            </a-col>
          </a-row>
          <div>
            <h4>Конверсия в деньгах</h4>
            <a-progress :percent="((sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))).toFixed(2)"/>
          </div>

          <a-divider>Зарплата:</a-divider>
          <a-col :span="8">
            <a-statistic title="Ставка" :precision="2" suffix="%" :value="getRate((getSuccess(i.target).length/i.target.length)*100 , (sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341)))"/>
          </a-col>
          <a-col :span="8">

            <a-statistic suffix="₽" title="Основная зарплата" :precision="2" :value="(getRate((getSuccess(i.target).length/i.target.length)*100 , sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target), (i) => Number(i.UF_CRM_1569506341))/100*sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)))"/>

          </a-col>
          <a-col :span="8">
            <a-statistic suffix="₽" :precision="2" v-if="i.untarget.length" title="Догоняющая зарплата" :value="(
                    getRate((getSuccess(i.target).length/i.target.length)*100,
                   sumBy(getSuccess(i.target, (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))))/100 * sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341)))"/>
          </a-col>
          <a-col :span="8">
            <a-statistic suffix="₽" :precision="2" v-if="i.untarget.length" title="Итого"
                         :value="(getRate((getSuccess(i.target).length/i.target.length)*100 , sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target), (i) => Number(i.UF_CRM_1569506341))/100*sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))) +
                           getRate((getSuccess(i.target).length/i.target.length)*100,sumBy(getSuccess(i.target, (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))))/100 * sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341))"/>
          </a-col>

        </a-card>-->
    <masonry :cols="{default: 2, 967: 1}">
        <a-card
            style="margin: 0 .5rem 1rem .5rem;"
            v-for="i in test"
            :key="i.id"
            hoverable
            @click="$router.push({name:'conversionUser', params: {id:i.UF_CRM_1568623658, data:i}})"
        >

          <a-row>
            <a-col :span="8">
              <h4>Конверсия {{i.name}}</h4>
              <a-progress style="margin: 1rem" :strokeColor=" ((getSuccess(i.target).length/i.target.length)*100 < 30) ? 'red' : (getSuccess(i.target).length/i.target.length)*100 < 40 ? 'yellow' : 'green'" type="circle" :percent="((getSuccess(i.target).length/i.target.length)*100).toFixed(2)" />
            </a-col>
            <a-col :span="8">
              <a-statistic :title="i.blank.length?'Замерено/холостых':'Замерено'" :value="i.target.length" :suffix="'/ '+i.blank.length"/>
              <a-statistic :title="getDesing(i.target).length?'Запущено/дизайнов':'Запущено'" :value="getSuccess(i.target).length-getDesing(i.target).length" :suffix="'/ '+getDesing(i.target).length" />
              <a-statistic v-if="i.untarget.length" title="Догоняющие замеры" :value="i.untarget.length"/>
            </a-col>
            <a-col :span="8">
              <a-statistic :precision="2" suffix="₽" title="В деньгах" :value="sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" title="В деньгах" :value="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))" />
              <a-statistic :precision="2" suffix="₽" v-if="i.untarget.length" title="В деньгах" :value="sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341))"/>
            </a-col>
          </a-row>
          <div>
            <h4>Конверсия в деньгах</h4>
            <a-progress
                :strokeColor="sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341)) < 30 ? 'red' : sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341)) < 40?  'yellow' : 'green'"
                :percent="((sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))).toFixed(2)"/>
          </div>

          <a-divider>Зарплата:</a-divider>
          <a-col :span="8">
              <a-statistic title="Ставка" :precision="2" suffix="%" :value="getRate((getSuccess(i.target).length/i.target.length)*100 , (sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341)))"/>
          </a-col>
          <a-col :span="8">

            <a-statistic suffix="₽" title="Основная зарплата" :precision="2" :value="(getRate((getSuccess(i.target).length/i.target.length)*100 , sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target), (i) => Number(i.UF_CRM_1569506341))/100*sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341)))"/>

          </a-col>
          <a-col :span="8">
              <a-statistic suffix="₽" :precision="2" v-if="i.untarget.length" title="Догоняющая зарплата" :value="(
                    getRate((getSuccess(i.target).length/i.target.length)*100,
                   sumBy(getSuccess(i.target, (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))))/100 * sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341)))"/>
          </a-col>
          <a-col :span="8">
              <a-statistic suffix="₽" :precision="2" v-if="i.untarget.length" title="Итого по зарплате"
                           :value="(getRate((getSuccess(i.target).length/i.target.length)*100 , sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target), (i) => Number(i.UF_CRM_1569506341))/100*sumBy(getSuccess(i.target), (i) => Number(i.UF_CRM_1569506341))) +
                           getRate((getSuccess(i.target).length/i.target.length)*100,sumBy(getSuccess(i.target, (i) => Number(i.UF_CRM_1569506341))*100/sumBy(i.target, (i) => Number(i.UF_CRM_1569506341))))/100 * sumBy(i.untarget, (i) => Number(i.UF_CRM_1569506341))"/>
          </a-col>

        </a-card>

    </masonry>
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
import { forEach, sumBy, round } from 'lodash'
import moment from 'moment'
export default {
  data() {
    return {
      month:null,
    }
  },

  computed:{
    ...mapState({
      listDeal: state => state.deal.all.data,
      listUser: state => state.user.all.data,
    }),

    otch(){
      if (!this.month) return 1
      return this.month.clone().endOf('month').add(7,'days')?this.month.clone().endOf('month').add(7,'days'):1
    },

    test(){
      let a = {};
      if (!this.month) return
      forEach(this.listDeal, (data) => {
        let DateEstimate = moment(data.UF_CRM_1595577914)
        let DateSuccess = moment(data.UF_CRM_1591089625)
        if (!a[data.UF_CRM_1568623658] && (DateEstimate.isSame(this.month, 'month') || (DateSuccess.isSame(this.month, 'month') && DateEstimate.isBefore(this.month, 'month'))) ){
          a[data.UF_CRM_1568623658] = {
            target:[],
            untarget:[],
            blank:[],
            name: this.listUser[data.UF_CRM_1568623658]?this.listUser[data.UF_CRM_1568623658].NAME : null
          }
        }
        if (DateEstimate.isSame(this.month, 'month') && data.UF_CRM_1591100871 != 510) a[data.UF_CRM_1568623658].target.push(data)
        if (DateEstimate.isSame(this.month, 'month') && data.UF_CRM_1591100871 == 510) a[data.UF_CRM_1568623658].blank.push(data)
        if (DateSuccess.isSame(this.month, 'month') && DateEstimate.isBefore(this.month, 'month')){
          if  (
                ( DateEstimate.isSame(this.month.clone().add(-1, 'months'), 'month') && DateSuccess.isAfter(this.month.clone().startOf('month').add(7,'days') ) ||
                ( DateEstimate.isBefore(this.month.clone().add(-1, 'months'), 'month')))
              )   a[data.UF_CRM_1568623658].untarget.push(data)
        }
      })
      return a
    }

  },

  methods:{
    sumBy,

    getSuccess(data){
      return data.filter((i) =>  { return (i.UF_CRM_1572957239 > 0 || i.UF_CRM_1593965424) && moment(i.UF_CRM_1591089625).isSameOrBefore(this.otch)})
    },
    getDesing(data){
      return data.filter((i) =>  { return i.UF_CRM_1593965424 && moment(i.UF_CRM_1591089625).isSameOrBefore(this.otch)})
    },
    getBlank(data){
      return data.filter((i) =>  { return i.UF_CRM_1591100871 == 510})
    },
    getRate(conversion,conversionCash){
      console.log(conversion,conversionCash)
      let c = round(conversion, 2);
      let stavka = 0
      switch (true) {
        case (c < 30):
          stavka = 1.5;
          break;
        case (c >= 30 && c < 40):
          stavka = 2;
          break;
        case (c >= 40 && c < 50):
          stavka = 3;
          break;
        case c >= 50 :
          stavka = 3.5;
          break;
      }
      if (conversionCash >= 40) stavka += 0.5
      return stavka
    },

    ...mapActions({
      getDealData: 'deal/getAll',
    }),

    async getDeal(date) {
      await this.getDealData({
        filter: {
          '>=UF_CRM_1595577914':moment(date).startOf('month').format('DD.MM.YYYY HH:mm:ss'),
          '<=UF_CRM_1595577914':moment(date).endOf('month').format('DD.MM.YYYY HH:mm:ss')},
        select: ['ID','TITLE','UF_CRM_1568623658','UF_CRM_1572957177','UF_CRM_1569506341','UF_CRM_1595577914','UF_CRM_1591089625','UF_CRM_1572957239','UF_CRM_1593965424','UF_CRM_1591100871']
      })
     /* await this.getDealData({
        filter: {
          'UF_CRM_1572957239': "1",
          '>=UF_CRM_1591089625':moment(date).startOf('month').format('DD.MM.YYYY HH:mm:ss'),
          '<=UF_CRM_1591089625':moment(date).endOf('month').add('days', 7).format('DD.MM.YYYY HH:mm:ss'),
          '<=UF_CRM_1595577914':moment(date).endOf('month').format('DD.MM.YYYY HH:mm:ss')
        },
        select: ['ID','TITLE','UF_CRM_1568623658','UF_CRM_1572957177','UF_CRM_1569506341','UF_CRM_1595577914','UF_CRM_1591089625','UF_CRM_1572957239','UF_CRM_1593965424','UF_CRM_1591100871']
      })*/
    },

  }

}

</script>

<style scoped>

</style>