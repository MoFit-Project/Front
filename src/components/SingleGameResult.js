import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Result(props) {
  const [names] = useState(props.names);
  const [results] = useState(props.results);

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
      <div className="bg-modal rounded-lg shadow-xl p-8 w-1/5 border-8 border-indigo-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">게임 결과</h1>
        {names.map((name, index) => (
          <div className="flex justify-between items-center mb-4" key={index}>
            <span className="text-gray-700">ID:</span>
            <span className="text-gray-900 font-bold">{name}</span>
            <span className="text-gray-700">Result:</span>
            <span className="text-gray-900 font-bold">{results[index]}</span>
            {/* <span className={`text-gray-900 font-bold ${results[index] ? "text-green-500" : "text-red-500"}`}>
              {results[index] ? "Win" : "Lose"}
            </span> */}
            
          </div>
        ))}
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded btn-1" onClick={handleClick}>
          확인
        </button>
      </div>
      <style jsx>{`
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
        .bg-modal {
          background-image: linear-gradient(to right, #E1EEDD, #BFDCE5);
        }
      `}</style>
    </div>
  );
}
