import React, { useState, useMemo } from 'react';
import { User, Post, PortfolioProject } from '../types';
import { users as allUsers, posts as allPosts, samplePortfolioProjects } from '../data';
import LazyImage from './LazyImage';
import { MusicIcon, ListIcon, HeartIcon, PlayIcon, PlusIcon, TrophyIcon, StarIcon, UserIcon, SlidersHorizontalIcon, LayoutDashboardIcon, FolderKanbanIcon, UsersIcon } from './icons';

interface ProfilePageProps {
  userId: string;
  currentUser: User;
  onNavigateToSettings: () => void;
  onNavigateToProfile: (userId: string) => void;
  onNavigateToFollowList: (userId: string, type: 'followers' | 'following') => void;
  onNavigateToProject: (projectId: string) => void;
  onNavigate: (page: any) => void; // Using 'any' for now, should be Page type from App.tsx
}

const ProfileHeader: React.FC<{ 
  user: User; 
  isOwnProfile: boolean; 
  onNavigateToSettings: () => void; 
  tracksCount: number;
  onNavigateToFollowList: (userId: string, type: 'followers' | 'following') => void;
}> = ({ user, isOwnProfile, onNavigateToSettings, tracksCount, onNavigateToFollowList }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  
  return (
    <div className="bg-light-surface rounded-xl p-4 sm:p-6 mb-6 border border-light-border">
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative flex-shrink-0">
          <LazyImage src={user.avatarUrl} alt={user.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-brand-pink" />
          {user.isOnline && (
            <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 bg-green-400 border-2 border-light-surface rounded-full" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.isContributor && (
              <span className="bg-brand-pink text-white px-3 py-1 text-xs font-semibold rounded-full">기여자</span>
            )}
          </div>
          <p className="text-brand-pink mb-2">{user.handle}</p>
          <p className="text-light-text-secondary mb-4 text-sm leading-relaxed">{user.bio}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {user.genreTags.map(tag => (
              <span key={tag} className="bg-light-bg px-3 py-1 text-xs rounded-full text-light-text-secondary">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
             <div className="flex space-x-4 sm:space-x-6">
              <div className="text-center">
                <span className="block text-lg font-bold">{tracksCount}</span>
                <span className="text-xs text-light-text-secondary">프로젝트</span>
              </div>
              <button onClick={() => onNavigateToFollowList(user.id, 'followers')} className="text-center hover:bg-light-bg p-2 rounded-md">
                <span className="block text-lg font-bold">{user.followersCount}</span>
                <span className="text-xs text-light-text-secondary">팔로워</span>
              </button>
              <button onClick={() => onNavigateToFollowList(user.id, 'following')} className="text-center hover:bg-light-bg p-2 rounded-md">
                <span className="block text-lg font-bold">{user.followingCount}</span>
                <span className="text-xs text-light-text-secondary">팔로잉</span>
              </button>
            </div>

            {isOwnProfile ? (
              <button onClick={onNavigateToSettings} className="bg-light-bg px-5 py-2 rounded-lg font-semibold border border-light-border hover:border-brand-pink">프로필 편집</button>
            ) : (
              <div className="flex space-x-3">
                <button 
                    onClick={() => setIsFollowing(f => !f)}
                    className={`px-5 py-2 rounded-lg font-semibold ${isFollowing ? 'bg-light-bg border border-light-border' : 'bg-brand-pink text-white'}`}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
                <button className="bg-light-bg px-5 py-2 rounded-lg font-semibold border border-light-border">메시지</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; isOwnProfile: boolean; }> = ({ activeTab, setActiveTab, isOwnProfile }) => {
  const baseTabs = [
    { id: 'projects', label: '프로젝트', icon: TrophyIcon },
    { id: 'playlists', label: '플레이리스트', icon: ListIcon },
    { id: 'liked', label: '좋아요', icon: HeartIcon },
    { id: 'about', label: '소개', icon: UserIcon }
  ];

  const tabs = baseTabs;

  return (
    <div className="border-b border-light-border mb-6">
      <div className="flex space-x-4 sm:space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-pink text-brand-pink'
                : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: PortfolioProject; onClick: () => void }> = ({ project, onClick }) => (
    <div onClick={onClick} className="bg-light-surface rounded-lg overflow-hidden group border border-light-border transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer">
        <div className="relative aspect-[4/3]">
            <LazyImage src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <h3 className="text-white text-lg font-bold text-center">{project.title}</h3>
            </div>
        </div>
        <div className="p-3">
            <p className="font-bold truncate text-sm">{project.title}</p>
            <div className="flex items-center justify-between mt-1 text-xs text-light-text-secondary">
                <div className="flex items-center">
                    <HeartIcon className="w-3 h-3 mr-1 text-brand-pink" />
                    <span>{project.likes.toLocaleString()}</span>
                </div>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    </div>
);

const ProjectsTab: React.FC<{ projects: PortfolioProject[]; onNavigateToProject: (projectId: string) => void; }> = ({ projects, onNavigateToProject }) => {
  if (projects.length === 0) {
    return <div className="text-center py-12 text-light-text-secondary">아직 공개된 프로젝트가 없습니다.</div>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => <ProjectCard key={project.id} project={project} onClick={() => onNavigateToProject(project.id)} />)}
    </div>
  );
};

const ProfilePlaylistsTab: React.FC<{ userId: string; isOwnProfile: boolean; }> = ({ userId, isOwnProfile }) => {
  const userPlaylists = [
    {
      id: 'playlist1',
      title: '작업용 Lo-fi 모음',
      description: '집중할 때 듣는 차분한 비트들',
      trackCount: 23,
      duration: '1시간 42분',
      coverImage: 'https://picsum.photos/seed/playlist1/300/300',
      isPublic: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'playlist2', 
      title: '새벽 감성 신스웨이브',
      description: '80년대 향수를 자극하는 트랙들',
      trackCount: 15,
      duration: '58분',
      coverImage: 'https://picsum.photos/seed/playlist2/300/300',
      isPublic: false,
      createdAt: '2024-02-20'
    },
    {
      id: 'playlist3',
      title: '영화음악 컬렉션',
      description: '감동적인 오케스트라 음악들',
      trackCount: 31,
      duration: '2시간 15분',
      coverImage: 'https://picsum.photos/seed/playlist3/300/300',
      isPublic: true,
      createdAt: '2024-03-10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userPlaylists.map(playlist => (
        <div key={playlist.id} className="bg-light-surface rounded-xl border border-light-border overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-square">
            <LazyImage src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <PlayIcon className="w-16 h-16 text-white" />
            </div>
            {!playlist.isPublic && (
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                비공개
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1">{playlist.title}</h3>
            <p className="text-sm text-light-text-secondary mb-2 line-clamp-2">{playlist.description}</p>
            <div className="flex justify-between items-center text-sm text-light-text-secondary">
              <span>{playlist.trackCount}곡</span>
              <span>{playlist.duration}</span>
            </div>
            <p className="text-xs text-light-text-muted mt-2">{playlist.createdAt}</p>
          </div>
        </div>
      ))}
      
      {isOwnProfile && (
        <div className="bg-light-bg rounded-xl border-2 border-dashed border-light-border flex items-center justify-center aspect-square hover:bg-light-border/50 cursor-pointer">
          <div className="text-center">
            <PlusIcon className="w-12 h-12 text-light-text-muted mx-auto mb-2" />
            <p className="text-light-text-secondary font-medium">새 플레이리스트 만들기</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileLikedTab: React.FC<{ userId: string; }> = ({ userId }) => {
  const formatTime = (seconds?: number) => {
    if(!seconds) return '-:--';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const likedTracks = [
    {
      id: 'liked1',
      track: {
        title: '디지털 드림',
        artist: '신스웨이브 키드',
        duration: 210,
        albumArtUrl: 'https://picsum.photos/seed/liked1/200/200'
      },
      likedAt: '3일 전',
      originalPost: {
        author: allUsers.user1,
        likes: 543
      }
    },
    {
      id: 'liked2',
      track: {
        title: '커피숍 분위기',
        artist: '로파이 소녀',
        duration: 185,
        albumArtUrl: 'https://picsum.photos/seed/liked2/200/200'
      },
      likedAt: '1주 전',
      originalPost: {
        author: allUsers.user2,
        likes: 892
      }
    },
    {
      id: 'liked3',
      track: {
        title: '장엄한 여정',
        artist: '시네마틱 마스터',
        duration: 240,
        albumArtUrl: 'https://picsum.photos/seed/liked3/200/200'
      },
      likedAt: '2주 전',
      originalPost: {
        author: allUsers.user3,
        likes: 1234
      }
    }
  ];

  return (
    <div className="space-y-4">
      {likedTracks.map(item => (
        <div key={item.id} className="bg-light-surface rounded-lg border border-light-border p-4 hover:bg-light-bg/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <LazyImage src={item.track.albumArtUrl} alt={item.track.title} className="w-16 h-16 rounded-lg" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg cursor-pointer">
                <PlayIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold">{item.track.title}</h4>
              <p className="text-light-text-secondary">{item.track.artist}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-light-text-secondary">{formatTime(item.track.duration)}</span>
                <span className="text-sm text-light-text-secondary">{item.originalPost.likes.toLocaleString()} 좋아요</span>
                <span className="text-sm text-light-text-secondary">{item.likedAt}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="text-brand-pink hover:text-brand-pink-accent">
                <HeartIcon className="w-6 h-6 fill-current" />
              </button>
              <button className="text-light-text-muted hover:text-light-text-primary">
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProfileAboutTab: React.FC<{ user: User; isOwnProfile: boolean; }> = ({ user, isOwnProfile }) => (
  <div className="space-y-6">
    <div className="bg-light-surface rounded-xl border border-light-border p-6">
      <h3 className="text-lg font-bold mb-4">기본 정보</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-light-text-secondary">가입일</span>
          <span className="font-medium">2023년 10월 26일</span>
        </div>
        <div className="flex justify-between">
          <span className="text-light-text-secondary">전문 장르</span>
          <div className="flex space-x-2">
            {user.genreTags.map(tag => (
              <span key={tag} className="bg-brand-pink/10 text-brand-pink px-2 py-1 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-light-text-secondary">계정 상태</span>
          <span className={`font-medium ${user.isContributor ? 'text-brand-pink' : 'text-light-text-primary'}`}>
            {user.isContributor ? '기여자' : '일반 사용자'}
          </span>
        </div>
      </div>
    </div>

    <div className="bg-light-surface rounded-xl border border-light-border p-6">
      <h3 className="text-lg font-bold mb-4">활동 통계</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-brand-pink/10 rounded-lg">
          <span className="block text-2xl font-bold text-brand-pink">127</span>
          <span className="text-sm text-light-text-secondary">업로드한 트랙</span>
        </div>
        <div className="text-center p-4 bg-blue-500/10 rounded-lg">
          <span className="block text-2xl font-bold text-blue-500">45.2K</span>
          <span className="text-sm text-light-text-secondary">총 재생 수</span>
        </div>
        <div className="text-center p-4 bg-green-500/10 rounded-lg">
          <span className="block text-2xl font-bold text-green-500">4.8</span>
          <span className="text-sm text-light-text-secondary">평균 평점</span>
        </div>
        <div className="text-center p-4 bg-purple-500/10 rounded-lg">
          <span className="block text-2xl font-bold text-purple-500">892</span>
          <span className="text-sm text-light-text-secondary">받은 투표</span>
        </div>
      </div>
    </div>

    <div className="bg-light-surface rounded-xl border border-light-border p-6">
      <h3 className="text-lg font-bold mb-4">최근 성과</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg">
          <TrophyIcon className="w-8 h-8 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="font-semibold">11월 챌린지 3위</p>
            <p className="text-sm text-light-text-secondary">"크리스마스 BGM 만들기"</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg">
          <StarIcon className="w-8 h-8 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-semibold">인기 트랙 달성</p>
            <p className="text-sm text-light-text-secondary">"네온 선셋 드라이브" 1천회 재생</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, currentUser, onNavigateToSettings, onNavigateToFollowList, onNavigateToProject, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('projects');
  
  const user = useMemo(() => allUsers[userId] || currentUser, [userId, currentUser]);
  const userProjects = useMemo(() => 
    samplePortfolioProjects.filter(p => p.credits.some(c => c.user.id === userId)), 
    [userId]
  );
  
  const isOwnProfile = user.id === currentUser.id;

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectsTab projects={userProjects} onNavigateToProject={onNavigateToProject} />;
      case 'playlists':
        return <ProfilePlaylistsTab userId={user.id} isOwnProfile={isOwnProfile} />;
      case 'liked':
        return <ProfileLikedTab userId={user.id} />;
      case 'about':
        return <ProfileAboutTab user={user} isOwnProfile={isOwnProfile} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6">
      <ProfileHeader 
        user={user} 
        isOwnProfile={isOwnProfile} 
        onNavigateToSettings={onNavigateToSettings} 
        tracksCount={userProjects.length} 
        onNavigateToFollowList={onNavigateToFollowList}
      />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />
      <div>
        {renderContent()}
      </div>
    </main>
  );
};

export default ProfilePage;
