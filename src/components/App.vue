<template>
  <div id="app" class="work-space">
    <task-menu></task-menu>
    <open-task></open-task>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import TaskMenu from './TaskMenu'
  import OpenTask from './OpenTask'
  import Store from '../store/store.js'

  export default {
    name: 'app',
    data () {
      return {
        
      }
    },
    components: {
      TaskMenu,
      OpenTask
    },
    created() {
      Store.loadTasks();
    }
  }
</script>

<style lang="scss">
  @import '../colors.scss';

  * {
    transition: all 0.5s ease;
  }

  body {
    margin: 0px;
    padding: 0px;
    font-family: 'Open Sans', sans-serif;
    overflow: hidden;
  }

  .btn {
    padding: 10px 0px;
    background-color: $element;
    border: none;
    color: $background;
  }

  .btn:focus, .inp:focus {
    outline: none;
  }
  
  .btn:hover {
    -webkit-box-shadow: inset 0px 0px 19px 3px rgba(0,0,0,0.75);
    -moz-box-shadow: inset 0px 0px 19px 3px rgba(0,0,0,0.75);
    box-shadow: inset 0px 0px 19px 3px rgba(0,0,0,0.25);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .btn:active {
    -webkit-box-shadow: inset 0px 0px 19px 3px rgba(0,0,0,0.75);
    -moz-box-shadow: inset 0px 0px 19px 3px rgba(0,0,0,0.75);
    box-shadow: inset 0px 0px 19px 3px rgba(0,0,0,0.5);
    transition: all 0.3s ease;
  }
  
  .inp {
    padding: 10px 0px;
  }

  .work-space {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;

    .work-space__item {
      width: 35%;

      &:last-child {
        width: 65%;
      }
    }
  }

  .visible {
    opacity: 100 !important;
  }

  .active {
    display: block !important;
  }
  
  .disabled {
    display: none !important;
  }
</style>
