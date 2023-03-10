import React, {useState, useEffect} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import Cookies from "js-cookie";
import Head from "next/head";

export default function Result(props) {
    // const [names] = useState("john");
    // const [results] = useState("win");

    const handleClick = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const assessToken = Cookies.get("token");
        console.log("@@@@@@@@@@@" + props.scores.toString());
        try {
            const response = await axios.post(API_URL + '/result/single', {
                    userId: `${localStorage.getItem("username")}`,
                    score: props.scores.toString()
                },
                {
                    headers: {Authorization: `Bearer ${assessToken}`}
                });
            console.log(response.data);
            props.setIsModalClose(true);
            // 서버로부터 받은 응답에 대한 처리를 여기에 작성
        } catch (error) {
            console.error(error);
            // 에러 처리를 여기에 작성
        }
    }

    return (

        <motion.div
            className="fixed top-0 left-0 w-full h-full  bg-opacity-50 z-10 flex items-center justify-center"
            initial={{y: "100%"}}
            animate={{y: 0}}
            transition={{duration: 1.5}}
        >
            <Head>
                <audio autoPlay loop>
                    <source src="/assets/sound/clap.mp3" type="audio/mpeg"/>
                </audio>
            </Head>
            {/*<div className="flex items-center justify-center">*/}
            {/*  <div*/}
            {/*      className="bg-modal rounded-lg shadow-xl p-8 flex flex-col items-start justify-center"*/}
            {/*  >*/}
            {/*    <h1 className="text-7xl font-bold text-gray-800 text-left mt-16 ml-16">*/}
            {/*      🥇 COMPLETE!*/}
            {/*    </h1>*/}
            {/*    <h1 className="text-7xl font-bold text-gray-800 text-left mt-16 ml-16">*/}
            {/*      기록 : {props.scores}초*/}
            {/*    </h1>*/}

            <div className="flex items-center justify-center">
                <div className="bg-modal rounded-lg shadow-xl p-8 flex flex-col items-center justify-center"
                >
                    <h1 className="text-7xl font-bold text-gray-800 text-center mt-6">🥇 COMPLETE!</h1>
                    <h1 className="text-7xl font-bold text-gray-800 text-center mt-6">기록 : {props.scores} 초</h1>
                    {/* {names.map((name, index) => ( */}
                    {/* <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700"></span>
              <span className="text-gray-900 font-bold">{names}</span>
              <span className="text-gray-700"></span>
              <span className="text-gray-900 font-bold">{results}</span>
              <span className={`text-gray-900 font-bold ${results[index] ? "text-green-500" : "text-red-500"}`}>
                {results[index] ? "Win" : "Lose"}
              </span>
              
            </div> */}
                    {/* ))} */}
                    <button className="btn-1 text-white font-bold py-4 px-10 rounded-full ml-16 mt-6"
                            onClick={handleClick}>
                        확인
                    </button>
                </div>
                <style jsx>{`
                  .btn-1 {
                    background: rgb(6, 14, 131);
                    background: linear-gradient(0deg,
                    rgba(6, 14, 131, 1) 0%,
                    rgba(12, 25, 180, 1) 100%);
                    border: none;
                    font-size: 2rem;
                  }

                  .btn-1:hover {
                    background: rgb(0, 3, 255);
                    background: linear-gradient(0deg,
                    rgba(0, 3, 255, 1) 0%,
                    rgba(2, 126, 251, 1) 100%);
                  }

                  .bg-modal {
                    box-shadow: 0px 0px 50px 40px rgba(7, 140, 229, 0.57), 0px 0px 30px 10px rgba(40, 0, 255, 0.6);
                    width: 1000px;
                    height: 400px;
                    // background-image: url('/result-img.jpg');
                    background-image: url('/resultImgSingle.png');
                    background-size: cover;
                    background-position: bottom;
                    position: absolute;
                    bottom: 20px;
                    right: 100px;
                  }
                `}</style>
            </div>
        </motion.div>
    );
}
