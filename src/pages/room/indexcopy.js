import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import axios from "axios";
import CreateRoomModal from "../../components/CreateRoomModal";
import Cookies from "js-cookie";
import LayoutAuthenticated from "../../components/LayoutAuthticated";
import { refreshToken } from "public/refreshToken";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
import RoomListComponent from "../../components/room/RoomListComponent";

export default function RoomList() {

  return (
    <div className="background-div">
      <>
        <title>MOFIT 멀티 게임</title>
        <Navbar>
          <div className="room-container mx-auto border-solid border-indigo-500">
            <div className="room-box">
              <div>
                <button className="create-room-btn"> 방만들기</button>
              </div>
              <div className="grid-box">
                <div className="grid gap-7 grid-cols-2">
                  <RoomListComponent />
                  <RoomListComponent />
                  <RoomListComponent />
                  <RoomListComponent />
                  <RoomListComponent />
                  <RoomListComponent />
                </div>
                <div className="flex justify-center">
                  <button>좌</button>
                  <button>우</button>
                </div>
              </div>
            </div>

          </div>
        </Navbar>
      </>
      <style jsx>{`
        .room-container {
          width: 1280px;
          height: 960px;
        }

        .background-div {
          background-image: url("background-img.jpg");
          background-size: cover;
          background-position: center;
          overflow: hidden;
          z-inex: -1;
        }

        .grid-box {
          padding: 10px;
          height: 860px;
          background-color: rgba( 1, 46, 99, 0.6 );
          border-radius: 10px;
        }

        .room-box {
          padding: 5px 10px 10px 10px;
          border: 3px solid #0081E3;
          border-radius: 10px;
          background-color: rgba( 45, 88, 142, 0.8 );
          height: 100%;
        }

        .create-room-btn {
          margin: 1px 0px 6px 10px;
          padding: 5px 30px;
          border: 3px solid white;
          border-radius: 10px;
        }
        
      `}</style>
    </div>
  );
}
