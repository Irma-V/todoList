<template>
    <li class="todo-item" :id="id">
        <div class="todo-item_wrapper">
            <input type="checkbox">
            <div class="todo-item__title">
                <label v-show="!todoTitleState.editorIsOpen">
                    {{ todoTitle }}
                </label>
                <input v-show="todoTitleState.editorIsOpen" :id="`field_${id}`" type="text" @keydown.enter="refresh(id)"
                    v-model="newTodoTitle"/>
            </div>
            <div class="todo-item__options">
                <ion-icon v-if="todoTitleState.editorIsOpen" name="checkmark-done-outline" size="large"
                    @click="refresh()"></ion-icon>
                <ion-icon v-else :isOpen="todoTitleState.editorIsOpen" :name="'pencil-outline'" size="large"
                    @click="editTodo()"></ion-icon>
                <ion-icon name="trash-outline" size="large" @click="this.$emit('delTodo')"></ion-icon>
            </div>
        </div>
    </li>
</template>

<script>
export default {
    name: "TodoItem",
    components: {},
    props: {
        id: {
            type: String,
        },
        todoTitle: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            todoTitleState: {
                editorIsOpen: false,
                // iconName: 'pencil-outline'
            },
            newTodoTitle: '',
        }
    },
    methods: {
        editTodo(){
            this.isOpen = !this.isOpen
            this.todoTitleState = {
                editorIsOpen: this.isOpen,
                // iconName: this.isOpen === true ? 'checkmark-done-outline' : 'pencil-outline'
            }
            console.log(this.todoTitleState);
            this.newTodoTitle = this.todoTitle
        },

        refresh() {
            console.log(this.newTodoTitle);
            this.$emit('refresh', {
                id: this.id,
                todoTitle: this.newTodoTitle
            })
            this.isOpen = false
            this.todoTitleState = {
                editorIsOpen: this.isOpen,
                // iconName: 'pencil-outline'
            }
        },

    }
}
</script>

<style scoped lang="scss">
.todo-item {
    margin: 1% 0;

    .todo-item_wrapper {
        padding: 1%;
        display: flex;
        flex-direction: row;
        background: lightgray;
        align-items: center;
        justify-content: space-between;

        .todo-item__title {
            height: 1.5rem;
        }

        .todo-item__options {
            flex-basis: 10%;
            display: flex;
            justify-content: space-between;
        }
    }
}</style>