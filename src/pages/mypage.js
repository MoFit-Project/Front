import { useState } from "react";
import Navbar from "../components/Navbar"

export default function MyPage() {
  const [Id, setId] = useState("John");
  const [password, setPassword] = useState("");


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ Id, password });
  };

  return (
    <>
      <Navbar/>
      <div className="max-w-md mx-auto mt-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              아이디
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={Id}
              disabled
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              새로운 비밀번호
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-800"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </>
  );
}