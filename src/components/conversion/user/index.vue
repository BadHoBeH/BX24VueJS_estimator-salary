<template>
  <div>
    {{columns.target}}
    {{data.target}}
    <a-page-header
        :title="'Конверсия '+data.name"
        sub-title="Подробная конверсия"
        @back="$router.go(-1)"
    />
    <h2>Замеры в этом месяце</h2>
      <a-table :pagination="false" :columns="columns.target" :data-source="data.target">
        <a target="_blank" :href="'https://crm.sknebo.ru/crm/deal/details/'+id+'/'" slot="id" slot-scope="id"> -> </a>
        <b slot="date" slot-scope="date">{{moment(date).format('DD MMMM YYYY')}}</b>
        <a-statistic slot="sum" slot-scope="sum" :precision="2" suffix="₽" :value="sum"/>
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
            {scopedSlots: {customRender:'id'},key:'ID',dataIndex:'ID'},
            {title: 'ID',key:'TITLE',dataIndex:'TITLE'},
            {scopedSlots: {customRender:'date'},title: 'Дата замера',key:'UF_CRM_1595577914',dataIndex:'UF_CRM_1595577914'},
            {scopedSlots: {customRender:'sum'}, title: 'Сумма замера',key:'UF_CRM_1569506341',dataIndex:'UF_CRM_1569506341'},
            ],
      },
      data: this.$route.params.data
    }
  },
  methods:{
    moment,
  },
  mounted() {
    console.log(this.$route)
  }
}
</script>

<style scoped>

</style>