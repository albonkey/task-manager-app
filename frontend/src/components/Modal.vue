<template>
    <div class="modal-container">
        <div class="modal pd-2 brd-1 bg-1">
            <slot></slot>
            <button class="close-modal" @click="closeModal">Close</button>
        </div>
    </div>
</template>

<script>
//<QuizForm v-bind:quiz="quiz" @closeModal="closeModal" @refresh="refresh" />
export default {
    name: 'Modal',
    methods: {
        refresh() {
            this.$emit('refresh')
        },
        closeModal() {
            this.$emit('closeModal')
        }
    }
};
</script>

<style>
.modal-container {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(1px);
}

.modal {
    width: 50rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.close-modal {
    background: #AAA;
    border: 1px solid #999;
    color: #FFF;
    border-radius: 50px;
    cursor: pointer;
    font-size: 12px;
    display: block;
    width: 50px;
    padding: 2px;
    margin: 20px auto;
}

.close-modal:hover {
    background: #555;
}
</style>