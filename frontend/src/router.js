import { createRouter, createWebHistory } from 'vue-router'

import Projects from './components/Projects.vue'
import Project from './components/Project.vue'

const routes = [
    {
        path: '/',
        component: Projects
    },
    {
        path: '/projects/:id',
        component: Project
    }
]

export default createRouter({
    routes,
    history: createWebHistory()
})