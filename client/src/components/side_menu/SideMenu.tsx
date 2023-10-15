import React from 'react';
import { CustomizedModalItemProps } from 'tunangn-react-modal';

// Import components
import ProfileCard from '../profile_card/ProfileCard';
import KeyGuide from '../key_guide/KeyGuide';

export default function SideMenu(props: CustomizedModalItemProps) {
  const sideMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    props.utils.runAnimation!(sideMenuRef.current!);
  }, []);

  return (
    <div
      ref={sideMenuRef}
      className="side-menu-container"
      style={props.utils.getContainerStyle({
        width: "100%",
        maxWidth: "475px",
        minWidth: "300px",
        padding: ".75rem",
        borderLeft: "2px solid var(--clr-onBackground)"
      })}
    >
        {/* Header */}
        <div className="flex-box ait-center jc-space-between mb-3">
          <span
            className="material-symbols-outlined btn-transparent p-1 rounded-4"
            onClick={() => props.close({ isAgree: false, message: "Fuck you" })}
          >
            close
          </span>
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

        <div className="p-1">
          <h2>Hướng dẫn</h2>
          <hr className="my-1"></hr>
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
        </div>
    </div>
  )
}