<template>
  <div id="taskMenu" class="work-space__item task-menu">
    <input type="button" value="Добавить заметку" class="task-menu__item btn" @click="addTask">
    <input v-focus type="text" class="task-menu__item inp" placeholder="Искать.." v-model="searchSubstr">
    <div class="task-menu__item">
      <div>Сортировать по 
        <span v-if="sortmode" @click="changeSortMode">
          возрастанию даты ᐱ
        </span>
        <span v-else @click="changeSortMode">
          убыванию даты ᐯ
        </span>
      </div>
    </div>
    <task-list class="task-menu__item"></task-list>
  </div>
</template>

<script>
  import TaskList from './TaskList'

  export default {
    name: 'taskMenu',
    data() {
      return {
        sortmode: true,
        searchSubstr: ''
      }
    },
    methods: {
      changeSortMode() {
        this.sortmode = !this.sortmode;
        this.$emit('sortModeChanged');
      },
      addTask() {
        this.searchSubstr = "";
        this.$emit('addTask');
      }
    },
    watch: {
      searchSubstr() {
        this.$emit('search', this.searchSubstr);
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
    components: {
      TaskList
    }
  }
</script>

<style lang="scss">
  @import '../colors.scss';

  .task-menu {
    //border: 1px solid red;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    
    .task-menu__item {
      width: 70%;
      margin-bottom: 5px;
      text-align: center;

      & > ul {
        margin: 0;
        padding: 0;
      }

      & li {
        list-style-type: none;
      }

      span:hover {
        cursor: pointer;
      }

      span {
        padding: 2px;
        border-radius: 5px;
        background-color: $background;
        color: $element;
      }
    }

  }

</style>