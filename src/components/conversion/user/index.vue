<template>
  <div>
    <a-page-header
        :title="'Конверсия '+data.name"
        sub-title="Подробная конверсия"
        @back="$router.go(-1)"
    />
    <a-divider>Замеры</a-divider>


      <a-table :pagination="false" :columns="columns.target" :data-source="targetData">
        <a target="_blank" :href="'https://crm.sknebo.ru/crm/deal/details/'+title.id+'/'" slot="title" slot-scope="title"> {{title.title}} </a>
        <a slot="dateZamer" slot-scope="dateZamer">{{moment(dateZamer).format('DD MMMM YYYY')}}</a>
        <a slot="dateSuccess" slot-scope="dateSuccess">{{ dateSuccess }}</a>
        <a-statistic slot="sum" slot-scope="sum" :precision="2" suffix="₽" :value="sum"/>
        <a-statistic slot="cash" :value-style="cash.type > 0 ? cash.type === 2 ? {color: 'green'} : {color: 'black'} : {color: 'red'} " slot-scope="cash" :precision="2" suffix="₽" :value="cash.money"/>
      </a-table>

    <a-divider v-if="untargetData.length">Догоняющие</a-divider>

      <a-table v-if="untargetData.length" :pagination="false" :columns="columns.target" :data-source="untargetData">
        <a target="_blank" :href="'https://crm.sknebo.ru/crm/deal/details/'+title.id+'/'" slot="title" slot-scope="title"> {{title.title}} </a>
        <a slot="dateZamer" slot-scope="dateZamer">{{moment(dateZamer).format('DD MMMM YYYY')}}</a>
        <a slot="dateSuccess" slot-scope="dateSuccess">{{ dateSuccess }}</a>
        <a-statistic slot="sum" slot-scope="sum" :precision="2" suffix="₽" :value="sum"/>
        <a-statistic slot="cash" slot-scope="cash" :precision="2" suffix="₽" :value="cash.money"/>
      </a-table>

    <a-divider v-if="blank.length">Холостые</a-divider>

      <a-table v-if="blank.length" :pagination="false" :columns="columns.target" :data-source="blank">
        <a target="_blank" :href="'https://crm.sknebo.ru/crm/deal/details/'+title.id+'/'" slot="title" slot-scope="title"> {{title.title}} </a>
        <a slot="dateZamer" slot-scope="dateZamer">{{moment(dateZamer).format('DD MMMM YYYY')}}</a>
        <a slot="dateSuccess" slot-scope="dateSuccess">{{ dateSuccess }}</a>
        <a-statistic slot="sum" slot-scope="sum" :precision="2" suffix="₽" :value="sum"/>
        <a-statistic slot="cash" slot-scope="cash" :precision="2" suffix="₽" :value="cash.money"/>
      </a-table>

  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      columns: {
        target: [
            {scopedSlots: {customRender:'title'}, title: 'ID',key:'title',dataIndex:'title'},
            {scopedSlots: {customRender:'dateZamer'},title: 'Дата замера',key:'dateZamer',dataIndex:'dateZamer'},
            {scopedSlots: {customRender:'dateSuccess'},title: 'Дата подписания',key:'dateSuccess',dataIndex:'dateSuccess'},
            {scopedSlots: {customRender:'sum'}, title: 'Сумма замера',key:'sum',dataIndex:'sum'},
            {scopedSlots: {customRender:'cash'}, title: 'Выплата за объект',key:'cash',dataIndex:'cash'},
            ],
      },
      data: this.$route.params.data
    }
  },
  computed: {
    targetData() {
      let a = [];
      this.$route.params.data.target.forEach((i) => {
        let data = {
          title: {id: i.ID, title: i.TITLE},
          dateZamer: i.UF_CRM_1595577914,
          dateSuccess: (i.UF_CRM_1572957239 > 0 && !i.UF_CRM_1593965424) ? moment(i.UF_CRM_1591089625).format('DD MMMM YYYY') : (i.UF_CRM_1593965424) ? 'Дизайн' : 'Не подписан',
          sum: i.UF_CRM_1569506341,
          cash: {
            money:i.UF_CRM_1569506341 * (this.$route.params.rate / 100),
            type: i.UF_CRM_1593965424 !== null ?
                0 : (Number (i.UF_CRM_1572957239) && moment(i.UF_CRM_1591089625).isSameOrBefore(this.otch())) ?
                    2 : i.UF_CRM_1572957239
          }
        }
        console.log(i.UF_CRM_1593965424, i.UF_CRM_1572957239, data)
        a.push(data)
      })
      return a
    },

    untargetData() {
      let a = [];
      this.$route.params.data.untarget.forEach((i) => {
        let data = {
          title: {id: i.ID, title: i.TITLE},
          dateZamer: i.UF_CRM_1595577914,
          dateSuccess: (i.UF_CRM_1572957239 > 0) ? moment(i.UF_CRM_1591089625).format('DD MMMM YYYY') : (i.UF_CRM_1593965424) ? 'Дизайн подписан' : 'Не подписан',
          sum: i.UF_CRM_1569506341,
          cash: {money:i.UF_CRM_1569506341 *(this.$route.params.rate / 100), type: i.UF_CRM_1593965424? 0 : i.UF_CRM_1572957239}
        }
        a.push(data)
      })
      return a
    },

    blank() {
      let a = [];
      this.$route.params.data.blank.forEach((i) => {
        let data = {
          title: {id: i.ID, title: i.TITLE},
          dateZamer: i.UF_CRM_1595577914,
          dateSuccess: (i.UF_CRM_1572957239 > 0) ? moment(i.UF_CRM_1591089625).format('DD MMMM YYYY') : (i.UF_CRM_1593965424) ? 'Дизайн подписан' : 'Не подписан',
          sum: i.UF_CRM_1569506341,
          cash: {money:i.UF_CRM_1569506341 *(this.$route.params.rate / 100), type: i.UF_CRM_1593965424?0:i.UF_CRM_1572957239}
        }
        a.push(data)
      })
      return a
    },


  },


  methods:{
    moment,

    otch(){
      const month = this.$route.params.date;
      return month.clone().endOf('month').add(7,'days') ? month.clone().endOf('month').add(7,'days') : 1
    },
  },


  mounted() {
    console.log(this.$route)
    console.log(this.$route.params)
  }


  }
</script>

<style scoped>

</style>
