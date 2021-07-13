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
    },/*{
        path: '/route',
        name: 'route',
        component: route
    },{
        path: '/slozno',
        name: 'slozno',
        component: slozno
    },{
        path: '/gsm',
        name: 'routepay',
        component: routepay
    },*/{
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