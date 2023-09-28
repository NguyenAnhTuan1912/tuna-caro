import React from 'react';
import { CustomizedModalItemProps } from 'tunangn-react-modal';

// Import components
import ProfileCard from '../profile_card/ProfileCard';

export default function SideMenu(props: CustomizedModalItemProps) {
  const sideMenuRef = React.useRef<HTMLDivElement>(null);
  const data = props.item.getData();

  React.useEffect(() => {
    props.utils.runAnimation!(sideMenuRef.current!);
  }, []);

  return (
    <div
      ref={sideMenuRef}
      className="side-menu-container"
      style={props.utils.getContainerStyle({
        minWidth: "420px",
        padding: ".75rem",
        borderLeft: "2px solid var(--clr-onBackground)"
      })}
    >
        {/* Header */}
        <div className="flex-box ait-center jc-space-between">
          <span
            className="material-symbols-outlined btn-transparent p-1 rounded-4"
            onClick={() => props.close({ isAgree: false, message: "Fuck you" })}
          >
            close
          </span>
          <div className="flex-box ait-center jc-space-between">
            <strong>ID:</strong>
            <span
              className="material-symbols-outlined btn-transparent rounded-4 ms-1"
            >
              content_copy
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <ProfileCard isVertical canEdit />
        </div>
    </div>
  )
}