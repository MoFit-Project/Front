import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";
import axios from "axios";
import CreateRoomModal from "../../components/CreateRoomModal";
import Cookies from "js-cookie";

function RoomList() {
  const [selected, setSelected] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = Cookies.get("token"); // 쿠키에서 토큰 가져오기
        console.log("로그인요청");
        console.log(token);
        const response = await axios.get(
          "https://mofit.bobfriend.site:8080/mofit/rooms",
          { headers: { Authorization: `Bearer ${token}` } } // headers에 토큰 추가
        );
        console.log(response.data);
        setRoomList((roomList) => [...roomList, ...response.data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateRoom = (roomName) => {
    router.push(`/room/${roomName}`);
  };

  const handleRoomEnter = (roomId) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center">
        <div className="w-full mt-5 overflow-x-auto" style={{ width: "90vw" }}>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
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
                  <td className="py-2 px-4 text-center">{room.participant}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-green-500 text-white font-bold py-2 px-4 rounded-md mx-auto block"
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
        </div>
        <button
          className="fixed bottom-20 right-20 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center"
          onClick={handleOpenModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateRoom={handleCreateRoom}
      />
    </>
  );
}

export default RoomList;
