<template>
  <form v-if="task" class="form">
        <span class="fs-medium fs-b">{{ task?._id ? `Edit` : `Create` }} Task</span>
        <p v-if="!this.isAssigned" class="clr-3 fs-small">You can only edit task status while "{{ task.status }}".</p>
        <label class="fs-b label">Name</label>
        <input v-model="task.name" type="text" class="brd-2 clr-3" placeholder="Task Name" required :readonly="!this.isAssigned"/>
        <label class="fs-b label">Description</label>
        <textarea v-model="task.details" type="text" class="brd-2 clr-3" placeholder="Describe your task..." :readonly="!this.isAssigned"/>
        <div class="dropdown-container">
            <div class="dropdown">
                <label class="fs-b">User</label>
                <select v-model="task.user" class="brd-1 pd-1 clr-3" required :disabled="!this.isAssigned">
                    <option v-for="user in possible_users" :value="user._id">
                        {{ `${user.firstName} ${user.lastName}` }}
                    </option>
                </select>
            </div>
            <div class="dropdown">
                <label class="fs-b">Priority</label>
                <select v-model="task.priority" class="brd-1 pd-1 clr-3" required :disabled="!this.isAssigned">
                    <option value="high" selected>High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div class="dropdown">
                <label class="fs-b">Due Date</label>
                <input v-model="task.due" type="date" class="brd-1 pd-1 clr-3" required :readonly="!this.isAssigned"/>
            </div>
            <div class="dropdown">
                <label class="fs-b">Status</label>
                <select v-model="task.status" class="brd-1 pd-1 clr-3" required>
                    <option v-for="status in statuses" :value="status">
                        {{ status }}
                    </option>
                </select>
            </div>
        </div>
        <input v-if="task?._id" type="button" @click="updateTask" class="btn brd-2 bg-5 clr-1" value="Update" />
        <input v-else type="button" @click="addTask" class="btn brd-2 bg-5 clr-1" value="Create" />    
    </form>
</template>
<script>
    export default {
        name: 'TaskForm',
        props: {
            task: Object,
            possible_users: Array,
            statuses: Array,
            project: String,
        },
        data() {
            return {
                isAssigned: null,
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
            async addTask() {
                try {
                    const data = {
                        ...this.task,
                        project: this.project,
                        timeline: {
                            assigned: new Date(),
                            due: this.task.due,
                        }
                    }
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }
                    await fetch('http://localhost:8888/tasks', requestOptions)

                    this.$emit('refresh')
                    this.$emit('closeModal')
                    
                } catch (error) {
                    this.handleError()
                }
                

            },
            async updateTask() {
                try {
                    const data = {
                        ...this.task,
                        project: this.task.project._id
                    }

                    const requestOptions = {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }
                    await fetch(`http://localhost:8888/tasks/${this.task._id}`, requestOptions)

                    this.$emit('refresh')
                    this.$emit('closeModal')
                    
                } catch (error) {
                    this.handleError()
                }
            }
        },
        async created() {
            if(this.task.status){
                this.isAssigned = this.task.status === 'assigned' 
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
    .dropdown-container{
        display: flex;
        gap: 15px;
        margin-top: 25px;
    }
    .dropdown{
        display: flex;
        flex-direction: column;
        flex-basis: 20%;
    }
    .dropdown select{
        text-transform: capitalize;
    }
</style>