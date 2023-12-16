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
import { OtherUtils } from 'src/utils/other';

// Import from types
import { CharacterType } from 'src/types/character.types';

import charactersData from "src/assets/data/characters.json";

// Locally Import
// Import functions
import { CharacterPickerDialogStateConfigs } from './state/character_picker_dialog';

// Import styles
import "./Dialog.styles.css";

export const name = "myCharacterPickerDialog";

/**
 * Use this function to open a dialog for character picking.
 */
export function openCPDialog() {
  return openTMI(name);
}

type CharacterPickerType = {
  data: CharacterType;
  choicedId: string;
  setChoice: (character: CharacterType) => void;
};

function CharacterPicker(props: CharacterPickerType) {
  let extendClassName = "character-img circle";
  if(props.data._id === props.choicedId) extendClassName += " choice";

  return (
    <Button
      isTransparent
      hasPadding={false}
      extendClassName={extendClassName}
      onClick={() => props.setChoice(props.data)}
    >
      <img src={props.data.img} alt={props.data.name} />
    </Button>
  )
}

async function getCharactersAsync(from: number = 0, to: number = 5): Promise<Array<CharacterType>> {
  await OtherUtils.wait(2000);
  let N = charactersData.data.length < to ? charactersData.data.length : to;
  let data = [];

  for(let i = from; i < N; i++) {
    data.push(charactersData.data[i]);
  };

  return data;
}

/**
 * Component renders a dialog that allows user to pick a character (image).
 * @param props 
 * @returns 
 */
export default function CharacterPickerDialog(props: CustomizedModalItemProps) {
  const [data, setDataFns] = useStateWESSFns(
    CharacterPickerDialogStateConfigs.getInitialState(),
    CharacterPickerDialogStateConfigs.getStateFns
  );
  const { setPlayer } = usePlayerActions();

  const fetchCharacters = function(query?: { limit?: string, skip?: string }) {
    query = ObjectUtils.setDefaultValues(query, { limit: "5", skip: "0" });

    // Call API to get characters from server.
    getCharactersAsync(0, 10)
    .then(payload => {
      setDataFns.addCharacters(payload);
    })
  };

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
              data.characters.map(character => (
                <CharacterPicker
                  key={character._id}
                  data={character}
                  setChoice={setDataFns.setChoice}
                  choicedId={data.choice._id}
                />
              ))
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