import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TeamMember } from '../utils/type';

interface TeamMemberContextValue {
  selectedMember: TeamMember | null;
  handleSelectMember: (member: TeamMember | null) => void;
}

const TeamMemberContext = createContext<TeamMemberContextValue | undefined>(
  undefined,
);

export function useTeamMember() {
  const context = useContext(TeamMemberContext);
  if (context === undefined) {
    throw new Error('useTeamMember must be used within a TeamMemberProvider');
  }
  return context;
}

interface TeamMemberProviderProps {
  children: ReactNode;
}

export const TeamMemberProvider: React.FC<TeamMemberProviderProps> = ({
  children,
}) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleSelectMember = (member: TeamMember | null) => {
    setSelectedMember(member);
  };

  return (
    <TeamMemberContext.Provider value={{ selectedMember, handleSelectMember }}>
      {children}
    </TeamMemberContext.Provider>
  );
};
