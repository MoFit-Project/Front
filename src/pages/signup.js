import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Background from "../components/Background";

export default function SignupForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(API_URL + "/register", {
        account: id,
        nickname: nickname,
        password: password,
      }).then(response => {
        const check = response.data;
        if (check) {
          router.push("/login");
        } else {
          window.alert("이미 존재하는 계정입니다.");
        }
      })
    } catch (error) {
      window.alert("가입에 실패했습니다 다시 시도하세요");
      // 가입에 실패한 경우,
    }
  };

  return (
    <div>
      <title>
        MOFIT 회원가입
      </title>
      <div>
        <Background />
      </div>
      <div className="flex justify-center">
      <div className="max-w-md mx-auto mt-10" style={{ width: "70vw" }}>
        <img
          class="mx-auto h-12 w-auto"
          src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png"
          alt="Your Company"
        ></img>
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
          Mofit
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <input
              type="text"
              id="id"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="아이디"
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              id="nickname"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="닉네임"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
