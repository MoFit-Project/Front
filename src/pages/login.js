import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import Background from "../components/backgrounds/LoginBackground";
import LoginButton from "../components/login/LoginButton";
import SignupButton from "../components/login/SignupButton";
import Swal from 'sweetalert2'



export default function Login() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginFail, setIsLoginFail] = useState(false);
    const router = useRouter();

    const checkIfLoggedIn = () => {
        const token = Cookies.get("token");
    };

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // router.push("/");

        try {
            const response = await axios.post(API_URL + "/login", {
                account: username,
                password: password,
            });

            Cookies.set("token", response.data.token.access_token);
            Cookies.set("refresh", response.data.token.refresh_token);

            setIsLoginFail(false);
            window.localStorage.setItem('username', username);

            await router.push("/");

        } catch (error) {
            const { response } = error;
            if (response) {
                switch (response.status) {
                    case 401:
                        // 텍스트만 변경
                        setIsLoginFail(true);
                        break;
                    case 403:
                        // 이전페이지로 리다이렉트
                        Swal.fire({
                            icon: 'error',
                            text: '접근 권한이 없습니다.'
                        })
                        router.back();
                        break;
                    case 500:
                        Swal.fire({
                            icon: 'error',
                            text: '서버 에러가 발생했습니다.'
                        })
                        break;
                    default:
                        Swal.fire({
                            icon: 'error',
                            text: '알 수 없는 에러가 발생했습니다.'
                        })
                }
            }
        }
        // event.preventDefault();
        // router.push("/");
    };

    return (
        <div className="flex w-screen h-screen justify-center items-center">
            <title>MOFIT 로그인</title>
                <Background>
            <div className="max-w-md mt-10 w-full login-modal">
                <h1 className="mb-1 text-9xl font-bold text-center text-blue-800">MOFIT</h1>
                <form className="rounded px-26 pt-6 pb-28 mb-2 login-form" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <input
                            className="shadow appearance-none border rounded w-full py-7 px-3 text-4xl text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            username="username"
                            type="text"
                            value={username}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="아이디"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="shadow appearance-none border rounded w-full py-7 px-3 text-4xl text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            username="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="비밀번호"
                        />
                        {isLoginFail && (
                            <p style={{ color: "red" }}>아이디와 비밀번호를 확인해주세요.</p>
                        )}
                    </div>
                    <LoginButton />
                    {/* <SignupButton /> */}
                    <div className="flex justify-end mt-4 mb-4">
                        <Link href={"/signup"} legacyBehavior>
                            <a className="inline-block align-baseline font-bold mt-5 text-5xl text-black-500">
                                회원가입
                            </a>
                        </Link>
                    </div>
                </form>
            </div>
            </Background>
            <style jsx>{`



            .login-modal{
              position: relative;
              top: -100px;
              width: 600px;
            
            }
             
            input {
                font-family: sans-serif;
            }
            
            
            

            `}
            </style>
        </div>
    );
}
