import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import Background from "../components/Background";

export default function SignupForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("/mofit/register", {
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
      <div>
        <Background />
      </div>
    <div className="max-w-md mx-auto mt-10">
      <img
        class="mx-auto h-12 w-auto"
        src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png"
        alt="Your Company"
      ></img>
      <h1 className="text-4xl font-bold text-center mb-8 text-green-700">
        Mofit
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <label htmlFor="id" className="block text-gray-700 font-bold mb-2">
            아이디
          </label>
          <input
            type="text"
            id="id"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder=""
            value={id}
            onChange={(event) => setId(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="nickname"
            className="block text-gray-700 font-bold mb-2"
          >
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder=""
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder=""
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
      </div>
  );
}
