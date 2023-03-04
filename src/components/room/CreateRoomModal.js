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
import Loading from './../Loading';

Modal.setAppElement('#__next');
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Spinner = () => {
	return (
		<div className="spinner-container">
			<div className="spinner"></div>
		</div>
	);
}

export default function CreateRoomModal({ isOpen, onClose }) {
	const router = useRouter();
	const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
	const [roomName, setRoomName] = useState("");
	const [isRoomNameEmpty, setIsRoomNameEmpty] = useState(false);

	const [currSession, setCurrSessionId] = useRecoilState(currSessionId);
	const [myInRoomState, setInRoomState] = useRecoilState(inroomState);

	const userIdRef = useRef('');
	const [isLoading, setIsLoading] = useState(false);
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
		setCurrSessionId(customSessionId);
		const assessToken = Cookies.get("token");
		try {
			setIsLoading(true); // 로딩 상태 변경
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
		} finally {
			setIsLoading(false); // 로딩 상태 변경
		}
	}
	return (
		<>
			{isLoading ? <div><Loading />asdasdas</div> : null}
			<Modal
				portalClassName="custom-modal"
				isOpen={isOpen}
				onRequestClose={onClose}
				contentLabel="Create Room Modal"
				style={{
					overlay: {
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(255, 255, 255, 0.75)'
					},
					content: {
						position: 'absolute',
						top: '40px',
						left: '40px',
						right: '40px',
						bottom: '40px',
						border: '1px solid #ccc',
						background: '#fff',
						overflow: 'auto',
						WebkitOverflowScrolling: 'touch',
						borderRadius: '4px',
						outline: 'none',
						padding: '20px',
						width: '300px',
						boxShadow: '1px 1px 1px 1px black'

					}
				}}
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
					setRoomName('');
				}}>취소</button>
				{isRoomNameEmpty && (
					<div style={{ color: "red" }}>방이름을 입력해 주세요</div>
				)}
			</Modal>

			<style jsx>{`
					.custom-modal{
						background-color: white;
						border-radius: 5px;
						box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
						padding: 20px;
						width: 10px;
					}

					.spinner-container {
						position: fixed;
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
						background-color: rgba(255, 255, 255, 0.8);
						display: flex;
						justify-content: center;
						align-items: center;
						}

						.spinner {
						border: 4px solid rgba(0, 0, 0, 0.1);
						border-left-color: #798
				
				`}</style>
		</>

	);
}

