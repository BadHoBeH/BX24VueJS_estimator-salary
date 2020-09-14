import Vue from 'vue'
import VueRouter from 'vue-router'
/*Page active*/

import index from "../components/index";
import route from "../components/route/index";
import routepay from "../components/route-pay/index";
import conversion from "../components/conversion/index";


/*Page passive*/

Vue.use(VueRouter);
const routes = [
    {
        path: '/route',
        name: 'route',
        component: route
    },{
        path: '/gsm',
        name: 'routepay',
        component: routepay
    },{
        path: '/conversion',
        name: 'conversion',
        component: conversion
    },{
        path: '/',
        name: 'index',
        component: index
    }
];


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});


export default router