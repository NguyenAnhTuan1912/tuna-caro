import React from 'react'

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { usePlayer } from 'src/hooks/usePlayer';

// Import from components
import MyInput from '../my_input/MyInput';
import Button from '../button/Button';
import { openCPDialog } from '../dialog/CharacterPickerDialog';

// Import styles
import './ProfileCard.stlyes.css';

// Import types
import { ProfileCardProps } from './ProfileCard.props';

interface ProfileCardElementsType {
  playerName: HTMLInputElement | null;
}

export default function ProfileCard(props: ProfileCardProps) {
  const { player, playerDispatcher } = usePlayer();
  const [ profileState, profileStateFns ] = useStateWESSFns(
    {
      canChangeName: false
    },
    function(changeState) {
      return {
        /**
         * Use this function to enable of disable player name text box.
         * @param s
         */
        toggleChangeName: function(s?: boolean) {
          changeState("canChangeName", function(status) {
            if(s) return s;
            return !status;
          });
        },

        /**
         * Use this function to change name for player.
         * It change the state in redux (Global state).
         */
        changeName: function() {
          let newName = elementRefs.current.playerName!.value;
          playerDispatcher.setPlayerName(newName);
        }
      }
    }
  );

  const elementRefs = React.useRef<ProfileCardElementsType>({
    playerName: null
  });

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
                profileStateFns.changeName()
                profileStateFns.toggleChangeName(false)
              }}
              className="btn-transparent no-outline py-1 rounded-4"
            >
              <span className="txt-clr-primary fs-4">Đồng ý</span>
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
                    <span className="txt-clr-error fs-4">Hủy</span>
                  )
                  : (
                    <span className="txt-clr-primary fs-4">Đổi tên</span>
                  )
              }
            </Button>
          )
        }
      </div>
    </div>
  )
}