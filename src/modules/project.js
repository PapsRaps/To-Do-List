import Task from './task.js'

export default class Project{
    #projectId;
    #projectName;
    #projectDesc;
    #tasks;

    constructor(id,name,desc){
        this.#projectId = id;
        this.projectName = name;
        this.projectDesc = desc;
        this.#tasks = [];
    }

    set projectName(newName){
        if (typeof newName === "string" && newName.trim() !== "") {
            this.#projectName = newName;
        }else{
            this.#projectName = 'Unspecified';
        }
    }

    set projectDesc(newDesc){
        if (newDesc.trim() === ""){
            const motivationalQuotes = [
                `You don't have to be great to start, but you have to start to be great.`,
                `Dream big. Start small. Act now.`,
                `Trust the timing of your journey.`,
                `Stop wishing for it. Start working for it.`,
                `Less talk. More action.`,
                `Small progress is still progress. Keep going.`
            ]
            this.#projectDesc = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        }else{
            this.#projectDesc = newDesc;
        }
    }

    get projectName(){
        return this.#projectName;
    }

    get projectDesc(){
        return this.#projectDesc;
    }

    get projectId(){
        return this.#projectId;
    }

    createTask(newName, newDesc, newDueDate, newPrio){
        const id = crypto.randomUUID();
        const task = new Task(id,newName,newDesc,newDueDate,newPrio)
        this.#tasks.push(task)
    }

    loadTask(taskId,taskName, taskDesc, taskDueDate, taskPrio, taskStatus){
        const task = new Task(taskId,taskName, taskDesc, taskDueDate, taskPrio)
        task.status = taskStatus;
        this.#tasks.push(task)
    }

    getTasks(){
        return [...this.#tasks];
    }

    getTaskIndex(taskId) {
        return this.#tasks.findIndex(task => task.taskId === taskId);
    }

    updateTask(taskId, newName, newDesc, newDueDate, newPrio) {
        const index = this.getTaskIndex(taskId);

        if (index === -1) return;

        this.#tasks[index].taskName = newName;
        this.#tasks[index].taskDesc = newDesc;
        this.#tasks[index].taskDueDate = newDueDate;
        this.#tasks[index].taskPrio = newPrio;
    }

    removeTask(taskId) {
        const index = this.getTaskIndex(taskId);

        if (index === -1) return;

        this.#tasks.splice(index, 1);
    }

    getTaskStatus(taskId){
        const index = this.getTaskIndex(taskId);

        if (index === -1) return null;

        return this.#tasks[index].status;
    }

    toggleTaskStatus(taskId){
        const index = this.getTaskIndex(taskId);

        if (index === -1) return;

        this.#tasks[index].toggleStatus();
    }

    toJSON(){
        return{
            'projectId' : this.#projectId,
            'projectName' : this.#projectName,
            'projectDesc' : this.#projectDesc,
            'tasks' : this.#tasks,
        }
    }
}