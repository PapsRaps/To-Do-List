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
        if (newName.trim() !== "") {
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
            this.#projectDesc = motivationalQuotes[Math.floor(Math.random() * 6)];
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

    getTasks(){
        return [...this.#tasks];
    }

    updateTask(index, newName, newDesc, newDueDate, newPrio){
        if(index < 0 || index > this.#tasks.length - 1)return;
        this.#tasks[index].taskName = newName;
        this.#tasks[index].taskDesc = newDesc;
        this.#tasks[index].taskDueDate = newDueDate;
        this.#tasks[index].taskPrio = newPrio;
    }

    removeTask(index){
        if(index < 0 || index > this.#tasks.length - 1)return;
        this.#tasks.splice(index,1)
    }

}