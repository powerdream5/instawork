import Link from 'next/link';
import { TeamMember } from '@/app/utils/type';
import { useTeamMember } from '@/app/context/TeamMemberContext';

interface TeamMemberItemProps {
  member: TeamMember;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({member}) => {
  
  const { handleSelectMember } = useTeamMember();

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleSelectMember(member);
  };

  return (
    <li key={member.id} className="border-t border-gray-200">
      <Link href='#' onClick={handleClick} className="flex items-center p-4 hover:bg-gray-100">
        <div className="rounded-full h-16 w-16 flex items-center justify-center bg-gray-300 text-xl text-white">
          {member.first_name[0].toUpperCase()}{member.last_name[0].toUpperCase()}
        </div>
        <div className="ml-4">
          <div className="text-lg font-semibold inline-flex items-center mb-1">
            <div>{member.first_name} {member.last_name}</div>
            {member.role === 'admin' && <span className="ml-2 bg-blue-200 text-blue-800 py-1 px-2 rounded-full text-xs">Admin</span>}
          </div>
          <p className="text-slate-400 text-sm">{member.phone}</p>
          <p className="text-slate-400 text-sm">{member.email}</p>
        </div>
      </Link>
    </li>
  );
}

export default TeamMemberItem;