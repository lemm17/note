<template>
  <div v-if="!searchMood" id="taskList" class="task-list" :style="{ height: taskListHeight }">
    <task v-for="task in tasks" :key="task.id" :task="task"></task>
  </div>
  <div v-else id="taskList" class="task-list" :style="{ height: taskListHeight }">
    <task @name-changed="checkRenamedTasks" v-for="task in searchedTasks" :key="task.id" :task="task"></task>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Task from './Task'

  export default {
    name: 'taskList',
    data() {
      return {
        tasks: [],
        searchedTasks: [],
        nextId: null,
        sortmode: true,
        searchMood: false,
        searchStrLen: 0,
        searchStr: '',
        taskListHeight: window.innerHeight - 140 + "px"
      }
    },
    computed: {
      ...mapGetters({
        getTasks: 'getTasks'
      })
    },
    watch: {
      tasks() {
        //console.log("-------------------------");
        //Наименьший свободный id
        let busyId = this.tasks.map(task => task.id).sort((a, b) => a - b);
        //console.log(busyId);
        let freeId = 0;
        for (let id of busyId){
          if (freeId != id){
            break;
          } else {
            freeId++;
          }
        }
        console.log("Значение nextId изменено c " + this.nextId + " на " + freeId);
        this.nextId = freeId;
        //console.log("-------------------------");
      }
    },
    methods: {
      addTask() {
        this.$store.dispatch('addTask', {
          'id': this.nextId,
          'sortmode': this.sortmode
        });
        this.$emit('addTask');
      },
      changeSortMode(){
        this.sortmode = !this.sortmode;
        this.tasks = this.tasks.reverse();
        this.searchedTasks = this.searchedTasks.reverse();
      },
      search(searchSubstr) {
        searchSubstr = searchSubstr.toLowerCase();
        if (searchSubstr){
          this.searchMood = true;
          let self = this;
          //Если удалили букву или только начали поиск
          if (searchSubstr.length < this.searchStr.length || this.searchStr.length == 0){
            this.tasks.forEach(function(task){
              if (task.name.toLowerCase().indexOf(searchSubstr) != -1 && !self.searchedTasks.find(x => x == task)){
                self.searchedTasks.push(task);
              }
            });
          // иначе - ввели букву
          } else {
            let indexesToRemove = [];
            this.searchedTasks.forEach(function(task, index){
              if (task.name.toLowerCase().indexOf(searchSubstr) == -1){
                indexesToRemove.push(index);
              }
            });
            for (let index of indexesToRemove.reverse()){
              self.searchedTasks.splice(index, 1);
            }
          }
        } else {
          this.searchMood = false;
          this.searchedTasks = [];
        }
        this.searchStr = searchSubstr;
      },
      checkRenamedTasks(newName){
        if (this.searchMood && newName.indexOf(this.searchStr) == -1){
          this.searchedTasks.splice(this.searchedTasks.findIndex(x => x.name == newName), 1);
        }
      }
    },
    components: {
      Task
    },
    created() {
      this.tasks = this.getTasks;
      this.$parent.$on('addTask', this.addTask);
      this.$parent.$on('sortModeChanged', this.changeSortMode);
      this.$parent.$on('search', this.search);
    }
  }
</script>

<style lang="scss">
  @import '../colors.scss';

  .task-list {
    //height: 499px;
    overflow: hidden;
    overflow-Y: scroll;
  }
</style>