<template>
    <form class="form">
        <span class="fs-medium fs-b">{{project._id ? `Edit` : `Create`}} Project</span>
        <label class="fs-b label">Name</label>
        <input v-model="project.name" type="text" class="brd-2" placeholder="Project Name" required/>
        <label class="fs-b label">Description</label>
        <textarea v-model="project.description" type="text" class="brd-2" placeholder="Describe your project..."/>
        <label class="fs-b label">Repository</label>
        <input v-model="project.repository" type="text" class="brd-2"  placeholder="https://myrepository.com" />
        <label class="fs-b label">Manager</label>
        <div class="brd-2">
            <div v-if="(available_users.length)" class="manager-buttons bg-2">
                <div v-for="user in available_users" class="person-button">
                    <input type="radio" v-model="this.selected_manager" :id="`radio-${user._id}`" name="manager" :value="user._id"/>
                    <label :for="`radio-${user._id}`" class="brd-1 person-card">
                        <span>
                            {{ user.name }}
                        </span>
                        <span class="fs-small">
                            {{ user.title }}
                        </span>
                    </label>
                </div> 
            </div>
            <div v-else class="member-buttons clr-3">
                No available users
            </div>
        </div>
        <label class="fs-b label">Team Members</label>
        <div class="brd-2">
            <div v-if="(available_users.length)" class="member-buttons bg-2">
                <template v-for="user in available_users">
                    <div v-if="user._id !== this.selected_manager" class="person-button">
                        <input type="checkbox" v-model="selected_users" :id="`check-${user._id}`" name="members" :value="user._id"/>
                        <label :for="`check-${user._id}`" class="brd-1 person-card">
                            <span>
                                {{ user.name }}
                            </span>
                            <span class="fs-small">
                                {{ user.title }}
                            </span>
                        </label>
                    </div>
                    <div v-else class="brd-1 person-card selected ">
                        <span>
                            {{ user.name }}
                        </span>
                        <span class="fs-small">
                            {{ user.title }}
                        </span>
                    </div>
                </template>
            </div>
            <div v-else class="member-buttons clr-3">
                No available users
            </div>
        </div>
        <input v-if="project._id" type="button" @click="updateProject" class="btn brd-2 bg-5 clr-1" value="Update" />
        <input v-else type="button" @click="addProject" class="btn brd-2 bg-5 clr-1" value="Create" />
    </form>
</template>

<script>
    export default {
        name: 'ProjectForm',
        props: {
            project: Object,
            available_users: Array
        },
        data() {
            return {
                selected_manager: '',
                selected_users: [],
                error: null
            }
        },

        methods: {
            handleError() {
                this.error = true
                setTimeout(function (scope) {
                    scope.error = null
                }, 2000, this)
            },
            async addProject() {
                try{
                    // Check if manager is in selected_users, if not add him/her
                    if(!this.selected_users.includes(this.selected_manager)){
                        this.selected_users.push(this.selected_manager)
                    };
                    const data = {
                        ...this.project,
                        manager: this.selected_manager,
                        users: this.selected_users
                    }

                    const requestOptions = {
                        method: 'POST',
                        mode: 'cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }

                    await fetch('http://localhost:8888/projects', requestOptions)

                    this.$emit('closeModal')
                    this.$emit('refresh')
                } catch(error) {
                    this.handleError()
                }
            },
            async updateProject() {
                try {
                    // Check if manager is in selected_users, if not add him/her
                    if(this.selected_manager && !this.selected_users.includes(this.selected_manager)){
                        this.selected_users.push(this.selected_manager);
                    };

                    delete this.project.tasks

                    const data = {
                        ...this.project,
                        manager: this.selected_manager,
                        users: this.selected_users
                    }

                    const requestOptions = {
                        method: 'PUT',
                        mode: 'cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }

                    await fetch(`http://localhost:8888/projects/${this.project._id}`, requestOptions)
                    this.$emit('closeModal')
                } catch (error) {
                    this.handleError()
                }
                
            },

            refresh() {
                this.$emit('refresh')
            },
            closeModal() {
                this.$emit('closeModal')
            }
        },
        async created() {
            if (this.project._id) {
                this.selected_manager = this.project.manager._id
            }
        }
    }
</script>

<style scoped>
    .form{
        display: flex;
        flex-direction: column;
    }
    .form .label{
        margin-top: 25px;
        
    }
    .form input{
        padding: 5px;
    }
    .form textarea{
        min-height: 100px;
        padding: 5px;
    }
    .form .btn{
        margin-top: 25px;
        padding: 15px 60px;
        align-self: flex-end;
        cursor: pointer;
    }

    .manager-buttons{
        display: grid;
        grid-template-columns: repeat(auto-fill, 200px);
        grid-auto-flow: column;
        gap: 5px;
        overflow-x: scroll;
        padding: 5px;
    }
    .member-buttons{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        padding: 5px;
        gap: 5px;
    }
    .person-button{
        display: flex;
        min-width: 200px;
        gap: 10px;
        flex-grow: 1;
        
    }
    .person-button input{
        display: none;
    }
    .person-card{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 5px;
        padding-left: 20px;
        background-color: white;
        cursor: pointer;
    }
    .person-button input:checked+.person-card{
        border: 1px solid orange;
    }
    .selected{
        border: 1px solid orange;
    }
</style>