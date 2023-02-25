import { useRouter } from "next/router";
import Background from "../components/Background";
import LayoutAuthenticated from "../components/LayoutAuthticated";
import Link from "next/link";

// export default function ProtectedPage() {
//     useEffect(() => {
//         const token = Cookies.get("token");

//         if (!token) {
//             // 로그인 페이지로 이동
//             Router.push("/login");
//         }
//     }, []);
//     return <ModeSelect />
// }

export default function Home() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (
        <LayoutAuthenticated>
            <div>
                <div>
                    <Background />
                </div>
                <div className="max-w-md mx-auto mt-10">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png"
                        alt="Your Company"
                    ></img>
                    <h1 className="text-4xl font-bold text-center mb-8 text-green-700">
                        Mofit
                    </h1>
                    <div className="text-center">
                        <Link href={'/singleMode'}>
                            <button type={"button"}
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                싱글 플레이
                            </button>
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link href={'/room'}>
                            <button type={"button"}
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                멀티 플레이
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </LayoutAuthenticated>
    );
}