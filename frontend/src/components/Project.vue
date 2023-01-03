<template>
    <div class="bread-crumbs">
        <RouterLink :to="`/`" class="clr-4">Home</RouterLink>
        <span> > {{ populated_project.name }}</span>
    </div>
    <div class="section">
        <div class="project-intro">
            <span class="fs-big fs-b">{{ populated_project.name }}</span>
            <button class="clr-3 bg-2 fs-medium fs-b"  @click="openProjectModal(populated_project._id)">Edit</button>
        </div> 
        <p class="description clr-3">{{ populated_project.description }}</p>
    </div>
    <div class="section">
        <h3 class="fs-medium fs-b">Team Members</h3>
        <div class="person-card-container bg-2">
            <template v-for="user in populated_project.users">
                <div class="person-card brd-1" :class="{ manager: user._id === populated_project.manager._id}">
                    <div class="person-card-role">
                        <span>{{ user.firstName }}</span>
                        <span class="fs-small">{{ user._id === populated_project.manager._id ? 'Manager' : 'Team Member'}}</span>
                    </div>
                    <span class="fs-small">
                        {{ user.title }}
                    </span>
                </div>
            </template>
        </div>
    </div>
    <div class="section board">
        <div v-for="status in statuses" class="column bg-3 brd-1 pd-2">
            <div class="header">
                <span class="title fs-medium fs-b clr-2">{{ status }}</span>
                <button v-if="status === 'assigned'" class="fs-small" @click="openTaskModal(null, status)">
                    + Add Item
                </button>
            </div>
            <div class="task-container">
                <template v-for="task in populated_project.tasks">
                    <div v-if="task.status === status" class="task-card pd-2 bs brd-1 bg-1">
                        <div class="top">
                            <span class="fs-b">
                                {{ task.name }}
                            </span>
                            <div class="dropdown">
                                <button class="menu-btn fs-small bg-1" >
                                    <span class="bg-3 brd-1"></span>
                                    <span class="bg-3 brd-1"></span>
                                    <span class="bg-3 brd-1"></span>      
                                </button>
                                <div class="dropdown-content bs">
                                    <button class="bg-1" @click="openTaskModal(task._id)">Edit</button>
                                    <button class="bg-1 clr-4" @click="deleteTask(task._id)">Delete</button>
                                </div>
                            </div>
                        </div>
                        
                        <p class="clr-3">{{ task.details }}</p>
                        <div class="bottom">
                            <div class="tags">
                                <div class="tag brd-1 fs-small clr-3">
                                    {{ task.user.firstName }}
                                </div>
                                <div class="tag brd-1 fs-small clr-3">
                                    {{ task.priority }}
                                </div>
                            </div>  
                            <div class="fs-small">
                                Due: {{ task.timeline.due?.slice(0,10) }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
    <Modal v-show="showProjectModal" @closeModal="closeModal('project')">
        <ProjectForm v-if="populated_project.manager" v-bind:project="populated_project" v-bind:available_users="available_users" @closeModal="closeModal('project')" @refresh="refresh"/>
    </Modal>
    <Modal v-show="showTaskModal" @closeModal="closeModal('task')">
        <TaskForm 
            v-if="showTaskModal" 
            v-bind:task="populated_task" 
            v-bind:statuses="statuses" 
            v-bind:possible_users="populated_project.users" 
            v-bind:project="populated_project._id" 
            @closeModal="closeModal('task')" 
            @refresh="refresh"/>
    </Modal>
</template>

<script>
    import { nextTick } from 'vue';
    import Modal from './Modal.vue';
    import ProjectForm from './ProjectForm.vue';
    import TaskForm from './TaskForm.vue';

    export default {
        name: 'Project',
        components: {
            Modal,
            ProjectForm,
            TaskForm
        },
        data() {
            return {
                populated_project: {},
                populated_task: {},
                available_users: [],
                statuses: ['assigned', 'in progress', 'in review', 'completed'],
                showProjectModal: false,
                showTaskModal: false
            }
        },
        methods: {
            setData(project) {
                this.populated_project = project
            },
            async openProjectModal(projectId = null) {
                const usersRes = await fetch(`http://localhost:8888/users/?project=${projectId}`)
                const users = await usersRes.json()

                this.available_users = users.map(user => {
                    return { _id: user._id, name: `${user.firstName} ${user.lastName}`, title: user.title }
                })
                this.showProjectModal = true;
            },
            async openTaskModal(taskId = null, status=null) {
                if(taskId) {
                    const taskRes = await fetch(`http://localhost:8888/tasks/${taskId}`)
                    const task = await taskRes.json()

                    this.populated_task = {
                        ...task,
                        user: task.user._id,
                        due: task.timeline.due.slice(0, 10),
                    }

                    console.log(this.populated_task)
                
                } else {
                    this.populated_task = { status }
                }
                
                this.showTaskModal = true
            },
            async deleteTask(taskId) {
                try {
                    const requestOptions = {
                        method: 'DELETE',
                        mode: 'cors',
                    }
                    const res = fetch(`http://localhost:8888/tasks/${taskId}`, requestOptions)
                } catch (error){
                    console.log(error)
                    
                }
                this.refresh()
            },
            closeModal(modal) {
                if (modal === 'project') {
                    this.showProjectModal = false;
                } 
                else if (modal === 'task') {
                    this.showTaskModal = false;
                }
            },
            async refresh() {
                const projectRes = await fetch(`http://localhost:8888/projects/${this.populated_project.id}`)
                const project = await projectRes.json()
                this.populated_project = project
            }
        },
        async beforeRouteEnter(to, from, next) {
            const projectRes = await fetch(`http://localhost:8888/projects/${to.params.id}`)
            const project = await projectRes.json()

            next(function (vm) {
                return vm.setData(project)
            })
        }
    }
</script>
<style scoped>
    .project-intro{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgb(232,232,232);
    }
    .project-intro button{
        border: 0;
        cursor: pointer;
    }
    .description{
        margin-top: 15px;
    }
    .section{
        margin: 25px 0;
    }
    .person-card-container{
        display: flex;
        padding: 5px;
        gap: 5px;
        overflow-x: scroll;
        
    }
    .person-card{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        flex-grow: 1;
        padding: 10px 20px;
        background-color: white;
        white-space: nowrap;
        max-width: 300px;
    }
    .person-card-role{
        display: flex;
        flex-direction: column;
    }
    .manager{
        border: 1px solid #F88E2D;
    }
    .board{
        display: flex;
        gap: 10px;
        height: 60vh;
        overflow-x: scroll;
    }
    .column{
        flex-basis: 23%;
        min-width: 350px;
        flex-grow: 1;
    }
    .column .header{
        display: flex;
        justify-content: space-between;
    }
    .column .title{
        text-transform: capitalize;
    }
    .column button{
        border: 0;
        cursor: pointer;
    }
    .task-container{
        display: flex;
        flex-direction: column;
        height: 95%;
        gap: 5px;
        overflow-y: scroll;
    }
    .task-card .top{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .task-card .bottom{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 25px;
    }
    .dropdown{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
    .dropdown:hover .dropdown-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 3px;
    }
    .dropdown-content{
        display: none;
        position: absolute;
        box-sizing: border-box;
        top:0;
        right: 0;
        padding: 5px;
        margin-top: 10px;
        background-color: white;
    }
    .dropdown-content button:hover{
        opacity: 0.7;
        transition: 0.2s;
    }
    .menu-btn{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 2px;
    }
    .menu-btn span{
        height: 7px;
        width: 7px;
        overflow: hidden;

    }
    .tags{
        display: flex;
        gap: 5px;
    }
    .tag{
        padding: 5px 15px;
        text-transform: capitalize;
    }
   
</style>