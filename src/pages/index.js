import {useRouter} from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Home() {
    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (token) {
            // 이미 로그인한 경우에는 메인 페이지로 이동시키기
            router.push("/room");
        } else {
            // 로그인되어 있지 않은 경우 로그인 페이지로 이동시키기
            router.push("/login");
        }
    }, []);

    return null; // or any other component to render
}
