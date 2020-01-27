<template>
  <div v-if="active == null" id="openTask" class="work-space__item open-task" :style="{ justifyContent: justifyContent }">
    <div class="active-is-null">
      Выберите заметку
    </div>
  </div>
  <div v-else id="openTask" class="work-space__item open-task" :style="{ justifyContent: justifyContent }">
    <div class="open-task__buttons">
      <button v-if="!editMode" class="btn" @click="editMode = true">
        Редактировать
      </button>
      <button v-else class="btn" @click="editMode = false">
        Сохранить
      </button>
      <button class="btn" @click="removeTask">
        Удалить
      </button>
    </div>
    <div class="open-task__content">
      <div class="open-task__info">
        <h1 class="info-item">
          {{ activeTask.name }}
        </h1>
        <div class="info-item">
          {{ new Date(activeTask.timeCreateUTC).toLocaleString() }}
        </div>
      </div>
      <div class="open-task__description">
        <textarea id="text_area"
          v-model="activeTask.description"
          @click="editMode = true"
          @keydown.escape="editMode = false"
          :class="{ textarea_active: editMode, textarea_disabled: !editMode }"
          :readonly="!editMode"
          placeholder="Введите текст заметки здесь">
        </textarea>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'openTask',
    data() {
      return {
        editMode: false,
        isSave: true
      }      
    },
    computed: {
      ...mapGetters({
        active: 'getActive',
        tasks: 'getTasks'
      }),
      activeTask() {
        if (this.active != null) {
          this.editMode = false;
          return this.tasks.find(x => x.id == this.active);
        }
      },
      justifyContent() {
        return this.active == null ? 'center' : 'start';
      }
    },
    watch: {
      editMode() {
        if (this.editMode) {
          this.isSave = false;
        } else {
          this.saveText();
        }
      },
      activeTask() {
        console.log('active changed');
      }
    },
    methods: {
      saveText() {
        this.$store.dispatch('saveText', {
          'id': this.activeTask.id,
          'newText': this.activeTask.description
        })
        this.isSave = true;
      },
      removeTask() {
        this.$store.dispatch('removeTask', this.active);
      }
    }
  }
</script>

<style lang="scss">
  @import '../colors.scss';
  
  .open-task {
    border: 1px solid $element;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    //justify-content: space-between;
    align-items: center;

    .active-is-null {
      border: 1px solid $background;
      padding: 5px;
      border-radius: 5px;
    }

    .open-task__content {
      padding: 10px;
      width: 100%;
      box-sizing: border-box;
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      & > .open-task__description {
        flex-grow: 1;
      }
    }

    .open-task__buttons, .open-task__info {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .open-task__buttons {
      & > button {
        width: 50%;
      }

      .info-item:first-child {
        font-weight: 900;
      }
    }

    .open-task__info {
      & > h1 {
        margin: 0px;
        width: 56%;
        word-wrap: break-word;
        margin-bottom: 10px;
      }

      & > div {
        width: 40%;
        text-align: right;
      }
    }

    textarea {
      font-family: "Open Sans", sans-serif;
      outline: none;
      resize: none;
      width: 100%;
      overflow: auto;
      transition: 1s;
      font-size: 14px;
      height: 100%;
    }

    .textarea_active {
      border: 1px solid $element;
      padding: 0px;
    }

    .textarea_disabled {
      padding: 1px;
      border: none;
    }
  }
</style>