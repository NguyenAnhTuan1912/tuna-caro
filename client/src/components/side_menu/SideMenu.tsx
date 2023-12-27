import React from 'react';
import { CustomizedModalItemProps } from 'tunangn-react-modal';

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
          title="Hướng dẫn"
          hasHorizontalLine
        >
          <div className="mb-4">
            <h3>Chung</h3>
            <p className="mb-1">Nếu như bạn muốn thay đổi ngôn ngữ, màu chủ đề và các cài đặt khác thì vào phần "Cài đặt".</p>
          </div>
          <div className="mb-4">
            <h3>Trò chơi</h3>
            <KeyGuide
              extendClassName='mb-1'
              title='Di chuyển: giữ'
              keys='Space + LMB'
            />
            <KeyGuide
              extendClassName='mb-1'
              title='Đánh dấu:'
              keys='LMB'
            />
            <KeyGuide
              extendClassName='mb-1'
              title='Phóng to: ấn'
              keys={<span className="material-symbols-outlined">add</span>}
            />
            <KeyGuide
              extendClassName='mb-1'
              title='Thu nhỏ:'
              keys={<span className="material-symbols-outlined">remove</span>}
            />
            <KeyGuide
              extendClassName='mb-1'
              title='Chơi lại:'
              keys={<span className="material-symbols-outlined">restart_alt</span>}
            />
          </div>
        </Article>
    </div>
  )
}