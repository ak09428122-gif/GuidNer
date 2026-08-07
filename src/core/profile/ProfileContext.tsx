import React, { createContext, useContext, useState, useEffect } from 'react';

export type ProfileType = 'personal' | 'family' | 'child' | 'parent' | 'guest';

export interface UserProfileConfig {
  id: ProfileType;
  name: string;
  roleLabel: string;
  avatarIcon: string;
  badgeColor: string;
  lifeScore: number;
  personaMode: 'friendly' | 'professional' | 'strict' | 'minimal';
}

export const PROFILES_CONFIG: Record<ProfileType, UserProfileConfig> = {
  personal: {
    id: 'personal',
    name: 'Primary Profile',
    roleLabel: 'Personal Life OS',
    avatarIcon: '👤',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    lifeScore: 850,
    personaMode: 'friendly',
  },
  family: {
    id: 'family',
    name: 'Family Hub',
    roleLabel: 'Shared Household',
    avatarIcon: '🏡',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    lifeScore: 920,
    personaMode: 'friendly',
  },
  child: {
    id: 'child',
    name: 'Student Space',
    roleLabel: 'Grade 6 Student',
    avatarIcon: '🎒',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    lifeScore: 780,
    personaMode: 'friendly',
  },
  parent: {
    id: 'parent',
    name: 'Executive & Guardian',
    roleLabel: 'Parent & Executive',
    avatarIcon: '👔',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    lifeScore: 890,
    personaMode: 'professional',
  },
  guest: {
    id: 'guest',
    name: 'Guest Explorer',
    roleLabel: 'Temporary Session',
    avatarIcon: '⚡',
    badgeColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    lifeScore: 650,
    personaMode: 'minimal',
  },
};

interface ProfileContextType {
  currentProfile: UserProfileConfig;
  activeProfileId: ProfileType;
  switchProfile: (profileId: ProfileType) => void;
  allProfiles: UserProfileConfig[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfileId, setActiveProfileId] = useState<ProfileType>(() => {
    const saved = localStorage.getItem('gn_active_profile');
    return (saved as ProfileType) || 'personal';
  });

  const switchProfile = (profileId: ProfileType) => {
    setActiveProfileId(profileId);
    localStorage.setItem('gn_active_profile', profileId);
  };

  const currentProfile = PROFILES_CONFIG[activeProfileId] || PROFILES_CONFIG.personal;

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        activeProfileId,
        switchProfile,
        allProfiles: Object.values(PROFILES_CONFIG),
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
