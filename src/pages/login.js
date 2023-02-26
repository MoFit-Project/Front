import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import Background from "../components/Background";
import { createPoseDetector } from "public/createPoseDetector";
import { useRecoilState } from "recoil";
import { poseDetector } from "../recoil/states.js";


export default function Login() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginFail, setIsLoginFail] = useState(false);
    const router = useRouter();
    //const [detector, setPoseDetector] = useRecoilState(poseDetector);

    const checkIfLoggedIn = () => {
        const token = Cookies.get("token");
        if (token) {
            router.push("/");
        }
    }

    useEffect(() => {
        //setPoseDetector(createPoseDetector());
        checkIfLoggedIn();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // https://mofit.bobfriend.site:8080/mofit/login
        try {
            const response = await axios.post(API_URL + "/login", {
                account: username,
                password: password,
            })

            // 서버에서 받은 토큰을 쿠키에 저장
            Cookies.set("token", response.data.token.access_token);
            Cookies.set("refresh", response.data.token.refresh_token);
            // 로그인에 성공하면 메인화면으로 이동
            router.push("/");

        } catch (error) {

            console.error(error);
            const { response } = error;
            if (response) {
                switch (response.status) {
                    case 401:
                        // 텍스트만 변경
                        setIsLoginFail(true);
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

    return (
        <div>

            <title>MOFIT 로그인</title>

            <div>
                <Background />
            </div>
            <div className="max-w-md mx-auto mt-10">
                <img
                    className="mx-auto h-12 w-auto"
                    src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png"
                    alt="Your Company"
                ></img>
                <h1 className="text-4xl font-bold text-center text-green-800">Mofit</h1>
                <form
                    className="rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={handleSubmit}

                >
                    <div className="mb-4">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            username="username"
                            type="text"
                            value={username}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="아이디"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            username="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="비밀번호"
                        />
                        {
                            isLoginFail &&
                            <p style={{ color: 'red' }}>
                                아이디와 비밀번호를 확인해주세요.
                            </p>
                        }
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
                        <Link href={'/signup'} legacyBehavior>
                            < a
                                className="inline-block align-baseline font-bold text-md text-black-500"
                            >
                                회원가입
                            </a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>

    );

}
