import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Result(props) {
  const [names] = useState(props.names);
  const [scores] = useState(props.scores);

  const handleClick = async () => {
    try {
      const response = await axios.post('/mofit/result', {
        userid: names,
        score: scores
      });
      console.log(response.data);
      // 서버로부터 받은 응답에 대한 처리를 여기에 작성
    } catch (error) {
      console.error(error);
      // 에러 처리를 여기에 작성
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 w-2/5">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">게임 결과</h1>
        {names.map((name, index) => (
          <div className="flex justify-between items-center mb-4" key={index}>
            <span className="text-gray-700">NICKNAME:</span>
            <span className="text-gray-900 font-bold">{name}</span>
            <span className="text-gray-700">SCORE:</span>
            <span className="text-gray-900 font-bold">{scores[index]}</span>
          </div>
        ))}
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
          확인
        </button>
      </div>
    </div>
  );
}
