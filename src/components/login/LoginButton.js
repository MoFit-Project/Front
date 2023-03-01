import { motion } from "framer-motion"

export default function LoginButton() {

    return (

        <div className="text-center">
            < button
                className=" w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
            >
                로그인
            </button >

            <style jsx>{`
                    button:active {
                        transform: translateY(3px);
                        border-bottom:2px solid #0081C9;
                    }
                    .room-tag {
                        background-color: #86E5FF;
                        transition:all 0.1s;
                        border-bottom:5px solid #0081C9;
                    }

                    .room-elem {
                        box-shadow: 1px 2px;
                    }
                    button{
                        background-color: #0014FF;
                        transition:all 0.1s;
                        border-bottom:5px solid #000000;
                        font-size: 18px;
                    }
                `}</style>
        </div >
    )
}