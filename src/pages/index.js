import Background from "../components/Background";
import LayoutAuthenticated from "../components/LayoutAuthticated";
import Link from "next/link";

export default function Home() {
    return (
        <LayoutAuthenticated>
            <div className="container flex justify-center items-center h-screen">
                <div>
                    <Background />
                </div>
                <div >
                    <div className="text-center" style={{ width: '30vw' }}>
                        <Link href={'/single-mode'}>
                            <button
                                className="w-full bg-green-500 hover:bg-green-700 text-white h-20 mb-10 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                싱글 플레이
                            </button>
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link href={'/room'}>
                            <button
                                className="w-full bg-green-500 hover:bg-green-700 text-white h-20 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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