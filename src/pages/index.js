import Background from "../components/Background";
import LayoutAuthenticated from "../components/LayoutAuthticated";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {

    return (
        <LayoutAuthenticated>
            <Navbar>
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
                                className="w-full bg-green-500 py-8 hover:bg-green-700 text-white mb-6 font-bold text-3xl px-4 rounded-full focus:outline-none focus:shadow-outline btn-1"
                            >
                                싱글 플레이
                            </button>
                        </Link>
                        <Link href={'/room'}>
                            <button
                                className="w-full py-8 text-white mt-6 font-bold text-3xl px-4 rounded-full focus:outline-none focus:shadow-outline btn-1"
                            >
                                멀티 플레이
                            </button>
                        </Link>
                    </div>

                </div>
                <style jsx>{`
                  .btn-1 {
                      background: rgb(6,14,131);
                      background: linear-gradient(0deg, rgba(6,14,131,1) 0%, rgba(12,25,180,1) 100%);
                      border-bottom:7px solid rgb(1, 2, 15);
                    }

                    .btn-1:active {
                        transform: translateY(4px);
                        border-bottom:2px solid rgb(14, 19, 83);
                    }
                    .btn-1:hover {
                        background: rgb(0,3,255);
                        background: linear-gradient(0deg, rgba(0,3,255,1) 0%, rgba(2,126,251,1) 100%);
                    }


                    
                    `}</style>
            </div>
            </Navbar>
        </LayoutAuthenticated>
    );
}