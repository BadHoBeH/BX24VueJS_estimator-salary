<template>
  <div>
    <a-page-header
        :title="'Конверсия '+data.name"
        sub-title="Подробная конверсия"
        @back="$router.go(-1)"
    />
    <div v-for="i in convert(data)" :key="i.key">
      <a-divider>{{ i.title }}</a-divider>
      <a-table :pagination="i.pagination || false" :columns="i.columns" :data-source="i.dataSource">
        <a target="_blank" :href="'https://crm.sknebo.ru/crm/deal/details/'+title.id+'/'" slot="title" slot-scope="title"> {{title.title}} </a>
        <span slot="dateZamer" slot-scope="dateZamer">{{moment(dateZamer).format('DD MMMM YYYY')}}</span>
        <span slot="dateSuccess" slot-scope="dateSuccess">{{ dateSuccess ? moment(dateSuccess).format('DD MMMM YYYY') : 'Ещё не успешен' }}</span>
        <span slot="dateSuccess" slot-scope="dateDesign">{{ dateDesign ? moment(dateDesign).format('DD MMMM YYYY') : 'Ещё не подписан' }}</span>
        <a-statistic slot="sum" slot-scope="sum" :precision="2" suffix="₽" :value="sum"/>
        <a-statistic slot="saleproc" slot-scope="saleproc" :precision="2" suffix="%" :value="saleproc"/>
        <a-statistic slot="bSale" :value-style="bSale > 0 ? {color: 'green'} : null" slot-scope="sale" :precision="1" suffix="₽" :value="sale"/>
        <a-statistic slot="payEst" :value-style="`color: ${payEst.color}`" slot-scope="payEst" :precision="1" suffix="₽" :value="payEst.val"/>
        <a-statistic slot="paySum" slot-scope="paySum" :precision="1" suffix="₽" :value="paySum"/>
        <a-statistic slot="bDesign" :value-style="`color: ${bDesign.color}`" slot-scope="bDesign" :precision="1" suffix="₽" :value="bDesign.val"/>
      </a-table>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
const columns = {
  def: [
  {scopedSlots: {customRender:'title'}, title: 'ID', key:'title', dataIndex:'title'},
  {scopedSlots: {customRender:'dateZamer'},title: 'Дата замера', key:'dateZamer', dataIndex:'UF_CRM_1595577914'},
  {scopedSlots: {customRender:'dateSuccess'},title: 'Дата подписания', key:'dateSuccess', dataIndex:'UF_CRM_1591089625'},
  {scopedSlots: {customRender:'sum'}, title: 'Сумма замера', key:'sum', dataIndex:'UF_CRM_1569506341'},
  {scopedSlots: {customRender:'saleproc'}, title: 'Процент скидки', key:'saleproc', dataIndex:'UF_CRM_1582722192816'},
  {scopedSlots: {customRender:'bSale'}, title: 'Бонус скидки', key:'bSale', dataIndex:'sale'},
  {scopedSlots: {customRender:'bDesign'}, title: 'Бонус дизайна', key:'bDesign', dataIndex:'bDesign'},
  {scopedSlots: {customRender:'payEst'}, title: 'Выплата за объект', key:'payEst',dataIndex:'payEst'},
  {scopedSlots: {customRender:'paySum'}, title: 'Итого', key:'paySum',dataIndex:'paySum'},
],  design: [
  {scopedSlots: {customRender:'title'}, title: 'ID', key:'title', dataIndex:'title'},
  {scopedSlots: {customRender:'dateZamer'},title: 'Дата замера', key:'dateZamer', dataIndex:'UF_CRM_1595577914'},
  {scopedSlots: {customRender:'dateDesign'},title: 'Дата подписания дизайна', key:'dateDesign', dataIndex:'UF_CRM_1615979431'},
  {scopedSlots: {customRender:'bDesign'}, title: 'Бонус дизайна', key:'bDesign', dataIndex:'bDesign'},
], blank: [
  {scopedSlots: {customRender:'title'}, title: 'ID', key:'title', dataIndex:'title'},
  {scopedSlots: {customRender:'dateZamer'},title: 'Дата замера', key:'dateZamer', dataIndex:'UF_CRM_1595577914'},
    {scopedSlots: {customRender:'sum'}, title: 'Сумма замера', key:'sum', dataIndex:'UF_CRM_1569506341'},
]}

export default {
  data() {
    return {
      table: [
        {
          key: 'tEstimate',
          title: 'Замеры (все замеры за месяц)',
          dataSource: null,
          columns: columns.def
        }, {
          key: 'uEstimate',
          title: 'Замеры (догнали)',
          dataSource: null,
          columns: columns.def
        }, {
          key: 'uDesign',
          title: 'Дизайны (догнали)',
          dataSource: null,
          columns: columns.design
        }, {
          key: 'hEstimate',
          title: 'Холостые',
          dataSource: null,
          columns: columns.blank
        }
      ],
      data: this.$route.params.data
    }
  },
  computed: {



  },


  methods:{
    moment,


    convert(data) {
      this.table.map((i) => {
       switch (i.key) {
          case 'uEstimate' :
          case 'hEstimate' :
          case 'tEstimate' : {
            let module = (i.key === 'tEstimate') ? data.target : (i.key === 'uEstimate') ? data.untarget : data.blank
            i.dataSource = module.estimate.map((i) => {
              i.title = { id: i.ID, title: i.TITLE}
              i.bDesign = (i.UF_CRM_1615979431 && module.design.find((i2) => i2.ID === i.ID))
                  ? { val: i.UF_CRM_1618824869, text: 'Дизайн учтён', color: 'green'} || { val: i.UF_CRM_1618824869, text: 'Дизайн учтён, бонуса нет', color: 'green'}
                  : { val: 0, text: 'Дизайн не найден / идёт в другой месяц'};
              i.payEst = {
                val: i.UF_CRM_1569506341 * (this.$route.params.rate / 100),
                color: i.UF_CRM_1591089625 ? 'green' : 'red'}
              i.paySum = Number ( Number (i.UF_CRM_1591089625 ? i.payEst.val : 0) +  Number(i.bDesign.val) + Number (i.sale));
              return i;
            })
            break;
          }
          case 'uDesign': {
            let module = data.untarget
            i.dataSource = module.design.map((i) => {
              i.title = { id: i.ID, title: i.TITLE}
              i.bDesign = (i.UF_CRM_1615979431 && module.design.find((i2) => i2.ID === i.ID))
                  ? { val: i.UF_CRM_1618824869, text: 'Дизайн учтён', color: 'green'} || { val: i.UF_CRM_1618824869, text: 'Дизайн учтён, бонуса нет', color: 'green'}
                  : { val: 0, text: 'Дизайн не найден / идёт в другой месяц'};
              return i;
            })
            break;
          }
        }
      })
      return this.table.filter((i3) => i3.dataSource.length);
    },
  },


  mounted() {

  }


  }
</script>

<style scoped>

</style>
