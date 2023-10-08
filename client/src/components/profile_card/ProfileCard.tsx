import React from 'react'

// Import types
import { ProfileCardProps } from './ProfileCard.props';

// Import styles
import './ProfileCard.stlyes.css';

export default function ProfileCard(props: ProfileCardProps) {
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
      <div className={"flex-box flex-col" + (props.isVertical ? " mt-1" : " ms-1 ait-flex-start")}>
        <h2 className="txt-center">{props.player.name}</h2>
        {
          props.canEdit && (
            <button
              className="btn-transparent no-outline rounded-4"
            >
              <span className="txt-clr-primary fs-4">Đổi tên</span>
            </button>
          )
        }
      </div>
    </div>
  )
}