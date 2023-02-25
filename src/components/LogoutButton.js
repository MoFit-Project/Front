
import { destroyCookie } from "nookies";
import Cookies from "js-cookie";
import Router from "next/router";

export default function LogoutButton() {

    const handleLogout = () => {
        // 토큰과 리프레시 토큰 삭제
        Cookies.remove("token");
        Cookies.remove("refreshToken");

        // 로그인 페이지로 이동
        Router.push("/login");
    };

    return (
        <button className="bg-green-800 text-white font-bold py-1 px-3 ml-12 rounded-md block mt-1" onClick={handleLogout}>로그아웃</button>
    );
}
