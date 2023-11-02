<template>
    <div class="note-editor">
        <h1>This is an Note Editor page</h1>
        <!-- Edit note with id {{ $route.params.id }} -->
        <!-- <a href="http://localhost:8080/">home </a> -->
        <div class="note-editor_options">
            <div class="undo">
                <ion-icon name="arrow-undo-sharp" size="large" @click="undo()" v-if="undoState"></ion-icon>
                <ion-icon name="arrow-undo-outline" size="large" v-else></ion-icon>
            </div>
            <div class="redo">
                <ion-icon name="arrow-redo-sharp" size="large" @click="redo()" v-if="redoState"></ion-icon>
                <ion-icon name="arrow-redo-outline" size="large" v-else></ion-icon>
            </div>

        </div>
        <input id="noteTitle" type="text" placeholder="Enter a title" v-model="noteTitle" @keydown.enter="saveNote()">
        <div class="todo-list_wrapper">

            <ul class="todo-list_body">
                <ion-icon name="add-circle-outline" size="large" @click="addNewTodo"></ion-icon>
                <TodoItem v-for="todoItem in todoList" :key="todoItem" :id="todoItem.id" :todoTitle="todoItem.todoTitle"
                    @refresh="refresh" @delTodo="delTodo(todoItem.id)" />
                <ion-icon name="save-outline" size="large" @click="saveAll()"></ion-icon>
            </ul>
        </div>
    </div>
</template>

<script>

import { uniqueID } from "@/assets/JS/methods";
import TodoItem from "@/components/TodoItem.vue";
import router from '@/router';

export default {
    name: "NoteEditor",
    components: {
        TodoItem
    },
    props: {},
    data() {
        return {
            noteTitle: '',
            todoTitle: '',

            todoList: [],
            notes: [],
            newNote: {},

            states: [],
            state: {},
            stateId: 0,

            undoState: false,
            redoState: false,

        }
    },
    computed: {
    },

    created() {
        // sessionStorage.setItem('test', 0)
        // console.log('thoose data are containing in session storage: ' + sessionStorage.getItem('test'))

        if (localStorage.getItem('notes') === null) {
            localStorage.setItem('notes', JSON.stringify([]))
        }

        if (this.$route.params.id) {
            this.notes = JSON.parse(localStorage.getItem('notes'))
            let idx = this.notes.findIndex(note => note.noteId === this.$route.params.id);

            this.noteTitle = this.notes[idx].noteTitle
            this.todoList = this.notes[idx].todoList.map((todoItem) => {
                let item = {}
                item.id = todoItem.id
                item.todoTitle = todoItem.todoTitle
                return item
            })

            // console.log(this.notes[idx]);
            localStorage.setItem('note', JSON.stringify(this.notes[idx]))
        }

        this.notes = JSON.parse(localStorage.getItem('notes'))
        this.saveState()
    },

    methods: {
        addNewTodo() {
            console.log('add todo');
            let newTodo = {
                id: uniqueID(15),
                todoTitle: '',
            }
            this.todoList.push(newTodo)
            console.log(this.todoList);

        },

        delTodo(id) {
            console.log(`delete todo with id ${id}`);
            // console.log(document.getElementById(`${(id)}`));
            let idx = this.todoList.findIndex(todoItem => todoItem.id === id);
            this.todoList.splice(idx, 1)
            return this.todoList
        },

        saveNote() {
            console.log('Save a new note');
            if (!this.$route.params.id) {
                this.newNote = {
                    noteId: uniqueID(30),
                    noteTitle: this.noteTitle,
                    todoList: this.todoList,
                }
            } else {
                this.newNote = {
                    noteId: this.$route.params.id,
                    noteTitle: this.noteTitle,
                    todoList: this.todoList,
                }
            }
            localStorage.setItem('note', JSON.stringify(this.newNote))
            // console.log(JSON.parse(localStorage.getItem('note')));
            // return this.notes
        },

        /* Обновление текущей Note */
        refresh(todoItem) {
            let id = todoItem.id
            console.log(`refresh todo with id ${id}`);
            this.todoTitle = todoItem.todoTitle
            let idx = this.todoList.findIndex(todoItem => todoItem.id === id);
            this.todoList[idx].todoTitle = this.todoTitle

            /* // Отключено. Перенесено в TodoItem.vue 

            // this.isOpen = false
            // this.todoList[idx].editorState = {
            //     editorIsOpen: this.isOpen,
            //     iconName: 'pencil-outline'
            // }
            */
            this.saveNote()
        },

        /* Принятие всех изменений в Note, перезапись Notes*/
        saveAll() {
            
            this.saveNote()

            if (!this.$route.params.id) {
                this.notes.push(this.newNote)
            } else {
                let idx = this.notes.findIndex(note => note.noteId === this.$route.params.id);
                if (this.newNote.noteId === this.notes[idx].noteId) {
                    this.notes[idx].noteTitle = this.newNote.noteTitle
                    this.notes[idx].todoList = this.newNote.todoList
                }
            }
            console.log(this.notes);

            localStorage.setItem('notes', JSON.stringify(this.notes))
            router.push({ name: `home` })
        },

        /* Сохранение состояний изменения Note */
        saveState() {
            let stateId = this.stateId
            // хранение 5ти записей
            if (this.states.length >= 5) {
                this.states.shift()
                this.states.push({
                    stateId: stateId,
                    stateNote: JSON.parse(localStorage.getItem('note')),
                })
            } else {
                this.states.push({
                    stateId: stateId,
                    stateNote: JSON.parse(localStorage.getItem('note')),
                })
            }
            // инкремент id
            this.stateId++
            this.state = this.states.at(-1)
            console.log('states: ', this.states);
            console.log('state: ', this.state);
        },

        setActualState(){
            this.noteTitle = this.state.stateNote.noteTitle
            this.todoList = this.state.stateNote.todoList

            let actualState = {
                noteId: this.state.stateNote.noteId,
                noteTitle: this.noteTitle,
                todoList: this.todoList,
            }
            localStorage.setItem('note', JSON.stringify(actualState))
        },

        undo() {
            let idx = this.states.findIndex(stateItem => stateItem.stateId === this.state.stateId - 1);

            if (!this.states.length || idx === 0) {
                this.undoState = false
                this.redoState = false                
                // return
            }
            this.redoState = true
            this.state = this.states[idx]
            console.log(this.state);
            this.setActualState()            
        },

        redo() { 
            let idx = this.states.findIndex(stateItem => stateItem.stateId === this.state.stateId + 1);

            if (!this.states.length || idx === 0 || this.states.length === idx+1) {
                this.undoState = false
                this.redoState = false                
                // return
            }
            this.undoState = true
            this.state = this.states[idx]
            console.log(this.state);
            this.setActualState()
            console.log('state');
        },
    },
    watch: {
        newNote() {
            // console.log('данные сменились: ', JSON.parse(localStorage.getItem('note')) );
            this.saveState()
            this.undoState = true
        }
    }
}
</script>

<style scoped lang="scss">
.note-editor {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .note-editor_options {
        display: flex;
        flex-direction: row;
        justify-content: center;

    }

    #noteTitle {
        width: 50%;
        place-self: center;
    }

    .todo-list_wrapper {
        .todo-list_body {
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
            }
        }
    }
}
</style>