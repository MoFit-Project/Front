import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../recoil/states";
import { refreshToken } from "public/refreshToken";

function CreateRoomModal({ isOpen, onClose }) {
  const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const [isRoomNameEmpty, setIsRoomNameEmpty] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!roomName) {
      setIsRoomNameEmpty(true);
    } else {
      createRoom(roomName);
      setRoomName("");
      setIsRoomNameEmpty(false);
    }
  };

  const createRoom = async (customSessionId) => {
    setIsRoomHost({ roomName: customSessionId, isHost: true });
    const assessToken = Cookies.get("token");
    try {
      const response = await axios.get(API_URL + `/create/${customSessionId}`, {
        headers: { Authorization: `Bearer ${assessToken}` },
      });

      router.push(`/room/${response.data}`);
    } catch (error) {
      console.log(error);
      const { response } = error;
      if (response) {
        switch (response.status) {
          case 401:
            refreshToken();
            break;
          case 302:
            alert("이미 존재하는 방입니다.");
            break;
          default:
            console.log("Unexpected Error");
        }
      }
    }
  };

  const handleChangeRoomName = (event) => {
    setRoomName(event.target.value);
  };

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 z-10 flex items-center justify-center">
        <div className="bg-white p-5 rounded-lg">
          <h2 className="text-xl font-bold mb-5">방 생성하기</h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="mb-2 font-bold" htmlFor="roomName">
              방 제목
            </label>
            <input
              className="py-2 px-3 border border-gray-300 rounded-lg mb-5"
              type="text"
              id="roomName"
              name="roomName"
              placeholder="방 제목을 입력하세요"
              value={roomName}
              onChange={handleChangeRoomName}
            />
            {isRoomNameEmpty && (
              <div style={{ color: "red" }}>방이름을 입력해 주세요</div>
            )}
            <div className="flex">
              <button
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-md block mr-3 btn-1"
                type="submit"
              >
                방 만들기
              </button>
              <button
                className="bg-red-500 text-white font-bold py-1 px-8 rounded-md block btn-5"
                onClick={onClose}
              >
                닫기
              </button>
            </div>
          </form>
        </div>
        <style jsx>{`
          .background-div {
            background-image: url("background-img.jpg");
            background-size: cover;
            background-position: center;
            overflow: hidden;
            z-inex: -1;
          }
        `}</style>
      </div>
    )
  );
}

export default CreateRoomModal;
