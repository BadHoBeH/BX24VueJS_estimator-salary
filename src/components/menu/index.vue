<template>
  <a-menu mode="horizontal">
    <a-menu-item v-for="i in list" :key="i.key">
      <router-link
          :to="{name: i.name, params: i.params}"
          tag="li" class="ant-menu-item"
          active-class="ant-menu-item ant-menu-item-active">
        {{ i.title }}
      </router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  data(){
    return {
      list: [
       {
          key: '2',
          title: 'Конверсия',
          path: '',
          name: 'conversion',
        },{
          key: '3',
          title: 'НСДО1',
          path: '',
          name: 'conversion111',
          params: {nsdo: 159}
        },{
          key: '4',
          title: 'НСДО2',
          path: '',
          name: 'conversion112',
          params: {nsdo: 337}
        }

      ],
    }
  },
}
</script>

<style scoped>

</style>
