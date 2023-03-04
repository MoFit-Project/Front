import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../recoil/states";
import { currSessionId } from "../recoil/currSessionId";
import { inroomState } from "../recoil/imroomState";
import { motion } from "framer-motion";
import { refreshToken } from "public/refreshToken";
import Swal from 'sweetalert2'

function CreateRoomModal({ isOpen, onClose }) {
  const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const [isRoomNameEmpty, setIsRoomNameEmpty] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [currSession, setCurrSessionId] = useRecoilState(currSessionId);
  const [myInRoomState, setInRoomState] = useRecoilState(inroomState);

  const userIdRef = useRef('');

  useEffect(() => {
    if (window)
      userIdRef.current = localStorage.getItem("username");
  }, [userIdRef.current]);

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
  useEffect(() => {
    if (currSession) {

    }
  }, [currSession])


  const createRoom = async (customSessionId) => {
    setCurrSessionId(customSessionId);
    setIsRoomHost({ roomName: customSessionId, isHost: true });

    const assessToken = Cookies.get("token");
    try {
      // const response = await axios.get(API_URL + `/create/${customSessionId}`, {
      //   headers: { Authorization: `Bearer ${assessToken}` },
      // });
      console.log(userIdRef.current)
      const response = await axios.post(API_URL + `/create/${customSessionId}`, {
        userId: userIdRef.current,
        mode: 'squat'     // TODO: select 시간 추가하기.
      }, {
        headers: { Authorization: `Bearer ${assessToken}` }
      });
      setInRoomState(1);
      console.log("create Room : " + userIdRef.current + " make " + customSessionId);
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
            Swal.fire({
              icon: 'error',
              text: '이미 존재하는 방입니다.'
            })
            break;
          default:
            Swal.fire({
              icon: 'error',
              text: '알 수 없는 에러가 발생했습니다.'
            })
        }
      }
    }
  };

  const handleChangeRoomName = (event) => {
    setRoomName(event.target.value);
  };

  return (
    isOpen && (

      <div className="fixed top-0 left-0 w-full h-full z-10 flex items-center justify-center">
        <div className="bg-modal p-5 rounded-lg border-8 border-indigo-500">
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
              placeholder=""
              value={roomName}
              onChange={handleChangeRoomName}
            />
            {isRoomNameEmpty && (
              <div style={{ color: "red" }}>방이름을 입력해 주세요</div>
            )}
            <div className="flex">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
                type="submit"
              >
                방 만들기
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded"
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
          .bg-modal {
            background-image: linear-gradient(to right, #E1EEDD, #BFDCE5);
          }
          
        `}</style>
      </div >
      // </motion.div>
    )
  );
}

export default CreateRoomModal;
