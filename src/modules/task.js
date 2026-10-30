export default class Task{
    #taskId;
    #taskName;
    #taskDesc;
    #taskDueDate;
    #taskPrio;
    #status;

    constructor(id,name,desc,dueDate,prio){
        this.#taskId = id;
        this.taskName = name;
        this.taskDesc = desc;
        this.taskDueDate = dueDate;
        this.taskPrio = prio;
        this.#status = 'incomplete'
    }

    set taskName(newName) {
        if (typeof newName === "string" && newName.trim() !== "") {
            this.#taskName = newName;
        } else {
            this.#taskName = "Unspecified";
        }
    }

    set taskDesc(newDesc) {
        if (typeof newDesc === "string") {
            this.#taskDesc = newDesc;
        } else {
            this.#taskDesc = "-";
        }
    }

    set taskDueDate(newDueDate){
        if (typeof newDueDate === "string" && newDueDate.trim() !== "") {
            this.#taskDueDate = newDueDate;
        }else{
            this.#taskDueDate = 'No Due Date';
        }
    }

    set taskPrio(newPrio) {
        if (typeof newPrio !== "string") {
            this.#taskPrio = "mid";
            return;
        }

        const priority = newPrio.trim().toLowerCase();

        if (["low", "mid", "high"].includes(priority)) {
            this.#taskPrio = priority;
        } else {
            this.#taskPrio = "mid";
        }
    }

    set status(curStatus){
        this.#status = curStatus;
    }

    get taskName(){
        return this.#taskName;
    }

    get taskDesc(){
        return this.#taskDesc;
    }

    get taskDueDate(){
        return this.#taskDueDate;
    }

    get taskPrio(){
        return this.#taskPrio;
    }

    get taskId(){
        return this.#taskId
    }

    get status(){
        return this.#status
    }

    toggleStatus(){
        if(this.#status === 'incomplete'){
            this.#status = 'complete'
        }else if(this.#status === 'complete'){
            this.#status = 'incomplete'
        }
    }

    toJSON(){
        return{
            'taskId' : this.#taskId,
            'taskName' : this.#taskName,
            'taskDesc' : this.#taskDesc,
            'taskDueDate' : this.#taskDueDate,
            'taskPrio' : this.#taskPrio,
            'status' : this.#status,
        }
    }
}
