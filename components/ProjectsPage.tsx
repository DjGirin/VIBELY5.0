import React, { useState, useMemo } from 'react';
import { sampleStudioProjects } from '../data';
import ProjectCard from './ProjectCard';
import { FilePlus2Icon } from './icons';
import StartProjectModal from './StartProjectModal';
import { StudioProject, User } from '../types';
import { users } from '../data';
// import ProjectDetailPage from './ProjectDetailPage'; // This should be a different detail page for StudioProject

type ProjectTab = 'all' | 'my' | 'team' | 'public';

const ProjectsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectTab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<StudioProject[]>(sampleStudioProjects);
  const [selectedProject, setSelectedProject] = useState<StudioProject | null>(null);
  const currentUserId = 'user1'; // Mock current user

  const filteredProjects = useMemo(() => {
    switch (activeTab) {
      case 'my':
        return projects.filter(p => p.contributors.some(c => c.user.id === currentUserId && p.isPublic === false));
      case 'team':
        return projects.filter(p => p.contributors.length > 1);
      case 'public':
        return projects.filter(p => p.isPublic);
      case 'all':
      default:
        return projects;
    }
  }, [activeTab, projects]);

  const handleCreateProject = (newProjectData: Omit<StudioProject, 'id' | 'contributors' | 'lastUpdatedAt' | 'progress' | 'tasks' | 'files' | 'messages'>) => {
    const newProject: StudioProject = {
      id: `proj${Date.now()}`,
      ...newProjectData,
      contributors: [{ user: users[currentUserId], role: 'Producer' }],
      lastUpdatedAt: new Date().toISOString(),
      progress: 0,
      tasks: [],
      files: [],
      messages: [],
    };
    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  const TabButton: React.FC<{ tabId: ProjectTab; label: string; count: number }> = ({ tabId, label, count }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-lg font-semibold rounded-t-lg border-b-2 transition-colors relative ${
        activeTab === tabId
          ? 'text-brand-purple border-brand-purple'
          : 'text-light-text-secondary border-transparent hover:border-light-border hover:text-light-text-primary'
      }`}
    >
      {label}
      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tabId ? 'bg-brand-purple/10 text-brand-purple' : 'bg-light-bg text-light-text-secondary'}`}>{count}</span>
    </button>
  );

  // if (selectedProject) {
  //     // This needs a dedicated StudioProject detail page.
  //     // return <ProjectDetailPage project={selectedProject} onBack={() => setSelectedProject(null)} />;
  // }

  return (
    <>
      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-light-text-primary">Projects</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-brand-purple text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FilePlus2Icon className="w-5 h-5" />
            <span>Start New Project</span>
          </button>
        </div>

        <div className="border-b border-light-border mb-6">
          <TabButton tabId="all" label="All Projects" count={projects.length} />
          <TabButton tabId="my" label="My Projects" count={projects.filter(p => p.contributors.some(c => c.user.id === currentUserId && !p.isPublic)).length} />
          <TabButton tabId="team" label="Team Projects" count={projects.filter(p => p.contributors.length > 1).length} />
          <TabButton tabId="public" label="Public Workshop" count={projects.filter(p => p.isPublic).length} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onClick={() => {}} />
          ))}
        </div>
        {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-16 text-light-text-secondary">
                <p>No projects found in this category.</p>
            </div>
        )}
      </main>
      <StartProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
};

export default ProjectsPage;