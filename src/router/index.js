import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/Manage.vue'),
    redirect: "/login",
    children: [
      {path: 'home', name: '首页', component: () => import('../views/Home.vue')},
      {path: 'elder', name: '用户管理', component: () => import('../views/Elder.vue')},
      {path: 'volunteer', name: '志愿者管理', component: () => import('../views/Volunteer.vue')},
      {path: 'distribution', name: '分配设置', component: () => import('../views/Distribution.vue')},
      {path: 'activity', name: '新闻活动', component: () => import('../views/Activity.vue')},
      {path: 'article', name: '用户文章', component: () => import('../views/Article.vue')},
      {path: 'about', name: '关于', component: () => import('../views/About.vue')}
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to , from , next ) => {
  localStorage.setItem("currentPathName", to.name)
  next()
})

export default router
