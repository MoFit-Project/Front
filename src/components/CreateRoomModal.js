import { useState } from "react";

function CreateRoomModal({ isOpen, onClose, onSubmit }) {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(roomName);
    setRoomName("");
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
            <div className="flex">
              <button
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-md block mr-3"
                type="submit"
              >
                방 만들기
              </button>
              <button
                className="bg-red-500 text-white font-bold py-1 px-7 rounded-md block"
                onClick={onClose}
              >
                닫기
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default CreateRoomModal;
