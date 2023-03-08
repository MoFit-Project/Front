import Background from "../components/backgrounds/SelectBackground";
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
            <div className="flex justify-center items-center">
                <Background>
                    <div className= "select-modal">
                        <div className="text-center">
                            <Link href={'/single-mode'}>
                                <button
                                    className="w-full py-10 text-white mb-6 font-bold text-5xl px-8 rounded-full focus:outline-none focus:shadow-outline btn-1 btn-10"
                                >
                                    싱글 플레이
                                </button>
                            </Link>
                            <Link href={'/room'}>
                                <button
                                    className="w-full py-10 text-white mt-6 font-bold text-5xl px-8 rounded-full focus:outline-none focus:shadow-outline btn-1 btn-10"
                                >
                                    멀티 플레이
                                </button>
                            </Link>
                        </div>
                    </div>
                </Background>

                <style jsx>{`
                  .btn-1 {
                    background: rgb(6, 14, 131);
                    background: linear-gradient(0deg, rgba(6, 14, 131, 1) 0%, rgba(12, 25, 180, 1) 100%);
                    border-bottom: 7px solid rgb(1, 2, 15);
                  }

                  .btn-1:active {
                    transform: translateY(4px);
                    border-bottom: 2px solid rgb(14, 19, 83);
                  }

                  .btn-1:hover {
                    background: rgb(0, 3, 255);
                    background: linear-gradient(0deg, rgba(0, 3, 255, 1) 0%, rgba(2, 126, 251, 1) 100%);
                  }

                  .btn-10 {
                    width: 90%;

                  }
                `}</style>
            </div>
            </Navbar>
        </LayoutAuthenticated>
    );
}