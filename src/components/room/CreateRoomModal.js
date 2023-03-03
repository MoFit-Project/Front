import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
import { motion } from "framer-motion";
import { refreshToken } from "public/refreshToken";


export default function CreateRoomModal({ isOpen, onClose }) {

	const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
	const [roomName, setRoomName] = useState("");
	const router = useRouter();
	const [isRoomNameEmpty, setIsRoomNameEmpty] = useState(false);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!roomName) {
			setIsRoomNameEmpty(true);
		} else {
			createRoom(roomName);
			setRoomName("");
			setIsRoomNameEmpty(false);
		}
	};

	// useEffect(() => {
	//   console.log(isRoomHost);
	// }, [isRoomHost])

	const createRoom = async (customSessionId) => {

		setIsRoomHost({ roomName: customSessionId, isHost: true });

		const assessToken = Cookies.get("token");
		try {
			const response = await axios.get(API_URL + `/create/${customSessionId}`, {
				headers: { Authorization: `Bearer ${assessToken}` },
			});

			router.push(`/room/${response.data}`);
		} catch (error) {
			console.log(error);
			const { response } = error;
			if (response) {
				switch (response.status) {
					case 401:
						refreshToken();
						break;
					case 302:
						alert("이미 존재하는 방입니다.");
						break;
					default:
						console.log("Unexpected Error");
				}
			}
		}
	}

	return (
		<>
			<div className="modal-container">
				<div className="title-box">
					<h1 className="modal-title">방만들기</h1>
				</div>
				<div className="modal-box">
					<div className="input-box">
						<div className="room-name-label-box">
							<label htmlFor="room-name">방제목</label>
						</div>
						<input type="text" id="fname" name="room-name" className="room-name" />
						<div className="mode-box">
							<div className="mode-label-box">
								<span>모드</span>
							</div>
							<select className="mode-selector">
								<option className="option">스쿼트</option>
								<option className="option">푸쉬업</option>
								<option className="option">버피 테스트</option>
							</select>
						</div>
					</div>
					<div className="btn-box">
						<button className="confirm-btn">확인</button>
						<button className="cancel-btn">취소</button>
					</div>
				</div>

			</div>

			<style jsx>{`
				
				.modal-container{
                    background-color: #12DEFF;
					width: 480px;
					height: 240px;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 1px 1px 1px 1px;
				}
				.modal-box{
                    box-shadow: .4px .4px .4px .4px #053b58;
					background-color: #0ABDFF;
					width: 100%;
					height: 150px;
					border-radius: 10px;
					padding: 10px;
					position: relative;
				}
				.room-name{
					border: 1px solid black;
					border-radius: 3px;
					padding: 2px 0px;
					width: 76%;
				}
				.title-box{
					margin-bottom: 5px;
				}
				.modal-title{
					font-size: 32px;
					color: white;
				}
				.room-name-label-box{
                    box-shadow: .4px .4px .4px .4px inset #053b58;
					display: inline-block;
					color: white;
					margin-right: 5px;
					font-size: 14px;
                    background-color: #0081C9;
					padding: 3px 25px;
					border-radius: 5px;
				}
				.mode-selector{
					width: 76%;
					padding: 3px 0px;
					border-radius: 3px;
				}
				.mode-label-box{
                    box-shadow: .4px .4px .4px .4px inset #053b58;
					display: inline-block;
					color: white;
					margin-right: 5px;
					font-size: 14px;
                    background-color: #0081C9;
					padding: 3px 32px;
					border-radius: 5px;
				}
				.mode-box{
					margin-top: 10px;
				}
				.btn-box{
					top:0;right:0;bottom:0;left:0;
					display: flex;
					justify-content: center;
				}
				.confirm-btn{
					margin-right: 20px;
					padding: 5px 30px;
					border: 1px solid black;
				}

				.cancel-btn{
					margin-left: 20px;
					padding: 5px 30px;
					border: 1px solid black;
				}
        
        `}</style>
		</>

	)
}

