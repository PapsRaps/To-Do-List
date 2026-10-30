import "./reset.css";
import "./styles.css";

import domController from './modules/domController.js'

(()=>{
    const newProjectButtons = document.querySelectorAll('#newProjectButton');
    Array.from(newProjectButtons).forEach(button=>button.addEventListener('click',domController.openNewProjectModal));

    const cancelEditProject = document.getElementById('cancelEditProject');
    cancelEditProject.addEventListener('click',(event)=>{domController.closeModal(event)});

    const cancelNewProject = document.getElementById('cancelNewProject');
    cancelNewProject.addEventListener('click',(event)=>{domController.closeModal(event)});

    const cancelDeleteProject = document.getElementById('cancelDeleteProject');
    cancelDeleteProject.addEventListener('click',(event)=>{domController.closeModal(event)});

    const exitModalButtons = document.querySelectorAll('.close-modal');
    Array.from(exitModalButtons).forEach((button)=>{
        button.addEventListener('click',(event)=>{domController.closeModal(event)});
    })

    const newProjectForm = document.getElementById('newProjectForm');
    newProjectForm.addEventListener('submit',(event)=>domController.createNewProject(event))

    const addTaskForm = document.getElementById('addTaskForm');
    addTaskForm.addEventListener('submit',(event)=>domController.addTask(event))

    const editProjectForm = document.getElementById('editProjectForm');
    editProjectForm.addEventListener('submit',(event)=>domController.editProject(event))

    const deleteProjectButton = document.getElementById('deleteProject');
    deleteProjectButton.addEventListener('click',(event)=>domController.deleteProject(event))

    const allButtonContainer = document.getElementById('allButtonContainer');
    const activeButtonContainer = document.getElementById('activeButtonContainer');
    const completedButtonContainer = document.getElementById('completedButtonContainer');
    allButtonContainer.addEventListener('click',(event)=>domController.changeShowStatus(event));
    activeButtonContainer.addEventListener('click',(event)=>domController.changeShowStatus(event));
    completedButtonContainer.addEventListener('click',(event)=>domController.changeShowStatus(event));

    document.addEventListener('click', (event) => {
        event.stopPropagation();
        document.querySelectorAll('.project-dropdown').forEach((menu) => {
            menu.classList.add('is-hidden');
        });
    });

    domController.initialPageLoad();
})()

