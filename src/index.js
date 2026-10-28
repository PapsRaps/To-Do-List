import "./reset.css";
import "./styles.css";

import {format} from 'date-fns';

import Project from './modules/project.js'


const todoList = (()=>{
    let projects = [];
    let currentProjectId = null;

    function createProject(newName, newDesc){
        const id = crypto.randomUUID();
        const project = new Project(id,newName, newDesc)
        projects.push(project)
    }

    function setCurrentProject(id){
        currentProjectId = id;
    }

    function getProject(){
        return projects.find(project => project.projectId === currentProjectId)
    }

    function getListOfProjects(){
        return [...projects];
    }

    // function updateProjects(listOfProjects){
    //     projects = listOfProjects;
    // }

    return{
        createProject,
        setCurrentProject,
        getProject,
        getListOfProjects,
        // updateProjects,
    }
})();




const domController = (()=>{
    const modal = document.getElementById('newProjectModal');
    const projectTitleName = document.getElementById('projectTitleName');
    const projectTitleDesc = document.querySelector('#titleContainer p');
    const taskContainer = document.getElementById('tasks');
    
    function openNewProjectModal(){
        modal.showModal();
    }

    function closeNewProjectModal(){
        modal.close();
    }

    function createNewProject(event){
        event.preventDefault();

        const newName = document.getElementById('projectName').value;
        const newDesc = document.getElementById('projectDesc').value;
        
        todoList.createProject(newName, newDesc);
        changeWholeScreen();

        modal.close();
        event.target.reset();
    }

    function changeSideBar(){
        const sidebarButtons = document.getElementById('sidebarButtons')
        sidebarButtons.replaceChildren();

        todoList.getListOfProjects().forEach(project => {
            const button = document.createElement('button');
            button.dataset.projectId = `${project.projectId}`;
            button.innerHTML = `<i class="fa-regular fa-folder-open"></i>${project.projectName}`
            button.addEventListener('click',(event)=>changeProject(event))

            sidebarButtons.appendChild(button)
        });
        changeSelectedProject();
    }

    function changeProject(event){
        const projectId = event.currentTarget.dataset.projectId;
        todoList.setCurrentProject(projectId);

        changeWholeScreen();
    }

    function changeWholeScreen(){
        changeTaskDisplay();
        changeSideBar();
    }

    function changeTaskDisplay(){
        projectTitleName.innerText = todoList.getProject().projectName;
        projectTitleDesc.innerText = todoList.getProject().projectDesc;
        taskContainer.replaceChildren();

        const taskList = todoList.getProject().getTasks();
        taskList.forEach((task)=>{
            const taskCard = document.createElement('div');
            taskCard.className = 'taskCards';

            const checkBox = document.createElement('input');
            checkBox.id = task.taskId;
            checkBox.type = 'checkbox'
            checkBox.addEventListener('click',(event)=>toggleStatusTask(event))

            const label = document.createElement('label');
            label.htmlFor = task.taskId;
            checkBox.appendChild(label);

            const taskName = document.createElement('div');
            const taskDesc = document.createElement('div');
            taskName.className = 'taskName';
            taskDesc.className = 'taskDesc';
            taskName.innerText = `${task.taskName}`;
            taskDesc.innerText = `${task.taskDesc}`;
            label.appendChild(taskName);
            label.appendChild(taskDesc);

            const taskDueDate = document.createElement('div');
            taskDueDate.className = 'taskDueDate';
            taskDueDate.innerHTML = `<i class="fa-regular fa-calendar"></i>`
            taskDueDate.append(` ` + task.taskDueDate)

            const prioContainer = document.createElement('div');
            const taskPrio = document.createElement('div');
            prioContainer.className = 'prioContainer';
            taskPrio.className = `taskPrio ${task.taskPrio}`;
            taskPrio.innerText = `${task.taskPrio.charAt(0).toUpperCase() + task.taskPrio.slice(1)}`;
            prioContainer.appendChild(taskPrio);

            const deleteIcon = document.createElement('div');
            deleteIcon.className = 'deleteTask';
            deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
            deleteIcon.addEventListener('click',(event)=>deleteTask(event))

            taskCard.append(checkBox, label, taskDueDate, prioContainer, deleteIcon);

            taskContainer.appendChild(taskCard);

            updateTaskStatusDisplay(task.taskId)
        })
    }

    function changeSelectedProject(){
        const sidebarButtons = document.querySelectorAll('#sidebarButtons button');
        Array.from(sidebarButtons).forEach((button)=>{
            if(button.classList.contains('selected')){
                button.classList.toggle('selected');
            }
            if(button.dataset.projectId === todoList.getProject().projectId){
                button.classList.toggle('selected');
            }
        })
    }

    function addTask(event){
        event.preventDefault();
        const taskName = document.getElementById('taskTitle').value;
        const taskDescription = document.getElementById('taskDescription').value;
        let taskDueDate = document.getElementById('taskDueDate').value;
        const taskPriority = document.getElementById('taskPriority').value;

        if(taskDueDate !== ''){
            taskDueDate = format(taskDueDate, `MMM d, yyyy`)
        };

        todoList.getProject().createTask(taskName,taskDescription,taskDueDate,taskPriority)

        changeTaskDisplay();

        event.target.reset();
    }

    function toggleStatusTask(event){
        const taskIndex = todoList.getProject().getTaskIndex(event.currentTarget.id);
        todoList.getProject().getTasks()[taskIndex].toggleStatus();

        updateTaskStatusDisplay(event.currentTarget.id)
        console.log(todoList.getProject().getTasks()[taskIndex].status)
    }

    function updateTaskStatusDisplay(id){
        const checkBox = document.getElementById(id);
        const taskName = checkBox.nextElementSibling.firstElementChild;
        const taskDesc = checkBox.nextElementSibling.lastElementChild;
        const taskDueDate = checkBox.nextElementSibling.nextElementSibling;
        const taskPrio = checkBox.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild;
        const currentTaskIndex = todoList.getProject().getTaskIndex(id);
        
        if(todoList.getProject().getTasks()[currentTaskIndex].status === 'complete'){
            checkBox.checked = true;
            taskName.classList.add('taskDone');
            taskDesc.classList.add('taskDone');
            taskDueDate.classList.add('taskDone');
            taskPrio.classList.add('taskDone');
        }else if(todoList.getProject().getTasks()[currentTaskIndex].status === 'incomplete'){
            checkBox.checked = false;
            taskName.classList.remove('taskDone');
            taskDesc.classList.remove('taskDone');
            taskDueDate.classList.remove('taskDone');
            taskPrio.classList.remove('taskDone');
        }
        
    }

    function deleteTask(event){
        const id = event.currentTarget.parentElement.firstElementChild.id
        todoList.getProject().removeTask(id);

        changeTaskDisplay();
    }

    return{
        openNewProjectModal,
        closeNewProjectModal,
        createNewProject,
        changeWholeScreen,
        addTask,
    }

})();

(()=>{
    const newProjectButton = document.getElementById('newProjectButton');
    newProjectButton.addEventListener('click',domController.openNewProjectModal);

    const cancelNewProject = document.getElementById('cancelNewProject');
    cancelNewProject.addEventListener('click',domController.closeNewProjectModal)

    const newProjectForm = document.getElementById('newProjectForm');
    newProjectForm.addEventListener('submit',(event)=>domController.createNewProject(event))

    const addTaskForm = document.getElementById('addTaskForm');
    addTaskForm.addEventListener('submit',(event)=>domController.addTask(event))

})()



todoList.createProject('Personal','');
todoList.setCurrentProject(todoList.getListOfProjects()[0].projectId)
todoList.getProject().createTask('Eat','Eat some foods', 'Oct 29, 2026', 'mid')
todoList.getProject().createTask('Clean my room','Organize my desk and bed', 'Oct 30, 2026', 'low')
todoList.createProject('Study','');

domController.changeWholeScreen();