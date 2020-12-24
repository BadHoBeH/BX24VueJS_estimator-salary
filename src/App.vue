<template>
  <div style="position: relative" id="main" ref="main">
    <a-back-top />
    <menuz/>
    <router-view/>
    <resize-observer @notify="updateViewSize" />
    <div :style="{height:razmer+'px'}"></div>
  </div>
</template>
<script>

import {mapActions} from 'vuex'
import menuz from '../src/components/menu/index'
import Bitrix24 from "bitrix24-vue";

export default {

  components: { menuz },
  data() {
    return {
      a: 100,
      razmer: 100,
      lastHeight: 0
    };

  },
  computed:{

  },
  methods: {

    ...mapActions({
      getUser: 'user/getSync',
    }),


    async updateViewSize({ width, height })  {
      const BX24 = await Bitrix24.init()
      if (!BX24) return
      console.log(width, height)
      if(height % 3) this.razmer++;
      BX24.fitWindow()
    },


    getAllUsers(){
      this.getUser({
        select: ['ID', 'NAME', 'UF_DEPARTMENT', 'WORK_POSITION'],
        key:'ID',
      })
    },

  },

  mounted() {
    this.getAllUsers();
  }

};
</script>
