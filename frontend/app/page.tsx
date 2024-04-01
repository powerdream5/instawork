'use client';
import '../public/css/globals.css';
import { TeamMemberProvider } from './context/TeamMemberContext';
import TeamMember from './components/team/Main';

export default function Page() {
  return (
    <TeamMemberProvider>
      <main className="w-full p-0 md:p-8">
        <div className="container overflow-hidden bg-white mx-auto w-full md:w-1/2 2xl:w-1/3 p-4 md:p-8 relative">
          <TeamMember />
        </div>
      </main>
    </TeamMemberProvider>
  );
}