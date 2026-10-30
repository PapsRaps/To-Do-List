import todoList from './todolist.js'

import { format, parseISO } from 'date-fns';

const domController = (()=>{
    const addProjectModal = document.getElementById('newProjectModal');
    const editProjectModal = document.getElementById('editProjectModal');
    const deleteProjectModal = document.getElementById('deleteProjectModal');
    let editingProjectId = null;

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
        addProjectModal.showModal();
    }

    function openEditProjectModal(projectId){
        editingProjectId = projectId;

        const projectValues = todoList.getProjectNameAndDesc(projectId)

        document.getElementById('projectNewName').value = projectValues[0]
        document.getElementById('projectNewDesc').value = projectValues[1]

        editProjectModal.showModal();
    }

    function openDeleteProjectModal(projectId){
        editingProjectId = projectId;

        const projectValues = todoList.getProjectNameAndDesc(projectId)

        document.getElementById('deleteModalProjectName').innerText = `${projectValues[0]}`

        deleteProjectModal.showModal();
    }

    function closeModal(event){
        const currentModal = event.currentTarget.closest('dialog');
        currentModal.close();
        editingProjectId = null;

        if(currentModal.querySelector('form') !== null)currentModal.querySelector('form').reset();
    }

    function createNewProject(event){
        event.preventDefault();

        const newName = document.getElementById('projectName').value;
        const newDesc = document.getElementById('projectDesc').value;
        
        todoList.createProject(newName, newDesc);


        changeWholeScreen();

        addProjectModal.close();
        event.target.reset();
    }

    function editProject(event){
        event.preventDefault();

        const newName = document.getElementById('projectNewName').value;
        const newDesc = document.getElementById('projectNewDesc').value;

        todoList.updateProject(editingProjectId,newName,newDesc);

        changeWholeScreen();

        editingProjectId = null;
        editProjectModal.close();
        event.target.reset();
    }

    function deleteProject(event){
        event.preventDefault();

        todoList.removeProject(editingProjectId);
        todoList.protectCurrentProjectId(editingProjectId)

        changeWholeScreen();

        editingProjectId = null;
        deleteProjectModal.close();
    }

    function changeSideBar(){
        sidebarButtons.replaceChildren();

        todoList.getListOfProjects().forEach(project => createProjectItemButton(project));
        changeSelectedProject();
    }

    function createProjectItemButton(project){
        const button = document.createElement('button');
        button.dataset.projectId = `${project.projectId}`;
        button.innerHTML = `<i class="fa-regular fa-folder-open"></i>`
        button.append(` ` + `${project.projectName}`)
        button.addEventListener('click',(event)=>changeProject(event))
        button.className = 'projectButton';


        const sideButton = document.createElement('button');
        sideButton.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`
        sideButton.className = 'projectSideButton'

        const dropdown = document.createElement('div');
        dropdown.className = 'project-dropdown is-hidden';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit project';
        editButton.addEventListener('click',(event)=>{
            const projectId = event.currentTarget.closest('.projectItem').querySelector('.projectButton').dataset.projectId;
            openEditProjectModal(projectId)
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete project';
        deleteButton.className = 'delete-project';
        deleteButton.addEventListener('click',(event)=>{
            const projectId = event.currentTarget.closest('.projectItem').querySelector('.projectButton').dataset.projectId;
            openDeleteProjectModal(projectId)
        });

        dropdown.append(editButton, deleteButton);

        sideButton.addEventListener('click', (event)=>{
            event.stopPropagation();

            document.querySelectorAll('.project-dropdown').forEach((menu) => {
                if (menu !== dropdown) {
                    menu.classList.add('is-hidden');
                }
            });

            dropdown.classList.toggle('is-hidden');
        })

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'projectItem';
        buttonContainer.append(button,sideButton,dropdown);

        sidebarButtons.appendChild(buttonContainer)
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
        const sidebarButtons = document.querySelectorAll('#sidebarButtons .projectItem');
        Array.from(sidebarButtons).forEach((button)=>{
            if(button.classList.contains('selected')){
                button.classList.toggle('selected');
            }
            if(button.querySelector('.projectButton').dataset.projectId === todoList.getProject().projectId){
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

        todoList.addTaskToCurrentProject(taskName,taskDescription,taskDueDate,taskPriority);

        changeTaskDisplay();

        event.target.reset();
    }

    function toggleStatusTask(event){
        todoList.toggleTaskStatusInCurrentProject(event.currentTarget.id);

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
        const id = event.currentTarget.closest('.taskCards').querySelector('input[type="checkbox"]').id;

        todoList.deleteTaskFromCurrentProject(id);

        changeTaskDisplay();
    }

    function initialPageLoad(){
        todoList.loadFromStorage();
        changeWholeScreen();
    }

    return{
        openNewProjectModal,
        closeModal,
        createNewProject,
        editProject,
        deleteProject,
        initialPageLoad,
        addTask,
        changeShowStatus,
    }

})();

export default domController;