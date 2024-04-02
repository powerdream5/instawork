import { useState, useEffect } from 'react';
import Link from 'next/link';
import TeamMemberItem from './TeamMemberItem';
import { TeamMember, SortOptionType } from '@/app/utils/type';
import { useTeamMember } from '@/app/context/TeamMemberContext';

interface TeamMemberListProps {
  onToggleView: (e?: React.SyntheticEvent) => void;
  sort: SortOptionType;
  onSortChange: (sort: SortOptionType) => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
  onToggleView,
  sort,
  onSortChange,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const { handleSelectMember } = useTeamMember();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      console.log(process.env.NEXT_PUBLIC_API_HOST);
      const queryParams = new URLSearchParams({ sort: sort }).toString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/team/members?${queryParams}`,
      );
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

  const handleClickAddNewMember = (event: React.SyntheticEvent) => {
    event.preventDefault();
    handleSelectMember(null);
    onToggleView();
  };

  return (
    <div>
      <div className="mb-4 text-right">
        <a
          href="#"
          onClick={handleClickAddNewMember}
          className="inline-block h-8 w-8 rounded-full border border-solid border-blue-600 text-center text-xl text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          +
        </a>
      </div>
      <h2 className="mb-1 text-2xl font-bold">Team Members</h2>
      <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
        <p>
          You have {teamMembers.length} team member
          {teamMembers.length !== 1 ? 's' : ''}
        </p>
        <div>
          <span className="pr-2">Sort By:</span>
          <select name="sort" value={sort} onChange={handleSortChange}>
            <option value="name">Name</option>
            <option value="created_at">Date Added</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="p-8 text-center text-gray-400">Loading...</div>
      ) : teamMembers.length > 0 ? (
        <ul>
          {teamMembers.map((member) => (
            <TeamMemberItem key={member.id} member={member} />
          ))}
        </ul>
      ) : (
        <div className="p-8 text-center">
          <Link
            href="/team-member-new"
            onClick={handleClickAddNewMember}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Add a Team Member
          </Link>
        </div>
      )}
    </div>
  );
};

export default TeamMemberList;
