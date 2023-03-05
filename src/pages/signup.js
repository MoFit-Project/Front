import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import Background from "../components/Background";
import Link from "next/link";
import SignupButton from "../components/login/SignupButton";
import LoginButton from "@/components/login/LoginButton";

export default function SignupForm() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post(API_URL + "/register", {
                account: id,
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

        <div className="flex w-screen h-screen justify-center items-center">
            <title>MOFIT 회원가입</title>
            <div>
                <Background/>
            </div>
            <div className="max-w-md mt-10 w-full login-modal">
                <h1 className="text-7xl font-bold text-center text-blue-800">회원가입</h1>
                <form className="rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            id="id"
                            className="appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="아이디"
                            value={id}
                            onChange={(event) => setId(event.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            id="password"
                            className="appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="text-center">
                        < button
                            className=" w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            가입하기
                        </button>


                    </div>
                    <div className="flex justify-end mt-4 mb-4">
                        <Link href={"/login"} legacyBehavior>
                            <a className="inline-block align-baseline font-bold text-lg text-black-500">
                                로그인으로 돌아가기
                            </a>
                        </Link>
                    </div>
                </form>
            </div>
            <style jsx>{`

              .login-modal {
                position: relative;
                top: -100px;

              }


              button:active {
                transform: translateY(3px);
                border-bottom: 2px solid #0081C9;
              }

              button {
                background-color: #0014FF;
                transition: all 0.1s;
                border-bottom: 5px solid #050141;
                font-size: 18px;
              }
            `}</style>
        </div>
    );
}
