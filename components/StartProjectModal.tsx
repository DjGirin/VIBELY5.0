import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { XIcon, UsersIcon, GlobeIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectData: Omit<Project, 'id' | 'contributors' | 'lastUpdatedAt' | 'progress'>) => void;
}

const StartProjectModal: React.FC<StartProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const { addNotification } = useNotifications();

  const resetState = () => {
    setTitle('');
    setDescription('');
    setTags([]);
    setCurrentTag('');
    setIsPublic(false);
    setStatus('planning');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && currentTag) {
      e.preventDefault();
      if (tags.length < 5 && !tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      addNotification({ type: 'error', message: 'Project title is required.' });
      return;
    }
    onCreate({ title, description, tags, isPublic, status });
    addNotification({ type: 'success', message: `Project "${title}" created!` });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-xl w-full max-w-lg border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Start New Project</h2>
          <button onClick={handleClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold mb-2">Project Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="e.g., Lofi Chillhop Track"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-light-bg border border-light-border rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="Briefly describe your project idea..."
            />
          </div>
          
          <div>
             <label className="block text-sm font-semibold mb-2">Tags</label>
             <div className="w-full bg-light-bg border border-light-border rounded-lg p-2 flex flex-wrap gap-2 items-center">
                {tags.map(tag => (
                    <div key={tag} className="flex items-center bg-brand-purple/10 text-brand-purple text-sm font-medium px-2 py-1 rounded">
                        <span>{tag}</span>
                        <button onClick={() => removeTag(tag)} className="ml-1.5"><XIcon className="w-3 h-3"/></button>
                    </div>
                ))}
                <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 bg-transparent focus:outline-none p-1"
                    placeholder="Add tags..."
                />
             </div>
             <p className="text-xs text-light-text-secondary mt-1">Press Enter or comma to add a tag. (Max 5)</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Visibility</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsPublic(false)}
                className={`p-4 border rounded-lg text-left transition-all ${!isPublic ? 'border-brand-purple ring-2 ring-brand-purple/50 bg-brand-purple/5' : 'border-light-border hover:bg-light-bg'}`}
              >
                <UsersIcon className="w-6 h-6 mb-2 text-brand-purple" />
                <p className="font-bold">Private Project</p>
                <p className="text-xs text-light-text-secondary">Only invited members can view and contribute.</p>
              </button>
              <button
                onClick={() => setIsPublic(true)}
                className={`p-4 border rounded-lg text-left transition-all ${isPublic ? 'border-brand-pink ring-2 ring-brand-pink/50 bg-brand-pink/5' : 'border-light-border hover:bg-light-bg'}`}
              >
                <GlobeIcon className="w-6 h-6 mb-2 text-brand-pink" />
                <p className="font-bold">Public Workshop</p>
                <p className="text-xs text-light-text-secondary">Anyone can join and contribute to this project.</p>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-light-border flex justify-end items-center space-x-3">
          <button onClick={handleClose} className="px-6 py-2 rounded-lg bg-light-bg hover:bg-light-border border border-light-border">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-brand-purple text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartProjectModal;
