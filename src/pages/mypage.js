import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import LayoutAuthenticated from "../components/LayoutAuthticated";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";


export default function MyPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    // if (!token) router.push("/login");
    let username = window.localStorage.getItem('username');
    console.log(username)
    setUsername(username)
    }, [])


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assessToken = Cookies.get("token");

    try {
      console.log("@@@@@@@@@@@@@@@@@@@@@")
      const response = await axios.post(API_URL + `/user/${username}`,
      { password: password },
      {
        headers: { Authorization: `Bearer ${assessToken}` },
      });
      console.log(response)
      console.log("@@@@@@@@@@@@@@@@@@@@@")
      window.alert("비밀번호 변경에 성공했습니다")
      router.push("/room")


      } catch (error) {
        const { response } = error;
        if (response) {
            switch (response.status) {
                case 400:
                    window.alert(response.data)
                    break;
                case 501:
                    window.alert(response.data)
                    break;
                default:
                    console.log("Unexpected Error");
            }
        }
    }
  };

  return (
    <div className="background-div " style={{
    }}>
      <>
      <LayoutAuthenticated>
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
              type="text"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={username}
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
              className="text-white font-bold py-2 px-4 rounded-md hover:bg-teal-800 btn-1"
            >
              확인
            </button>
          </div>
        </form>
      </div>
      </LayoutAuthenticated>
    </>
    <style jsx>{`
    .background-div {
      background-image: url('background-img.jpg');
      background-size: cover;
      background-position: center;
      overflow: hidden;
      z-inex: -1,
    }

    table {
      border: 10px solid #0D4C92;
      background: linear-gradient(to right, #0096FF, #00D7FF);
    }
    .btn-1 {
      background: rgb(6,14,131);
      background: linear-gradient(0deg, rgba(6,14,131,1) 0%, rgba(12,25,180,1) 100%);
      border: none;
    }
    .btn-1:hover {
       background: rgb(0,3,255);
    background: linear-gradient(0deg, rgba(0,3,255,1) 0%, rgba(2,126,251,1) 100%);
    }
    `}</style>
  </div>
  );
}