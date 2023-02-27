import Background from "../components/Background";
import LayoutAuthenticated from "../components/LayoutAuthticated";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
    return (
        <LayoutAuthenticated>
            <title>
                MOFIT 모드 선택
            </title>
            <div className="flex h-full justify-center items-center">
                <div>
                    <Background />
                </div>
                <div >
                    <div className="text-center">
                        <Link href={'/single-mode'}>
                            <button
                                className="w-full bg-green-500 py-8 hover:bg-green-700 text-white mb-6 font-bold text-3xl px-4 rounded-full focus:outline-none focus:shadow-outline"
                            >
                                싱글 플레이
                            </button>
                        </Link>
                        <Link href={'/room'}>
                            <button
                                className="w-full bg-green-500 py-8 hover:bg-green-700 text-white mt-6 font-bold text-3xl px-4 rounded-full focus:outline-none focus:shadow-outline"
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