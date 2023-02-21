import { useState } from 'react';
import Navbar from '../components/Navbar'

const rooms = [
  { id: 1, name: '스쿼트왕', participants: 4, started: false },
  { id: 2, name: '한판 ㄱㄱ', participants: 2, started: false },
  { id: 3, name: '사람구함', participants: 3, started: true }

];

const RoomList = () => {
  const [selected, setSelected] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomList, setRoomList] = useState([]);


  // 모달창 열기 이벤트 핸들러
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달창 닫기 이벤트 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post('/api/rooms', { name: roomName });
      setRoomList([...roomList, response.data]);
      setRoomName('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeRoomName = (event) => {
    setRoomName(event.target.value);
  };

  // 모달창 표시를 위한 JSX
  const modal = (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 z-10 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg">
        <h2 className="text-xl font-bold mb-5">방 생성하기</h2>
        <form className="flex flex-col" onSubmit={handleCreateRoom}>
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
            <button className="bg-red-500 text-white font-bold py-1 px-7 rounded-md block" onClick={handleCloseModal}>
              닫기
            </button>
          </div>


        </form>
      </div>
    </div>
  );


  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center">
        <div className="w-full mt-5 overflow-x-auto" style={{ width: '90vw' }}>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="w-1/4 py-2 px-4">방 제목</th>
                <th className="w-1/4 py-2 px-4">참여 인원</th>
                <th className="w-1/4 py-2 px-4">상태</th>
                <th className="w-1/4 py-2 px-4">액션</th>
              </tr>
            </thead>

            <tbody>
              {roomList.map((room) => (
                <tr key={room.id} className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  <td className="py-2 px-4 text-center font-bold">{room.name}</td>
                  <td className="py-2 px-4 text-center">{room.participants} / 4</td>
                  <td className="py-2 px-4 text-center">
                    {room.started ? (
                      <span className="text-green-500 font-bold">게임 중</span>
                    ) : (
                      <span className="text-yellow-500 font-bold">대기 중</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-md mx-auto block">
                      참여하기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="fixed bottom-20 right-20 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center" onClick={handleOpenModal}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      {isModalOpen && modal}
    </>
  );
};

export default RoomList;
