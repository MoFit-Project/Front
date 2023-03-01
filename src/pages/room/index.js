import { useState, useEffect, useRef, createContext } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import axios from "axios";
import CreateRoomModal from "../../components/CreateRoomModal";
import Cookies from "js-cookie";
import LayoutAuthenticated from "../../components/LayoutAuthticated";
import { refreshToken } from "public/refreshToken";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";

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
          case 401:
            refreshToken();
            break;
          case 400:
            alert("존재하지 않는 방입니다.");
            router.reload();
            break;
          default:
            console.log("Unexpected Error");
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
    <div className="background-div " style={{}}>
      <>
      <LayoutAuthenticated>
        <title>MOFIT 멀티 게임</title>
        <Navbar>
        <div className="flex-col items-center flex">
          <div className="mt-24 w-8/12 flex">
            <table className="w-full">
              <thead>
                <tr className="text-white">
                  <th className="w-1/4 py-2 px-4">방 제목</th>
                  <th className="w-1/4 py-2 px-4">참여 인원</th>
                  <th className="w-1/4 py-2 px-4">액션</th>
                </tr>
              </thead>
              <tbody>
                  {roomList?.map((room) => (
                    <tr
                      key={room.roomId}
                      className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <td className="py-2 px-4 text-center font-bold">
                        {room.roomId}
                      </td>
                      <td className="py-2 px-4 text-center font-bold">{room.participant}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-green-500 text-white font-bold py-2 px-4 rounded-md mx-auto block btn-1"
                          onClick={() => {
                            handleRoomEnter(room.roomId);
                          }}
                        >
                          참여하기
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {roomList?.map((room) => (
                      <tr
                        key={room.roomId}
                        className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                      >
                        <td className="py-2 px-4 text-center font-bold">
                          {room.roomId}
                        </td>
                        <td className="py-2 px-4 text-center font-bold">
                          {room.participant}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-md mx-auto block btn-1"
                            onClick={() => {
                              handleRoomEnter(room.roomId);
                            }}
                          >
                            참여하기
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="fixed right-56 top-3/4 mt-20">
                  <button
                    className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center ml-auto hover:bg-teal-800 shadow-xl btn-1"
                    onClick={handleOpenModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Navbar>
          <CreateRoomModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </LayoutAuthenticated>
      </>
      <style jsx>{`
        .background-div {
          background-image: url("background-img.jpg");
          background-size: cover;
          background-position: center;
          overflow: hidden;
          z-inex: -1;
        }

        table {
          border: 10px solid #0d4c92;
          background: linear-gradient(to right, #0096ff, #00d7ff);
        }
        .btn-1 {
          background: rgb(6, 14, 131);
          background: linear-gradient(
            0deg,
            rgba(6, 14, 131, 1) 0%,
            rgba(12, 25, 180, 1) 100%
          );
          border: none;
        }
        .btn-1:hover {
          background: rgb(0, 3, 255);
          background: linear-gradient(
            0deg,
            rgba(0, 3, 255, 1) 0%,
            rgba(2, 126, 251, 1) 100%
          );
        }
        table tr {
          border-bottom: 1px solid #e5e5e5;
        }
      `}</style>
    </div>
  );
}
