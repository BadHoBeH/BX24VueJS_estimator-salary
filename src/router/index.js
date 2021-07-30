import Vue from 'vue'
import VueRouter from 'vue-router'
/*Page active*/


//import route from "../components/route/index";
//import routepay from "../components/route-pay/index";
import conversion from "../components/conversion/index";
//import slozno from "../components/conversion/help";
import conversionUser from "../components/conversion/user/index";


/*Page passive*/

Vue.use(VueRouter);
const routes = [

    {
        path: '/',
        name: 'conversion',
        component: conversion
    },{
        path: '/111',
        name: 'conversion111',
        component: conversion,
        params: {nsdo: 159}
    },{
        path: '/112',
        name: 'conversion112',
        component: conversion,
        params: {nsdo: 337}
    },{
        path: '/conversion/:id',
        name: 'conversionUser',
        component: conversionUser
    }
];


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
