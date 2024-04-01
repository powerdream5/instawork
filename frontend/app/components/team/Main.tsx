import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import TeamMemberList from './TeamMemberList';
import TeamMemberForm from './TeamMemberForm';
import { useTeamMember } from '../../context/TeamMemberContext';
import { SortOptionType} from '@/app/utils/type';
import { SORT_OPTION_NAME } from '@/app/utils/constant';

export default function TeamMember() {
    const { selectedMember } = useTeamMember();
    const [showList, setShowList] = useState(true);

    const [sort, setSort] = useState<SortOptionType>(SORT_OPTION_NAME);

    useEffect(() => {
      setShowList(!selectedMember); 
    }, [selectedMember]);
    
    const handleSortChange = (newSort: SortOptionType) => {
        setSort(newSort);
    };

    const toggleView = (e?: React.SyntheticEvent) => {
      e?.preventDefault();

      setShowList(!showList);
    };
  
    return (
      <>
        <CSSTransition
          in={showList}
          timeout={showList ? 200 : 0}
          classNames="slide"
          unmountOnExit
        >
          <TeamMemberList onToggleView={toggleView} sort={sort} onSortChange={handleSortChange} />
        </CSSTransition>
        <CSSTransition
          in={!showList}
          timeout={!showList ? 200 : 0}
          classNames="slide"
          unmountOnExit
        >
          <TeamMemberForm onToggleView={toggleView} member={selectedMember} />
        </CSSTransition>
      </>
    );
  }
  