import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";
import axios from "axios";
import CreateRoomModal from "../../components/CreateRoomModal";
import Cookies from "js-cookie";
import LayoutAuthenticated from "../../components/LayoutAuthticated";

export default function RoomList() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomList, setRoomList] = useState([]);

  const fetchRooms = async () => {
    try {
      const token = Cookies.get("token"); // 쿠키에서 토큰 가져오기
      const response = await axios.get(
        API_URL + "/rooms",
        { headers: { Authorization: `Bearer ${token}` } } // headers에 토큰 추가
      );

      setRoomList((roomList) => [...roomList, ...response.data]);
    } catch (error) {
      console.error(error);
      const { response } = error;
      if (response) {
        //모달
        switch (response.status) {
          case 401:
            // 엑세스 토큰 만료 || 없거나
            //////////////////////// 예시
            // refresh 토큰이 있다면, access가 만료된 것을 의미한다.

            // -> /refresh POST 요청
            // 헤더 불필요
            // 바디에 refresh 토큰 보내기
            // JSON 양식 {refresh_token : ""}
            // 응답 받았을 때,
            // 성공일 때, 데이터가 존재할 때 Cookies.set('token') access토큰을 받는다
            //          데이터가 존재하지 않을 때, 로그인 페이지로
            // error 무조건 로그인 페이지

            refreshToken();

            // window.alert("인증되지 않은 사용자입니다.");
            break;
          case 403:
            // 이전페이지로 리다이렉트
            window.alert("접근 권한이 없습니다.");
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

  useEffect(() => {
    fetchRooms();
  }, []);
  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get("refresh");

      if (!refreshToken) router.push("/login");

      const response = await axios.post(API_URL + "/refresh", {
        access_token: Cookies.get("token"), // 수정해라 안주홍
        refresh_token: refreshToken,
      });

      const { access_token } = response.data;

      Cookies.set("token", access_token);

      console.log("Token is refreshed!");
    } catch (error) {
      console.error(error);
      Cookies.remove("token");
      Cookies.remove("refresh");
      console.log("Token is removed!");
      router.push("/");
    }
  };

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
      <LayoutAuthenticated>
        <title>MOFIT 멀티 게임</title>
        <Navbar>
          <div className="flex flex-col items-center justify-end">
            <div className="mt-2" style={{ width: "60vw" }}>
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
                      <td className="py-2 px-4 text-center">
                        {room.participant}
                      </td>
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
            <div className="ml-auto">
              <button
                className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center"
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
        </Navbar>
        <CreateRoomModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </LayoutAuthenticated>
    </>
  );
}
