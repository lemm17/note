<template>
  <div id="task" @click="openTask" class="task-list__item" @mouseenter="mouseOnPen = true" @mouseleave="mouseOnPen = false">
    <div class="task-name">
      <div :class="{disabled: editMode}" class="task-name__menu">
        <span @click="openTask">{{ task.name }}</span>
        <i class="fas fa-pencil-alt" :class="{showPen: mouseOnPen, visible: !opacity}" @click.stop="rename"></i>
        <i class="fas fa-trash-alt" :class="{showPen: mouseOnPen, visible: !opacity}" @click.stop="removeTask"></i>
      </div>
      <input class="task-name__input inp" 
      v-model="newName"
      placeholder="Имя заметки"
      v-focus
      :class="{active: editMode}" 
      type="text" 
      @keydown.enter.prevent="accept"
      @keydown.escape="editMode = false">
      <div class="choise-buttons" :class="{disabled: !editMode}">
        <i class="fas fa-check" @click.stop="accept"></i>
        <i class="fas fa-times" @click.stop="cancel"></i>
      </div>
      <span :class="{active: hintActive}" class="task-name__hint">
        Имя недопустимого размера
      </span>
    </div>
    <div class="task-description">{{ description }}</div>
  </div>
</template>

<script>
  import Store from '../store/store.js'

  export default {
    name: 'task',
    props: [
      'task'
    ],
    data() {
      return {
        mouseOnPen: false,
        editMode: false,
        newName: '',
        opacity: true,
        hintActive: false,
        timeCreate: new Date(this.task.timeCreateUTC).toLocaleString()
      }
    },
    computed: {
      description(){
        return this.task.description.length > 50 ? this.task.description.substr(0, 50) + "..." : this.task.description;
      }
    },
    watch: {
      mouseOnPen() {
        let self = this;
        setTimeout(function() {
          self.opacity = !self.opacity;
        }, 0);
      },
      newName() {
        this.newName = (this.newName === undefined ? '' : this.newName);
        if (this.newName.length == 0 && this.editMode || this.newName.length > 80){
          this.hintActive = true;
        } else {
          this.hintActive = false;
        }
      }
    },
    methods: {
      rename() {
        this.editMode = !this.editMode;
        this.newName = this.title;
      },
      accept() {
        //Если имя было изменено
        if (this.newName.length > 0 && this.newName.length <= 80) {
          if (this.task.name !== this.newName) {
            this.$emit('name-changed', this.newName);
            Store.changeName({
              'id': this.task.id,
              'newName': this.newName
            })
            this.hintActive = false;
          }

          this.editMode = false;
          this.newName = '';
        }
      },
      cancel() {
        this.editMode = false;
        this.newName = '';
        this.hintActive = false;
      },
      removeTask() {
        Store.removeTask(this.task.id);
      },
      openTask() {
        if (!this.editMode)
          Store.openTask(this.task.id);
      }
    },
    directives: {
      focus: {
        // определение директивы
        inserted: function (el) {
          el.focus()
        }
      }
    },
    created() {
      let self = this;
      this.$parent.$on('addTask', function() {
        self.cancel();
      })
      if (this.task.isNew){
        this.editMode = true;
        this.hintActive = true;
        Store.openTask(this.task.id);
        delete this.task.isNew;
      }
    }
  }
</script>

<style lang="scss">
  @import '../colors.scss';

  .task-list__item {
    border: 1px solid $element;
    width: 100%;
    margin: 0px auto;
    padding: 10px 0px;
    background-color: $background;
    color: $microColor;
  }

  .task-description {
    font-size: 12px;
    padding: 5px;
    word-wrap: break-word;
    color: $element;
  }

  .task-name {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .task-name__hint {
      color: red !important;
      font-size: 12px;
      display: none;
    }

    & > .task-name__menu > i {
      opacity: 0;
      display: none;
      cursor: pointer;
    }

    .choise-buttons {
      position: relative;
      height: 20px;
      width: 15%;
      margin-left: 2%;

      & > i {
        position: absolute;

        &:first-child {
          left: 0px;
        }

        &:last-child {
          left: 25px;
        }
      }

      & > i:hover {
        cursor: pointer;
        //transition: all 0.05s ease;
      }
    }

    .task-name__input {
      display: none;
      width: 65%;
      padding: 6px;
    }
    
    .fas {
      color: $microColor;
    }

    & > div {
      width: 100%;

      & > span {
        width: 100%;
        word-break: break-word;
      }
    }

    span {
      background: none !important;
    }
  }

  .showPen {
    display: inline !important;
    //opacity: 100 !important;
  }
  
</style>