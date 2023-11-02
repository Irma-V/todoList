<template>
    <section id="homepage">
        <div class="notes-list" v-if="!notesListIsEmpty">
            <ul class="notes-list_wrapper">
                <li v-for="note in notes" :key="note" :id="note.noteId" class="note-item">
                    <div class="note-item_wrapper">
                        <h2 class="note-item__title">
                            {{ note.noteTitle }}
                        </h2>
                        <div class="note-item__options">
                            <ion-icon name="pencil-outline" size="large" @click="editNote(note.noteId)"></ion-icon>
                            <ion-icon name="trash-outline" size="large" @click="delNote(note.noteId)"></ion-icon>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="option__create-note">
                <ion-icon name="document-text-outline" @click="createNote" size="large"></ion-icon>
                <p>create note</p>
            </div>
        </div>

        <div class="start" v-else>
            <div class="start_create-note">
                <ion-icon name="document-text-outline" @click="createNote" size="large"></ion-icon>
                <p>create note</p>
            </div>
        </div>
    </section>
</template>

<script>
// @ is an alias to /src
import router from '@/router';

export default {
    name: 'HomeView',
    components: {
    },
    data() {
        return {
            notesListIsEmpty: true,
            notes: [],
        }
    },
    mounted() {
        this.getNotes()
    },
    methods: {
        createNote() {
            console.log('create a new note');
            router.push({ name: `note` })
        },

        getNotes() {
            let storageNotes = localStorage.getItem('notes')
            if (storageNotes) {
                this.notes = JSON.parse(storageNotes)
                // console.log(this.notes);
                this.notesListIsEmpty = false
            }
            ///
            /* // console.log('перед присвоением: ', this.notes);
            // let currentNotes = JSON.parse(localStorage.getItem('notes'))
            // let currentNote = JSON.parse(localStorage.getItem('note'))

            // if (JSON.parse(localStorage.getItem('notes')) === null) {
            //     localStorage.setItem('notes', JSON.stringify([]))
            //     this.notes = currentNotes
            //     return
            // }
            // if (JSON.parse(localStorage.getItem('note')) === null) {
            //     return
            // }

            // this.notes = currentNotes

            // console.log(this.notes.length === 0);
            // console.log(this.notes[this.notes.length - 1].noteId);

            // if (this.notes.length === 0 || this.notes[this.notes.length - 1].noteId !== currentNote.noteId) {
            //     this.notes.push(currentNote)
            //     localStorage.setItem('notes', JSON.stringify(this.notes))
            // } */
        },
        editNote(id) {
            console.log(`edit note with id ${id}`);
            router.push({ path: `/note/${id}`})

        },
        delNote(id) {
            console.log(`delete note with id ${id}`);
            let idx = this.notes.findIndex(note => note.noteId === id);
            // console.log(this.notes[idx]);

            this.notes.splice(idx, 1)
            localStorage.setItem('notes', JSON.stringify(this.notes))
            this.notes = JSON.parse(localStorage.getItem('notes'))
        },
    }
}
</script>

<style scoped lang="scss">
.notes-list {
    .notes-list_wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .note-item {
            background: lightgray;
            margin: 1% 0;
            padding: 1%;
            width: 50%;

            .note-item_wrapper {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
        }
    }

    .option__create-note {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>