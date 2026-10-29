import Project from './project.js'

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

    function removeProject(projectId){
        const index = getProjectIndex(projectId);

        if (index === -1) return;

        projects.splice(index, 1);
    }
    
    function updateProject(projectId,newName,newDesc){
        const index = getProjectIndex(projectId);

        if (index === -1) return;

        projects[index].projectName = newName;
        projects[index].projectDesc = newDesc;
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
    }

    // function updateListOfProjects(listOfProjects){
    //     projects = listOfProjects;
    // }

    return{
        createProject,
        setCurrentProject,
        getProject,
        getListOfProjects,
        updateProject,
        getProjectNameAndDesc,
        removeProject,
        protectCurrentProjectId,
        // updateProjects,
    }
})();

export default todoList;