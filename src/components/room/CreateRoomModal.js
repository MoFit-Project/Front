import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
import { gamePlayTime } from "../../recoil/gamePlayTime";
import { currSessionId } from "../../recoil/currSessionId";
import { inroomState } from "../../recoil/imroomState";
import { gameModeName } from "../../recoil/gameModeName";
import { refreshToken } from "public/refreshToken";
import Swal from 'sweetalert2'
import Modal from 'react-modal';

Modal.setAppElement('#__next');
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateRoomModal({ isOpen, onClose, setIsLoading }) {
	const router = useRouter();
	const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);

	const [isRoomNameEmpty, setIsRoomNameEmpty] = useState(false);
	const [isRoomNameOver, setIsRoomNameOver] = useState(false);
	const [isModeNotSelected, setIsModeNotSelected] = useState(false);

	const [currSession, setCurrSessionId] = useRecoilState(currSessionId);
	const [myInRoomState, setInRoomState] = useRecoilState(inroomState);
	const [timeOfGamePlay, setTimeOfGamePlay] = useRecoilState(gamePlayTime);
	const [roomGameModeName, setRoomGameModeName] = useRecoilState(gameModeName);

	const userIdRef = useRef('');

	const [roomName, setRoomName] = useState("");
	const [gameMode, setGameMode] = useState('모드 선택');
	const [gameTime, setGameTime] = useState(30);

	function handleOnRequestClose() {
		onClose();
		setIsRoomNameEmpty(false);
		setIsRoomNameOver(false);
		setIsModeNotSelected(false);
		setRoomName('')
		setGameMode('모드 선택')
		setGameTime(30);
	}

	useEffect(() => {
		setTimeOfGamePlay(gameTime);
		console.log("Game Play Time : " + timeOfGamePlay);
	}, [gameTime]);

	useEffect(() => {
		if (window)
			userIdRef.current = localStorage.getItem("username");
	}, [userIdRef.current]);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!roomName) {
			setIsRoomNameEmpty(true);
			return;
		}
		if (roomName.length > 10) {
			setIsRoomNameOver(true);
			return;
		}
		if (gameMode === '모드 선택') {
			setIsModeNotSelected(true);
			return;
		}
		createRoom(roomName);
		setRoomName("");
		setIsRoomNameEmpty(false);
	};
	const handleRoomNameChange = (e) => {
		setRoomName(e.target.value);
	};

	const handleGameModeChange = (e) => {
		setGameMode(e.target.value);
	};

	const handleGameTimeChange = (e) => {
		setGameTime(e.target.value);
	};


	const createRoom = async (customSessionId) => {
		setIsLoading(true);
		setIsRoomHost({ roomName: customSessionId, isHost: true });
		setCurrSessionId(customSessionId);
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
			setRoomGameModeName(gameMode);
			onClose();
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
			onClose();
		}
	}
	return (
		<>
			<Modal
				portalClassName="custom-modal"
				isOpen={isOpen}
				onRequestClose={handleOnRequestClose}
				contentLabel="Create Room Modal"
				style={{
					overlay: {
						position: 'fixed',
						top: 250,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: '',
						
					},
					content: {
						margin: '30px auto',
						position: 'absolute',
						top: '50px',
						left: '40px',
						right: '40px',
						bottom: '40px',
						border: '1px solid #000',
						background: '#FBFFB1',
						overflow: 'auto',
						borderRadius: '4px',
						outline: 'none',
						padding: '20px',
						width: '600px',
						height: '400px',
						boxShadow: '1px 1px 1px 1px black',
						display: 'flex',
						flexDirection: 'column'

					}
				}}
			>

				<h1 className='head'>방 만들기</h1>
				<div className='modal-contents room-title-box'>
					<label>
						방 제목:
						<input className="title-input text-contents" type="text" value={roomName} onChange={handleRoomNameChange} />
					</label>

				</div>
				<div className='modal-contents'>
					<label>
						게임 모드:
						<select className="mode-selector" value={gameMode} onChange={handleGameModeChange}>
							<option value="default">모드 선택</option>
							<option value="스쿼트">스쿼트</option>
							<option value="푸쉬업">푸쉬업</option>
						</select>
					</label>
				</div>
				<div className='modal-contents'>
					<label>
						게임 시간:
						<input type="range" min="30" max="180" step="10" value={gameTime} onChange={handleGameTimeChange} />
						{gameTime}초
					</label>
				</div>
				{isRoomNameEmpty && (
					<div style={{ color: "red" }}>방이름을 입력해 주세요</div>
				)}

				{isRoomNameOver && (
					<div style={{ color: "red" }}>10자 이하로 작성해 주세요</div>
				)}

				{isModeNotSelected && (
					<div style={{ color: "red" }}>모드를 선택해 주세요</div>
				)}
				<div className='modal-contents button-component flex justify-end'>

					<div>
						<button className="mr-5 confirm-btn" onClick={handleSubmit}>확인</button>
						<button className="cancel-btn" onClick={() => {
							onClose();
							setRoomName('');
							setIsRoomNameEmpty(false);
							setIsRoomNameOver(false);
							setIsModeNotSelected(false);
						}}>취소</button>
					</div>

				</div>


			</Modal>
			<style jsx>{`
					h1{
						width: 100%;
						font-size:32px;
						padding: 10px;
						margin-bottom: 10px;
						margin-top:15px;
					}
					.mode-selector{
						padding: 5px;
						border: 2px solid black;
						border-radius: 8px;
					}
					.text-contents{
						font-size: 20px;
					}
					.title-input{
						border: 2px solid black;
						border-radius: 5px;
						width: 80%;
						padding: 2px;
					}
					.button-component{
						margin-top: 50px; 
						margin-right: 20px;
					}

					.modal-contents{
						font-size: 20px;
						margin-bottom: 15px;
					}

					.confirm-btn{
						padding: 5px 10px 5px 10px;
						color: white;rgb(10, 54, 10)
						border: 2px solid green;
						background-color: green;
						border-radius: 10px;
						box-shadow: 1px 1px 1px 1px rgb(4, 49, 4);
					}

					.cancel-btn{
						padding: 5px 10px 5px 10px;
						color: white;rgb(10, 54, 10)
						border: 2px solid red;
						background-color: red;
						border-radius: 10px;
						box-shadow: 1px 1px 1px 1px #A50000;
					}
					
					
					.custom-modal{
						background-color: white;
						border-radius: 5px;
						box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
						padding: 20px;
						width: 10px;
						
					}
				
				`}</style>
		</>

	);
}

