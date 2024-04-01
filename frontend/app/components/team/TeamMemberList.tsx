'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TeamMemberItem from './TeamMemberItem';
import { TeamMember, SortOptionType } from '@/app/utils/type';

interface TeamMemberListProps {
    onToggleView: (e?: React.SyntheticEvent) => void;
    sort: SortOptionType;
    onSortChange: (sort: SortOptionType) => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({ onToggleView, sort, onSortChange }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      const queryParams = new URLSearchParams({ sort: sort }).toString();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/team/members?${queryParams}`);
      const jsonResponse = await response.json();
  
      if (jsonResponse.success && jsonResponse.data) {
        setTeamMembers(jsonResponse.data);
      } else {
        setTeamMembers([]);
      }
      setIsLoading(false);
    };
  
    fetchTeamMembers();
  }, [sort]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value as SortOptionType);
  };

  return (
    <div>
      <div className="text-right mb-4">
        <a href="#" onClick={onToggleView} className="rounded-full h-8 w-8 text-xl border border-blue-600 border-solid inline-block text-center text-blue-600 hover:bg-blue-600 hover:text-white">+</a>
      </div>
      <h2 className="text-2xl font-bold mb-1">Team Members</h2>
      <div className="text-slate-400 text-sm mb-4 flex items-center justify-between">
        <p>You have {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''}</p>
        <div>
          <span className="pr-2">Sort By:</span>
          <select name="sort" value={sort} onChange={handleSortChange}>
            <option value="name">Name</option>
            <option value="created_at">Date Added</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center p-8 text-gray-400">
          Loading...
        </div>
      ) : teamMembers.length > 0 ? (
        <ul>
          {teamMembers.map((member) => (
            <TeamMemberItem key={member.id} member={member} />
          ))}
        </ul>
      ) : (
        <div className="text-center p-8">
          <Link href="/team-member-new" onClick={onToggleView} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
            Add a Team Member
          </Link>
        </div>
      )}
    </div>
  );
};

export default TeamMemberList;
