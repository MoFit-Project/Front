import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Result() {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    axios
      .get("https://")
      .then((response) => {
        setName(response.data.name);
        setScore(response.data.score);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 w-2/5">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">게임 결과</h1>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700">Player:</span>
          <span className="text-gray-900 font-bold">{name}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700">Score:</span>
          <span className="text-gray-900 font-bold">{score}</span>
        </div>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          확인
        </button>
      </div>
    </div>
  );
}