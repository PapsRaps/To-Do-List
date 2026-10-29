import "./reset.css";
import "./styles.css";

import { format, parseISO } from 'date-fns';

import Project from './modules/project.js'


const todoList = (()=>{
    let projects = [];
    let currentProjectId = null;

    function createProject(newName, newDesc){
        const id = crypto.randomUUID();
        const project = new Project(id,newName, newDesc)
        projects.push(project);
        currentProjectId = id;
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
    let showTaskStatus = 'all';

    const noProjectsDisplaySidebar = document.getElementById('noProjectsDisplaySidebar');
    const noProjectsDisplayBody = document.getElementById('noProjectsDisplay');

    const sidebarButtons = document.getElementById('sidebarButtons');
    const taskContainerContainer = document.getElementById('taskContainer');
    const addTaskContainer = document.getElementById('addTaskContainer');
    const containerButtons = document.getElementById('containerButtons');

    
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
        sidebarButtons.replaceChildren();

        todoList.getListOfProjects().forEach(project => {
            const button = document.createElement('button');
            button.dataset.projectId = `${project.projectId}`;
            button.innerHTML = `<i class="fa-regular fa-folder-open"></i>`
            button.append(` ` + `${project.projectName}`)
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
        const hasProjects = checkProjectList();

        changeBody(!hasProjects);

        if (hasProjects) {
            changeProjectTitle();
            changeSideBar();
            changeTaskDisplay();
        }
    }

    function checkProjectList(){
        const projectList = todoList.getListOfProjects();
        if (Array.isArray(projectList) && projectList.length === 0){
            return false;
        }
        return true;
    }

    function changeBody(noProjects) {
        if(noProjects){
            projectTitleName.innerText = 'No Project Selected';
            projectTitleDesc.innerText = 'Create a new one from the sidebar or below to get started.'
        }

        const showEmpty = !noProjects

        noProjectsDisplayBody.classList.toggle('is-hidden', showEmpty);
        noProjectsDisplaySidebar.classList.toggle('is-hidden', showEmpty);

        sidebarButtons.classList.toggle('is-hidden', !showEmpty);
        taskContainerContainer.classList.toggle('is-hidden', !showEmpty);
        addTaskContainer.classList.toggle('is-hidden', !showEmpty);
        containerButtons.classList.toggle('is-hidden', !showEmpty);
    }

    function changeProjectTitle(){
        projectTitleName.innerText = todoList.getProject().projectName;
        projectTitleDesc.innerText = todoList.getProject().projectDesc;
    }

    function changeTaskDisplay(){
        taskContainer.replaceChildren();

        let taskList = todoList.getProject().getTasks();
        if(showTaskStatus==='active'){
            taskList = taskList.filter((task)=>task.status === 'incomplete')
        }else if(showTaskStatus==='completed'){
            taskList = taskList.filter((task)=>task.status === 'complete')
        }

        taskList.forEach((task)=>{createTaskCard(task)})
    }

    function createTaskCard(task){
        const taskCard = document.createElement('div');
            taskCard.className = 'taskCards';

            const checkBox = document.createElement('input');
            checkBox.id = task.taskId;
            checkBox.type = 'checkbox'
            checkBox.addEventListener('click',(event)=>toggleStatusTask(event))

            const label = document.createElement('label');
            label.htmlFor = task.taskId;

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

    function changeShowStatus(event){
        const containerButtons = document.querySelectorAll('#containerButtons button');
        Array.from(containerButtons).forEach((button)=>{
            if(button.classList.contains('selected')){
                button.classList.toggle('selected');
            }
            if(button.id === event.currentTarget.id){
                button.classList.toggle('selected');
            }
        });

        if(event.currentTarget.id === 'allButtonContainer'){
            showTaskStatus = 'all'
        }else if(event.currentTarget.id === 'activeButtonContainer'){
            showTaskStatus = 'active'
        }else if(event.currentTarget.id === 'completedButtonContainer'){
            showTaskStatus = 'completed'
        }
        
        changeTaskDisplay();
    }

    function addTask(event){
        event.preventDefault();
        const taskName = document.getElementById('taskTitle').value;
        const taskDescription = document.getElementById('taskDescription').value;
        let taskDueDate = document.getElementById('taskDueDate').value;
        const taskPriority = document.getElementById('taskPriority').value;

        if(taskDueDate !== ''){
            taskDueDate = format(parseISO(taskDueDate), 'MMM d, yyyy');
        };

        todoList.getProject().createTask(taskName,taskDescription,taskDueDate,taskPriority)

        changeTaskDisplay();

        event.target.reset();
    }

    function toggleStatusTask(event){
        todoList.getProject().toggleTaskStatus(event.currentTarget.id);

        changeTaskDisplay();
    }

    function updateTaskStatusDisplay(id){
        const checkBox = document.getElementById(id);
        const taskCard = checkBox.closest('.taskCards');
        const taskName = taskCard.querySelector('.taskName');
        const taskDesc = taskCard.querySelector('.taskDesc');
        const taskDueDate = taskCard.querySelector('.taskDueDate');
        const taskPrio = taskCard.querySelector('.taskPrio');
        
        if(todoList.getProject().getTaskStatus(id) === 'complete'){
            checkBox.checked = true;
            taskName.classList.add('taskDone');
            taskDesc.classList.add('taskDone');
            taskDueDate.classList.add('taskDone');
            taskPrio.classList.add('taskDone');
        }else if(todoList.getProject().getTaskStatus(id) === 'incomplete'){
            checkBox.checked = false;
            taskName.classList.remove('taskDone');
            taskDesc.classList.remove('taskDone');
            taskDueDate.classList.remove('taskDone');
            taskPrio.classList.remove('taskDone');
        }
        
    }

    function deleteTask(event){
        const id = event.currentTarget.closest('.taskCards').querySelector('input[type="checkbox"]').id
        todoList.getProject().removeTask(id);

        changeTaskDisplay();
    }

    return{
        openNewProjectModal,
        closeNewProjectModal,
        createNewProject,
        changeWholeScreen,
        addTask,
        changeShowStatus,
    }

})();

(()=>{
    const newProjectButtons = document.querySelectorAll('#newProjectButton');
    Array.from(newProjectButtons).forEach(button=>button.addEventListener('click',domController.openNewProjectModal));

    const cancelNewProject = document.getElementById('cancelNewProject');
    cancelNewProject.addEventListener('click',domController.closeNewProjectModal)

    const newProjectForm = document.getElementById('newProjectForm');
    newProjectForm.addEventListener('submit',(event)=>domController.createNewProject(event))

    const addTaskForm = document.getElementById('addTaskForm');
    addTaskForm.addEventListener('submit',(event)=>domController.addTask(event))

    const allButtonContainer = document.getElementById('allButtonContainer');
    const activeButtonContainer = document.getElementById('activeButtonContainer');
    const completedButtonContainer = document.getElementById('completedButtonContainer');
    allButtonContainer.addEventListener('click',(event)=>domController.changeShowStatus(event));
    activeButtonContainer.addEventListener('click',(event)=>domController.changeShowStatus(event));
    completedButtonContainer.addEventListener('click',(event)=>domController.changeShowStatus(event));

})()

domController.changeWholeScreen();