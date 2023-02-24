import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // https://mofit.bobfriend.site:8080/login
    try {
      const response = await axios.post("/mofit/login", {
        account: username,
        password: password,
      }).then(

      )

      // 서버에서 받은 토큰을 쿠키에 저장
      Cookies.set("token", response.data.token.access_token);
      Cookies.set("refresh", response.data.token.refresh_token);
      // 로그인에 성공하면 메인화면으로 이동
      router.push("/room");
    } catch (error) {
      console.error(error);
      const { response } = error;
      if (response) {
        //모달
        switch (response.status) {
          case 401:
            // 텍스트만 변경
            window.alert("인증되지 않은 사용자입니다.");
            break;
          case 403:
            // 이전페이지로 리다이렉트
            window.alert("접근 권한이 없습니다.");
            break;
          case 500:
            window.alert("서버 오류가 발생했습니다.");
            break;
          default:
            console.log("Unexpected Error");
        }
      }
    }
  };

  const router = useRouter();

  const handleRegisterClick = () => {
    router.push("/signup");
  };

  const handleNaverLoginClick = () => {
    window.location.href = "https://openapi.naver.com/v1/nid/me";
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <img
        className="mx-auto h-12 w-auto"
        src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png"
        alt="Your Company"
      ></img>
      <h1 className="text-4xl font-bold text-center text-green-800">Mofit</h1>
      <form
        className="bg-white rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}

      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            아이디
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            username="username"
            type="text"
            value={username}
            onChange={(event) => setEmail(event.target.value)}
            placeholder=""
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            비밀번호
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            username="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder=""
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            로그인
          </button>
        </div>

        <div className="flex justify-end mt-4 mb-4">
          <a
            className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800"
            href="#"
            onClick={handleRegisterClick}
          >
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
}
