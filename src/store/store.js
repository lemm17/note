import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        active: null,
        tasks: [],
    },
    getters: {
        getActive: state => state.active,
        getTasks: state => state.tasks
    },
    actions: {
        loadTasks(context){
            let tasks = [];
            for(let key in localStorage) {
                if (!localStorage.hasOwnProperty(key) || key.substr(0, 4) !== "task") {
                    continue;
                }
                tasks.push(JSON.parse(localStorage.getItem(key)));
            }
            //Сортируем от самой первой до последней по ДАТЕ
            tasks.sort((a, b) => new Date(a.timeCreateUTC) - new Date(b.timeCreateUTC));
            //tasks.sort((a, b) => new Date(b.timeCreateUTC) - new Date(a.timeCreateUTC));
            console.log(tasks);
            context.commit('initTasks', tasks);
        },
        addTask(context, payload){
            let newTask = {
                id: payload.id,
                name: "Новая заметка",
                description: "",
                timeCreateUTC: new Date(new Date().toUTCString())
            };
            localStorage.setItem('task' + payload.id, JSON.stringify(newTask));
            newTask.isNew = true;
            context.commit('addTask', {
                'newTask': newTask,
                'sortmode': payload.sortmode
            });
        },
        changeName(context, payload){
            context.commit('changeName', payload)
            let task = JSON.parse(localStorage.getItem('task' + payload.id));
            task.name = payload.newName;
            localStorage.setItem('task' + payload.id, JSON.stringify(task));
        },
        removeTask(context, id){
            localStorage.removeItem('task' + id);
            context.commit('removeTask', id);
        },
        openTask(context, id){
            context.commit('openTask', id);
        },
        saveText(context, payload){
            let task = JSON.parse(localStorage.getItem('task' + payload.id));
            task.description = payload.newText;
            localStorage.setItem('task' + payload.id, JSON.stringify(task));
        }
    },
    mutations: {
        initTasks(state, payload){
            state.tasks = payload;
        },
        addTask(state, payload){
            if (payload.sortmode) {
                state.tasks.push(payload.newTask);
            }   else {
                state.tasks.unshift(payload.newTask);
            }
        },
        changeName(state, payload){
            state.tasks.find(x => x.id == payload.id).name = payload.newName;
        },
        removeTask(state, id){
            let index = state.tasks.findIndex(x => x.id == id);
            state.tasks.splice(index, 1);
            state.active = null;
        },
        openTask(state, id){
            if (state.active != null){
                let task = JSON.parse(localStorage.getItem('task' + state.active));
                task.description = state.tasks.find(x => x.id == state.active).description;
                localStorage.setItem('task' + state.active, JSON.stringify(task));
            }
            state.active = id;
        }
    }
})

//test