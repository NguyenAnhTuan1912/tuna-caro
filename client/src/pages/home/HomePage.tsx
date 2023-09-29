import React from 'react';
import { Link } from 'react-router-dom';
import { openTMI } from 'tunangn-react-modal';

// Import component

// Import types
import { HomePageProps } from './HomePage.props';

// Import styles
import "./HomePage.styles.css";

export default function HomePage(props: HomePageProps) {
  return (
    <div className="home-page full-container p-2">
      <h1 className="txt-center">Trang chủ</h1>
      <div className="home-page-menu w-100 pt-4">
        <Link to={"/game"}><button className="btn spe-outline w-100">Chơi 2 người</button></Link>

        <hr className="my-4"></hr>

        <button
          onClick={() => openTMI("myGameCreatingDialog")}
          className="btn spe-outline w-100 mb-1"
        ><strong className="txt-clr-primary">Tạo phòng chơi trực tuyến</strong></button>

        <button
          onClick={() => { openTMI("myGameFindingDialog") }}
          className="btn spe-outline w-100 mb-1"
        >Tìm người chơi</button>

        <Link to={"/rooms"}><button className="btn spe-outline w-100">Khám phá</button></Link>

        <hr className="my-4"></hr>

        <Link to={"/settings"}><button className="btn spe-outline w-100">Cài đặt</button></Link>
      </div>
    </div>
  )
}