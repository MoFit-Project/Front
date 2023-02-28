
import { destroyCookie } from "nookies";
import Cookies from "js-cookie";
import Router from "next/router";

export default function LogoutButton() {

    const handleLogout = () => {
        // 토큰과 리프레시 토큰 삭제
        Cookies.remove("token");
        Cookies.remove("refresh");

        // 로그인 페이지로 이동
        Router.push("/login");
    };

    return (
        <button className="px-4 py-2 leading-none rounded text-teal-200 border-black hover:text-white pl-0" onClick={handleLogout}>로그아웃</button>
    );
}
