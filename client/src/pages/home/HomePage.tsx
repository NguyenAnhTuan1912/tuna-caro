import React from 'react'
import { Link } from 'react-router-dom';

// Import component

// Import types
import { HomePageProps } from './HomePage.props';

// Import styles
import "./HomePage.styles.css";

export default function HomePage(props: HomePageProps) {
  return (
    <div className="home-page full-container p-2">
      <h1>Hello, Welcome to Home Page!</h1>
      <div className="home-page-menu w-100 pt-4">
      <button className="btn spe-outline w-100 mb-1">Tạo trò chơi</button>
        <button className="btn spe-outline w-100 mb-1">Tìm người chơi</button>
        <Link to={"/rooms"}><button className="btn spe-outline w-100 mb-1">Khám phá</button></Link>
        <Link to={"/settings"}><button className="btn spe-outline w-100 mb-1">Cài đặt</button></Link>
      </div>
    </div>
  )
}