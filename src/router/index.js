import Vue from "vue";
import Router from 'vue-router';
import Home from "@/components/common/Home.vue";

// eslint-disable-next-line no-unused-vars
import CustomerList from "@/components/pages/custimer/CustomerList.vue";
// eslint-disable-next-line no-unused-vars
import CommonCustomer from "@/components/pages/custimer/CommonCustomer.vue";
// eslint-disable-next-line no-unused-vars
import AllOrder from "@/components/pages/order/AllOrder.vue";
// eslint-disable-next-line no-unused-vars
import MyOrder from "@/components/pages/order/MyOrder.vue";
// eslint-disable-next-line no-unused-vars
import FirstPage from "@/components/pages/FirstPage.vue";
import Login from "@/components/common/Login.vue";
import SysUser from "@/components/pages/sys/SysUser.vue";
import SysRole from "@/components/pages/sys/SysRole.vue";
import SysMenu from "@/components/pages/sys/SysMenu.vue";
import SysLog from "@/components/pages/sys/SysLog.vue";

Vue.use(Router)

// 获取原型对象push函数
const originalPush = Router.prototype.push
// 获取原型对象replace函数
const originalReplace = Router.prototype.replace
// 修改原型对象中的push函数
Router.prototype.push = function push(location){
    return originalPush.call(this , location).catch(err=>err)
}
// 修改原型对象中的replace函数
Router.prototype.replace = function replace(location){
    return originalReplace.call(this , location).catch(err=>err)
}

export default new Router({
    routes: [
        {
            path:'/',
            name:'Home',
            component:Home,
            redirect:'FirstPage',
            children:[
                {
                    path:'/FirstPage',
                    name:'firstPage',
                    component:FirstPage,
                },
                {
                    path:'/CustomerList',
                    name:'customerList',
                    component:CustomerList
                },
                {
                    path:'/CommonCustomer',
                    name:'commonCustomer',
                    component:CommonCustomer
                },
                {
                    path:'/AllOrder',
                    name:'allOrder',
                    component:AllOrder
                },
                {
                    path:'/MyOrder',
                    name:'myOrder',
                    component:MyOrder
                },
                {
                    path:'/SysUser',
                    name:'sysUser',
                    component:SysUser
                },
                {
                    path:'/SysRole',
                    name:'sysRole',
                    component:SysRole
                }
                ,{
                    path:'/SysMenu',
                    name:'sysMenu',
                    component:SysMenu
                },
                {
                    path:'/SysLog',
                    name:'sysLog',
                    component:SysLog
                }
            ]
        },
        {
            path:'/Login',
            name:'Login',
            component:Login,
        }

    ],
})