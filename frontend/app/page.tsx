'use client';
import '../public/css/globals.css';
import { TeamMemberProvider } from './context/TeamMemberContext';
import TeamMember from './components/team/Main';

export default function Page() {
  return (
    <TeamMemberProvider>
      <main className="w-full p-0 md:p-8">
        <div className="container relative mx-auto w-full overflow-hidden bg-white p-4 md:w-1/2 md:p-8 2xl:w-1/3">
          <TeamMember />
        </div>
      </main>
    </TeamMemberProvider>
  );
}
