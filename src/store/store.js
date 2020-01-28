import Vue from 'vue'

export default new Vue({
    data: {
        active: null,
        tasks: [],
    },
    methods: {
        loadTasks() {
            let tasks = [];
            for(let key in localStorage) {
                if (!localStorage.hasOwnProperty(key) || key.substr(0, 4) !== "task") {
                    continue;
                }
                tasks.push(JSON.parse(localStorage.getItem(key)));
            }
            //Сортируем от самой первой до последней по ДАТЕ
            tasks.sort((a, b) => new Date(a.timeCreateUTC) - new Date(b.timeCreateUTC));
            console.log(tasks);
            this.tasks = tasks;
        },
        addTask(payload){
            let newTask = {
                id: payload.id,
                name: "Новая заметка",
                description: "",
                timeCreateUTC: new Date(new Date().toUTCString())
            };
            localStorage.setItem('task' + payload.id, JSON.stringify(newTask));
            newTask.isNew = true;
            if (payload.sortmode) {
                this.tasks.push(newTask);
            }   else {
                this.tasks.unshift(newTask);
            }
        },
        changeName(payload){
            this.tasks.find(x => x.id == payload.id).name = payload.newName;
            let task = JSON.parse(localStorage.getItem('task' + payload.id));
            task.name = payload.newName;
            localStorage.setItem('task' + payload.id, JSON.stringify(task));
        },
        removeTask(id){
            localStorage.removeItem('task' + id);
            let index = this.tasks.findIndex(x => x.id == id);
            this.tasks.splice(index, 1);
            this.active = null;
        },
        openTask(id){
            if (this.active != null){
                let task = JSON.parse(localStorage.getItem('task' + this.active));
                task.description = this.tasks.find(x => x.id == this.active).description;
                localStorage.setItem('task' + this.active, JSON.stringify(task));
            }
            this.active = id;
        },
        saveText(payload){
            let task = JSON.parse(localStorage.getItem('task' + payload.id));
            task.description = payload.newText;
            localStorage.setItem('task' + payload.id, JSON.stringify(task));
        }
    }
});