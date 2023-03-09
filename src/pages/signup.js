import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import Background from "../components/backgrounds/SignUpBackground";
import Link from "next/link";
import SignupButton from "../components/login/SignupButton";
import LoginButton from "@/components/login/LoginButton";

export default function SignupForm() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUpFail, setIsSignUpFail] = useState(false);
	const [isIdLimit, setIsIdLimit] = useState(false);
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (id.trim() === "" || password.trim() === "") { // 아이디나 비밀번호가 공백인 경우
            setIsSignUpFail(true); // isSignUpFail 상태를 true로 업데이트합니다.
            return; // 함수 실행을 중지합니다.
        }
        if (id.length > 5) {
			setIsIdLimit(true);
			return;
		}

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
                <Background>
            <div className="max-w-md mt-10 w-full login-modal">
                <h1 className="text-8xl font-bold text-center text-blue-800">회원가입</h1>
                <form className="rounded px-26 pt-9 pb-24 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            id="id"
                            className="text-4xl appearance-none border rounded w-full py-7 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="아이디"
                            value={id}
                            onChange={(event) => setId(event.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            id="password"
                            className="text-4xl appearance-none border rounded w-full py-7 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    {isSignUpFail && (
                        <span className="text-red-600 text-sm">아이디와 비밀번호를 입력해주세요.</span>
                    )}
                    {isIdLimit && (
                        <span className="text-red-600 text-sm">아이디를 5글자이내로 입력해주세요.</span>
                    )}
                    <div className="text-center text-13xl">
                        < button
                            className=" w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                            "
                            type="submit"
                        >
                            가입하기
                        </button>


                    </div>
                    <div className="flex justify-end mt-4 mb-4">
                        <Link href={"/login"} legacyBehavior>
                            <a className="inline-block align-baseline font-bold mt-5 text-4xl text-black-500">
                                로그인으로 돌아가기
                            </a>
                        </Link>
                    </div>
                </form>
            </div>
            </Background>
            <style jsx>{`

              .login-modal {
                position: relative;
                top: -100px;
                width: 600px;

              }


              button:active {
                transform: translateY(3px);
                border-bottom: 2px solid #0081C9;
              }

              button {
                background-color: #0014FF;
                transition: all 0.1s;
                border-bottom: 5px solid #050141;
                font-size: 45px;
              }
              input {
                font-family: sans-serif;
            }
            `}</style>
        </div>
    );
}
