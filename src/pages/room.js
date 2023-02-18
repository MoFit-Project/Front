import { useState } from 'react';

const rooms = [
  { id: 1, name: '게임 방 1', participants: 4, started: false },
  { id: 2, name: '게임 방 2', participants: 2, started: false },
  { id: 3, name: '게임 방 3', participants: 3, started: true },
  { id: 4, name: '게임 방 4', participants: 1, started: false },
  { id: 5, name: '게임 방 5', participants: 4, started: true },
];

const RoomList = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col items-center style={{ width: '90vw' }}">      
      <div className="w-full mt-5 overflow-x-auto style={{ width: '90vw' }}">
        <table className="w-full table-auto style={{ width: '90vw' }}">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="w-1/4 py-2 px-4">방 제목</th>
              <th className="w-1/4 py-2 px-4">참여 인원</th>
              <th className="w-1/4 py-2 px-4">상태</th>
              <th className="w-1/4 py-2 px-4">액션</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                <td className="py-2 px-4 text-center">{room.name}</td>
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
          <button className="fixed bottom-4 right-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </table>
      </div>
      <button className="fixed bottom-4 right-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};

export default RoomList;
