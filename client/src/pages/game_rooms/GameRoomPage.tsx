import React from 'react'

// Import components
import DataTable from 'src/components/data_table/DataTable';

// Import types
import { GameRoomPageProps } from './GameRoomPage.props';

const fakeData = [
  {
    name: "Phòng của tunanguyen",
    playerName: "tunanguyen",
    hasPassword: true,
    status: "waiting"
  },
  {
    name: "ádjhfaklsjdhfklahjsdklfjhấdfàgsdfghs",
    playerName: "hehe",
    hasPassword: false,
    status: "playing"
  },
  {
    name: "I'm best",
    playerName: "player01",
    hasPassword: false,
    status: "waiting"
  },
  {
    name: "Vào đây chơi",
    playerName: "p",
    hasPassword: true,
    status: "waiting"
  },
  {
    name: "Vua tro choi",
    playerName: "a",
    hasPassword: false,
    status: "playing"
  },
  {
    name: "Chap het",
    playerName: "player02",
    hasPassword: false,
    status: "playing"
  },
  {
    name: "Phòng của player03",
    playerName: "player03",
    hasPassword: true,
    status: "playing"
  },
  {
    name: "Phòng của tunanguyen",
    playerName: "player04",
    hasPassword: true,
    status: "waiting"
  },
  {
    name: "ádjhfaklsjdhfklahjsdklfjhấdfàgsdfghs",
    playerName: "player05",
    hasPassword: false,
    status: "playing"
  },
  {
    name: "I'm best",
    playerName: "player06",
    hasPassword: false,
    status: "waiting"
  },
  {
    name: "Vào đây chơi",
    playerName: "player07",
    hasPassword: true,
    status: "waiting"
  },
  {
    name: "Vua tro choi",
    playerName: "player08",
    hasPassword: false,
    status: "playing"
  },
  {
    name: "Chap het",
    playerName: "player09",
    hasPassword: false,
    status: "playing"
  },
  {
    name: "Phòng của player03",
    playerName: "player10",
    hasPassword: true,
    status: "playing"
  }
];

export default function GameRoomPage(props: GameRoomPageProps) {
  return (
    <div className="game-room-page full-container p-2">
      <h1>Các phòng</h1>
      <DataTable
        data={fakeData}
        renderHeader={() => (
          <tr>
            <td><strong>No</strong></td>
            <td><strong>Tên phòng</strong></td>
            <td><strong>Người chơi</strong></td>
            <td><strong>Mật khẩu</strong></td>
            <td><strong>Trạng thái</strong></td>
          </tr>
        )}
        renderRowData={(piece, index) => (
          <tr key={piece.playerName}>
            <td>{index + 1}</td>
            <td><strong>{piece.name}</strong></td>
            <td>{piece.playerName}</td>
            <td>{piece.hasPassword ? "Có" : "Không"}</td>
            <td>
              {
                piece.status === "waiting"
                  ? <strong className="txt-clr-success">Đang chờ</strong>
                  : <strong className="txt-clr-error">Đang chơi</strong>
              }
            </td>
          </tr>
        )}
      />
    </div>
  )
}