<template>
    <div class="project-list-container">
        <div v-for="project in projects" class="project-block">
            <div class="project-card brd-1 bs bg-1 pd-2">
                <div>
                    <RouterLink :to="`/projects/${project._id}`" class="title fs-b fs-medium">{{ project.name }}</RouterLink>
                    <p class="text clr-3">{{ project.description }}</p>
                </div>
                <a class="link fs-b" :href="project.repository" target="_blank">Visit Repository</a>
            </div>
        </div>
        <button class="add-project brd-1 bs bg-1 fs-medium clr-3" @click="openProjectModal()">
            +
        </button>
    </div>
    <Modal v-show="showModal" @closeModal="closeModal">
        <ProjectForm v-bind:project="project_data" v-bind:available_users="available_users"  @closeModal="closeModal" @refresh="refresh"/>
    </Modal>     
</template>

<script>
    import Modal from './Modal.vue'
    import ProjectForm from './ProjectForm.vue'
    export default {
        name: 'Projects',
        components: {
            Modal,
            ProjectForm
        },
        data() {
            return {
                projects: [],
                project_data: {
                    name: '',
                    description: '',
                    repository: ''
                },
                available_users: [],
                showModal: false
            }
        }, 
        methods: {
            async openProjectModal(projectId = null) {
                
                const usersRes = await fetch(`http://localhost:8888/users/?project=${projectId}`)
                const users = await usersRes.json()

                this.available_users = users.map(user => {
                    return { _id: user._id, name: `${user.firstName} ${user.lastName}`, title: user.title }
                })
                this.showModal = true;
            },

            closeModal() {
                this.showModal = false;
            },

            async refresh() {
                const rest = await fetch(`http://localhost:8888/projects`)

                const body = await rest.json()
                this.projects = body
            }
        },
        async created() {
            this.refresh()
        }
    }
</script>

<style local>
    .project-list-container{
        display: grid;
        justify-content: center;
        align-content: center;
        grid-template-columns: 1fr;
        gap: 10px;
    }
    .project-card{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    .project-card .title:hover{
        text-decoration: underline;
    }
    .project-card .text{
        margin-top: 5px;
    }
    .project-card .link{
        margin-top: 50px;
        padding-left: 10px;
        border-left: 5px solid #F88E2D; 
        transition: .1s;
    }
    .project-card .link:hover{
        transition: .1s;
        border-left: 7px solid #F88E2D;
    }
    .add-project{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
    }
    .add-project:hover{
        box-shadow: none;
        transition: .2s;
    }
    @media (min-width: 40rem){
        .project-list-container{
            grid-template-columns: 1fr 1fr;
        }        
    }
    @media (min-width: 80rem){
        .project-list-container{
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }        
    }
</style>