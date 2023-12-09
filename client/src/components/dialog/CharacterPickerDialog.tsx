import React from 'react';
import { openTMI, CustomizedModalItemProps } from 'tunangn-react-modal';

// Import api callers
import { OtherAPIs } from 'src/apis/others';

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { usePlayerActions } from 'src/hooks/usePlayer';

// Import layouts
import DialogLayout from 'src/layouts/modal_items/dialog_layout/DialogLayout';

// Import from components
import Button from '../button/Button';

// Import from utils
import { ObjectUtils } from 'src/utils/object';

// Import types
import { CharacterType } from 'src/types/character.types';

// Import styles
import "./Dialog.styles.css";

export const name = "myCharacterPickerDialog";

/**
 * Use this function to open a dialog for character picking.
 */
export function openCPDialog() {
  return openTMI(name);
}

/**
 * Component renders a dialog that allows user to pick a character (image).
 * @param props 
 * @returns 
 */
export default function CharacterPickerDialog(props: CustomizedModalItemProps) {
  const [data, setDataFns] = useStateWESSFns(
    {
      skip: "0",
      characters: [] as Array<CharacterType>,
      choice: {
        _id: "",
        name: "",
        img: ""
      },
    },
    function(changeState) {
      return {
        /**
         * Use this function to add new list of character to main data.
         * @param characters 
         */
        addCharacters: function(characters: Array<CharacterType>) {
          let N = characters.length;

          if(N > 0) {
            changeState("characters", function(data) {
              data = data.concat(characters);
              return [...data];
            });
  
            changeState("skip", function(data) {
              return (data + N).toString();
            });
          }
        },

        /**
         * Use this function to clear data of character.
         */
        clearCharacter: function() {
          changeState("characters", function() {
            return [];
          });
        },

        /**
         * Use this function to set the character who is chose.
         * @param character 
         */
        setChoice: function(character: CharacterType) {
          changeState("choice", function() {
            return { img: character.img, name: character.name, _id: character._id }
          })
        }
      }
    }
  );
  const { setPlayer } = usePlayerActions();

  const fetchCharacters = function(query?: { limit?: string, skip?: string }) {
    query = ObjectUtils.setDefaultValues(query, { limit: "5", skip: "0" });
    OtherAPIs
      .getCharactersAsync({ query: query! })
      .then(payload => {
        let data = payload.data;
        console.log("Data: ", data);
        setDataFns.addCharacters(data);
      })
  }

  React.useEffect(() => {
    // Call API to get characters for the first time
    // Because of testing purpose, so I will get 5 characters at first.
    fetchCharacters();

    return function() {
      setDataFns.clearCharacter();
    }
  }, []);

  return (
    <DialogLayout
      title={<h3>Nhân vật</h3>}
      close={props.close}
      className="p-1"
      style={props.utils.getContainerStyle({
        width: "100%",
        maxWidth: "720px",
        minHeight: "360px",
        borderRadius: "0",
        backgroundColor: "var(--clr-background)",
        border: "2px solid var(--clr-onBackground)"
      })}
    >
      <div className="flex-box flex-col jc-space-between px-4 mt-4 character-dialog-body">
        <div>
          <div>
            <p>Chọn nhân vật đại diện cho bạn</p>
          </div>
          <div className="character-imgs mb-1">
            {
              data.characters.map(character => {
                let extendClassName = "character-img circle";
                if(character._id === data.choice._id) extendClassName += " choice";

                return (
                  <Button
                    isTransparent
                    hasPadding={false}
                    key={character._id}
                    extendClassName={extendClassName}
                    onClick={() => setDataFns.setChoice(character)}
                  >
                    <img src={character.img} alt={character.name} />
                  </Button>
                )
              })
            }
          </div>
          <div className="flex-box jc-center">
            <Button
              hasBorder={false}
              extendClassName="txt-clr-primary"
              onClick={() => {
                fetchCharacters({ skip: data.skip });
              }}
            >
              Xem thêm
            </Button>
          </div>
        </div>
        <div className="flex-box jc-flex-end ait-center">
          <div className="me-2">
            <span className="fw-bold me-1">Bạn chọn:</span>
            <span>{data.choice.name.toUpperCase()}</span>
          </div>
          <Button
            onClick={() => {
              // Set img for player.
              setPlayer({ img: data.choice.img });
              // Then close the dialog.
              props.close({ isAgree: true });
            }}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </DialogLayout>
  )
}