import Project from './project.js'

const todoList = (()=>{
    let projects = [];
    let currentProjectId = null;

    function createProject(newName, newDesc){
        const id = crypto.randomUUID();
        const project = new Project(id,newName, newDesc)
        projects.push(project);
        currentProjectId = id;
        saveToStorage();
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

    function removeProject(projectId){
        const index = getProjectIndex(projectId);

        if (index === -1) return;

        projects.splice(index, 1);
        saveToStorage();
    }
    
    function updateProject(projectId,newName,newDesc){
        const index = getProjectIndex(projectId);

        if (index === -1) return;

        projects[index].projectName = newName;
        projects[index].projectDesc = newDesc;
        saveToStorage();
    }

    function getProjectNameAndDesc(projectId){
        const index = getProjectIndex(projectId);

        if (index === -1) return null;

        return [projects[index].projectName,projects[index].projectDesc]
    }

    function getProjectIndex(projectId) {
        return projects.findIndex(project => project.projectId === projectId);
    }

    function protectCurrentProjectId(projectId) {
        if (projectId !== currentProjectId) return;

        if (projects.length === 0) {
            currentProjectId = null;
        } else {
            currentProjectId = projects[0].projectId;
        }
        saveToStorage();
    }

    function addTaskToCurrentProject(taskName,taskDescription,taskDueDate,taskPriority){
        const index = getProjectIndex(currentProjectId);

        if (index === -1) return;

        projects[index].createTask(taskName,taskDescription,taskDueDate,taskPriority);
        saveToStorage();;
    }

    function deleteTaskFromCurrentProject(taskId){
        const index = getProjectIndex(currentProjectId);

        if (index === -1) return;

        projects[index].removeTask(taskId);
        saveToStorage();
    }

    function toggleTaskStatusInCurrentProject(taskId){
        const index = getProjectIndex(currentProjectId);

        if (index === -1) return;

        projects[index].toggleTaskStatus(taskId);
        saveToStorage();
    }

    function saveToStorage(){
        localStorage.setItem('projects',JSON.stringify(projects))
        localStorage.setItem('currentProjectId',JSON.stringify(currentProjectId))
    }

    function loadFromStorage(){
        const projectList = JSON.parse(localStorage.getItem('projects'))
        if(projectList === null){
            projects = [];
            currentProjectId = null;
            return 
        }

        let newProjectList = [];
        
        projectList.forEach(project => {
            const newProject = new Project(project.projectId, project.projectName, project.projectDesc);

            project.tasks.forEach(task => {
                newProject.loadTask(task.taskId,task.taskName, task.taskDesc, task.taskDueDate, task.taskPrio, task.status);
            })

            newProjectList.push(newProject);
        });

        projects = newProjectList;
        currentProjectId = JSON.parse(localStorage.getItem('currentProjectId'))
    }

    return{
        createProject,
        setCurrentProject,
        getProject,
        getListOfProjects,
        updateProject,
        getProjectNameAndDesc,
        removeProject,
        protectCurrentProjectId,
        addTaskToCurrentProject,
        deleteTaskFromCurrentProject,
        toggleTaskStatusInCurrentProject,
        loadFromStorage,
    }
})();

export default todoList;