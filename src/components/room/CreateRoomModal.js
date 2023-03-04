import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
import { currSessionId } from "../../recoil/currSessionId";
import { inroomState } from "../../recoil/imroomState";
import { refreshToken } from "public/refreshToken";
import Swal from 'sweetalert2'
import Modal from 'react-modal';

Modal.setAppElement('#__next');

export default function CreateRoomModal({ isOpen, onClose }) {
	const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
	const [title, setTitle] = useState('');
	const [roomName, setRoomName] = useState("");
	const router = useRouter();
	const [isRoomNameEmpty, setIsRoomNameEmpty] = useState(false);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const [currSession, setCurrSessionId] = useRecoilState(currSessionId);
	const [myInRoomState, setInRoomState] = useRecoilState(inroomState);

	const userIdRef = useRef('');

	const [gameMode, setGameMode] = useState('스쿼트');
	const [gameTime, setGameTime] = useState(30);

	useEffect(() => {
		if (window)
			userIdRef.current = localStorage.getItem("username");
	}, [userIdRef.current]);

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
	const handleRoomNameChange = (e) => {
		setRoomName(e.target.value);
	};
	const handleGameTimeIncrease = () => {
		setGameTime((time) => time + 10);
	};

	const handleGameModeChange = (e) => {
		setGameMode(e.target.value);
	};

	const handleGameTimeChange = (e) => {
		setGameTime(e.target.value);
	};


	const createRoom = async (customSessionId) => {
		setIsRoomHost({ roomName: customSessionId, isHost: true });

		const assessToken = Cookies.get("token");
		try {
			const response = await axios.post(API_URL + `/create/${customSessionId}`,
				{
					userId: userIdRef.current,
					mode: gameMode,     // TODO: select 시간 추가하기.
					time: gameTime
				},
				{

					headers: { Authorization: `Bearer ${assessToken}` },
				},
			);
			setInRoomState(1);
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
						Swal.fire({
							icon: 'error',
							text: '이미 존재하는 방입니다.'
						})
						break;
					default:
						Swal.fire({
							icon: 'error',
							text: '알 수 없는 에러가 발생했습니다.'
						})
				}
			}
		}
	}
	return (
		<>
			<Modal
				isOpen={isOpen}
				onRequestClose={onClose}
				contentLabel="Create Room Modal"
			>
				<h2>방 만들기</h2>
				<div>
					<label>
						방 제목:
						<input type="text" value={roomName} onChange={handleRoomNameChange} />
					</label>
				</div>
				<div>
					<label>
						게임 모드:
						<select value={gameMode} onChange={handleGameModeChange}>
							<option value="스쿼트">스쿼트</option>
							<option value="푸쉬업">푸쉬업</option>
						</select>
					</label>
				</div>
				<div>
					<label>
						게임 시간:
						<input type="range" min="30" max="300" step="10" value={gameTime} onChange={handleGameTimeChange} />
						{gameTime}초
						<button onClick={handleGameTimeIncrease}>10초 추가</button>
					</label>
				</div>
				<button className="mr-5" onClick={handleSubmit}>확인</button>
				<button onClick={() => {
					onClose();
					setIsRoomNameEmpty(false);
					setTitle('');
				}}>취소</button>
				{isRoomNameEmpty && (
					<div style={{ color: "red" }}>방이름을 입력해 주세요</div>
				)}
			</Modal>
		</>

	)
}

