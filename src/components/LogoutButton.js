
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
        <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0" onClick={handleLogout}>로그아웃</button>
    );
}
