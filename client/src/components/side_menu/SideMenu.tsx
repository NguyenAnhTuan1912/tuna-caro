import React from 'react';
import { CustomizedModalItemProps } from 'tunangn-react-modal';

// Import hooks
import { useLangState } from 'src/hooks/useLang';

// Import from layouts
import CloseButton from 'src/layouts/modal_items/CloseButton';

// Import from components
import Article from '../article/Article';
import ProfileCard from '../profile_card/ProfileCard';
import KeyGuide from '../key_guide/KeyGuide';

export const name = "mySideMenu";

/**
 * Component renders a side menu or drawer.
 * @param props 
 * @returns 
 */
export default function SideMenu(props: CustomizedModalItemProps) {
  const { langTextJSON } = useLangState();

  const sideMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    props.utils.runAnimation!(sideMenuRef.current!);
  }, []);

  return (
    <div
      ref={sideMenuRef}
      className="side-menu-container p-3"
      style={props.utils.getContainerStyle({
        width: "100%",
        height: "100dvh",
        maxWidth: "475px",
        minWidth: "300px",
        background: "var(--clr-background)",
        borderLeft: "2px solid var(--clr-onBackground)",
        overflow: "auto"
      })}
    >
        {/* Header */}
        <div className="flex-box ait-center jc-space-between mb-3">
          <CloseButton
            isAgree={false}
            icon="close"
            close={props.close}
          />
          <div className="flex-box ait-center jc-space-between">
            {/* <strong className="me-1">ID: </strong>
            <p className="flex-box ait-center">
              {player.id}
              <span
                className="material-symbols-outlined btn-transparent rounded-4 ms-1"
              >
                content_copy
              </span>
            </p> */}
          </div>
        </div>

        {/* Content */}
        <div>
          <ProfileCard isVertical canEdit />
        </div>
        <Article
          title={langTextJSON.sideMenu.guideLabel}
          hasHorizontalLine
        >
          <div className="mb-4">
            <h3>{langTextJSON.sideMenu.generalGuideLabel}</h3>
            <p className="mb-1">{langTextJSON.sideMenu.generalGuideText}</p>
          </div>
          <div className="mb-4">
            <h3>{langTextJSON.sideMenu.gameGuideLabel}</h3>
            {
              langTextJSON.sideMenu.keyGuides.map((keyGuide, index) => {
                let keyContent = keyGuide.googleIconKey
                  ? <span className="material-symbols-outlined">{keyGuide.googleIconKey}</span>
                  : keyGuide.textKey!

                return (
                  <KeyGuide
                    key={keyGuide.text}
                    extendClassName='mb-1'
                    title={keyGuide.text}
                    keys={keyContent}
                  />
                )
              })
            }
          </div>
        </Article>
    </div>
  )
}