<template>
  <a-menu v-model="current" mode="horizontal">
    <a-menu-item v-for="i in list" :key="i.key">
      <router-link :to="i.routeName">{{ i.title }}</router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  data(){
    return {
      list: [
        {
          key: '1',
          title: 'Конверсия',
          routeName: 'conversion',
        },{
          key: '2',
          title: 'ГСМ',
          routeName: 'routepay',
        },{
          key: '3',
          title: 'Маршруты',
          routeName: 'route',
        },
      ],
    }
  }
}
</script>

<style scoped>

</style>