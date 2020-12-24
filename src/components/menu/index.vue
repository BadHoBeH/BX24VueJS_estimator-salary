<template>
  <a-menu mode="horizontal">
    <a-menu-item v-for="i in list" :key="i.key">
      <router-link :to="{name: i.name}" tag="li" class="ant-menu-item" active-class="ant-menu-item ant-menu-item-active">{{ i.title }}</router-link>
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
          title: 'ГСМ',
          path: 'gsm',
          name: 'routepay',
        },{
          key: '4',
          title: 'Маршруты',
          path: 'route',
          name: 'route',
        },
      ],
    }
  },
}
</script>

<style scoped>

</style>
