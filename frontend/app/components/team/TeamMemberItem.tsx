import Link from 'next/link';
import { TeamMember } from '@/app/utils/type';
import { useTeamMember } from '@/app/context/TeamMemberContext';

interface TeamMemberItemProps {
  member: TeamMember;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({ member }) => {
  const { handleSelectMember } = useTeamMember();

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleSelectMember(member);
  };

  return (
    <li key={member.id} className="border-t border-gray-200">
      <Link
        href="#"
        onClick={handleClick}
        className="flex items-center p-4 hover:bg-gray-100"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-xl text-white">
          {member.first_name[0].toUpperCase()}
          {member.last_name[0].toUpperCase()}
        </div>
        <div className="ml-4">
          <div className="mb-1 inline-flex items-center text-lg font-semibold">
            <div>
              {member.first_name} {member.last_name}
            </div>
            {member.role === 'admin' && (
              <span className="ml-2 rounded-full bg-blue-200 px-2 py-1 text-xs text-blue-800">
                Admin
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{member.phone}</p>
          <p className="text-sm text-slate-400">{member.email}</p>
        </div>
      </Link>
    </li>
  );
};

export default TeamMemberItem;
