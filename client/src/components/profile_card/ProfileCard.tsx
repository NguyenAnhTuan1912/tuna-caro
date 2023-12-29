import React from 'react'

// Import hooks
import { useLangState } from 'src/hooks/useLang';
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { usePlayer } from 'src/hooks/usePlayer';

// Import from components
import MyInput from '../my_input/MyInput';
import Button from '../button/Button';
import { openCPDialog } from '../dialog/CharacterPickerDialog';

// Locally Import
// Import functions.
import { ProfileCardStateConfigs } from './state/profile_card';

// Import styles
import './ProfileCard.stlyes.css';

// Import types
import { ProfileCardProps, StaticProfileCardProps } from './ProfileCard.props';

interface ProfileCardElementsType {
  playerName: HTMLInputElement | null;
}

/**
 * Component renders a static profile of player.
 * @param props 
 * @returns 
 */
export function StaticProfileCard(props: StaticProfileCardProps) {
  return (
    <div className={"profile-card-container ait-center" + (props.isVertical ? " flex-col" : " flex-rw")}>
      {/* Representation Image */}
      <div className="user-img outline">
        {
          Boolean(props.player!.img) && <img className="" src={props.player!.img} alt={"Avatar of " + props.player!.name} />
        }
      </div>

      {/* Name */}
      <div className={"flex-box flex-col w-100" + (props.isVertical ? " mt-1" : " ms-1 ait-flex-start")}>
        <h2 className="player-name txt-center p-1">{props.player!.name}</h2>
      </div>
    </div>
  )
}

/**
 * Component renders a profile card for player. Including avatar (character) and name.
 * @param props 
 * @returns 
 */
export default function ProfileCard(props: ProfileCardProps) {
  const { player, playerDispatcher } = usePlayer();
  const { langTextJSON } = useLangState();
  const [ profileState, profileStateFns ] = useStateWESSFns(
    ProfileCardStateConfigs.getInitialState(),
    ProfileCardStateConfigs.getStateFns
  );

  const elementRefs = React.useRef<ProfileCardElementsType>({
    playerName: null
  });

  /**
   * Use this function to change name for player.
   * It change the state in redux (Global state).
   */
  const changeName = function() {
    let newName = elementRefs.current.playerName!.value;
    playerDispatcher.setPlayerName(newName);
  }

  // Handle when click to change name button
  React.useEffect(() => {
    if(profileState.canChangeName) {
      elementRefs.current.playerName!.focus();
    }
  }, [profileState.canChangeName]);

  return (
    <div className={"profile-card-container ait-center" + (props.isVertical ? " flex-col" : " flex-rw")}>
      {/* Representation Image */}
      <div className="user-img outline">
        {
          Boolean(player.img) && <img className="" src={player.img} alt={"Avatar of " + player.name} />
        }
        {
          props.canEdit && (
            <Button
              extendClassName="circle"
              hasPadding={false}
              onClick={() => openCPDialog()}
            >
              <span className="material-symbols-outlined" style={{ padding: "5px" }}>change_circle</span>
            </Button>
          )
        }
      </div>

      {/* Name */}
      <div className={"flex-box flex-col w-100" + (props.isVertical ? " mt-1" : " ms-1 ait-flex-start")}>
        {
          profileState.canChangeName
            ? (
              <MyInput
                ref={ref => elementRefs.current.playerName = ref}
                className="fw-bold p-1 txt-center fs-2"
                defaultValue={player.name}
              />
            )
            : (
              <h2 className="player-name txt-center p-1">{player.name}</h2>
            )
        }
        {
          profileState.canChangeName && (
            <Button
              onClick={() => {
                changeName()
                profileStateFns.toggleChangeName(false)
              }}
              className="btn-transparent no-outline py-1 rounded-4"
            >
              <span className="txt-clr-primary fs-4">{langTextJSON.sideMenu.agreeChangeNameBtnLabel}</span>
            </Button>
          )
        }
        {
          props.canEdit && (
            <Button
              onClick={() => { profileStateFns.toggleChangeName() }}
              className="btn-transparent no-outline py-1 rounded-4"
            >
              {
                profileState.canChangeName
                  ? (
                    <span className="txt-clr-error fs-4">{langTextJSON.sideMenu.cancelChangeNameBtnLabel}</span>
                  )
                  : (
                    <span className="txt-clr-primary fs-4">{langTextJSON.sideMenu.changeNameBtnLabel}</span>
                  )
              }
            </Button>
          )
        }
      </div>
    </div>
  )
}