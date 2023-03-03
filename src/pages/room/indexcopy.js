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
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const roomHostContext = createContext({ roomName: "", isHost: false });
  const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    fetchRooms();
    return setRoomList([]);
  }, []);

  const enterRoom = async (customSessionId) => {
    setIsRoomHost({ roomName: customSessionId, isHost: false });
    const assessToken = Cookies.get("token");
    try {
      const response = await axios.get(API_URL + `/enter/${customSessionId}`, {
        headers: { Authorization: `Bearer ${assessToken}` },
      });

      router.push(`/room/${response.data}`);
    } catch (error) {
      const { response } = error;
      if (response) {
        switch (response.status) {
          case 400:
            alert(response.data);
            break;
          case 401:
            refreshToken();
            break;
          case 404:
            alert("방을 찾을 수 없습니다");
            router.reload();
            break;
          default:
            alert("오류 발생");
            router.reload();
        }
      }
    }
  };

  const fetchRooms = async () => {
    const accessToken = Cookies.get("token");
    try {
      const response = await axios.get(API_URL + "/rooms", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRoomList([...roomList, ...response.data]);
    } catch (error) {
      console.log(error);
      const { response } = error;
      if (response) {
        //모달
        switch (response.status) {
          case 401:
            refreshToken();
            break;
          case 403:
            // 이전페이지로 리다이렉트
            window.alert("접근 권한이 없습니다.");
            router.back();
            break;
          case 500:
            window.alert("서버 오류가 발생했습니다.");
            break;
          default:
            console.log("Unexpected Error");
        }
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRoomEnter = (roomId) => {
    enterRoom(roomId);
  };

  return (
    <div className="background-div">
      <>
        <LayoutAuthenticated>
          <title>MOFIT 멀티 게임</title>
          <Navbar>
            <div className="room-container w-8/12 mx-auto border-solid border-indigo-500">
              <div className="room-box">
                <div>
                  <button className="create-room-btn"> 방만들기</button>
                </div>
                <div className="grid-box grid gap-2 grid-cols-2">
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
          </Navbar>
          <CreateRoomModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </LayoutAuthenticated>
      </>
      <style jsx>{`
        .room-container {
          width: 700px;
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
          background-color: rgba( 1, 46, 99, 0.8 );
          border-radius: 10px;
        }

        .room-box {
          padding: 5px 10px 10px 10px;
          border: 3px solid #0081E3;
          border-radius: 10px;
          background-color: rgba( 45, 88, 142, 0.8 );
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
