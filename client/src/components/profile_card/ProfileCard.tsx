import React from 'react'

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { usePlayer } from 'src/hooks/usePlayer';

// Import components
import MyInput from '../my_input/MyInput';

// Import types
import { ProfileCardProps } from './ProfileCard.props';

// Import styles
import './ProfileCard.stlyes.css';

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
         */
        changeName: function() {
          let newName = elementRefs.current.playerName!.value;
          playerDispatcher.setPlayerNameAction(newName);
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
          props.canEdit && (
            <button className="btn-no-padd spe-outline circle">
              <span className="material-symbols-outlined" style={{ padding: "5px" }}>change_circle</span>
            </button>
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
            <button
              onClick={() => {
                profileStateFns.changeName()
                profileStateFns.toggleChangeName(false)
              }}
              className="btn-transparent no-outline py-1 rounded-4"
            >
              <span className="txt-clr-primary fs-4">Đồng ý</span>
            </button>
          )
        }
        {
          props.canEdit && (
            <button
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
            </button>
          )
        }
      </div>
    </div>
  )
}