import { useState, useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import OvVideo from "./OvVideo";
import { getToken } from "../../../public/createToken.js";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
import { currSessionId } from "../../recoil/currSessionId";
import { inroomState } from "../../recoil/imroomState";
import { gamePlayTime } from "../../recoil/gamePlayTime";
import { isGaming } from "../../recoil/isGaming"
// import { motionStart } from "../../recoil/motionStart";
import SubVideo from "./SubVideo";
import Loading from "../Loading";
import dynamic from "next/dynamic";
import axios from "axios";
import Cookies from "js-cookie";
// import { currSessionId } from "../CreateRoomModal";
import { enterRoomSessionId } from "@/pages/room";
import Swal from "sweetalert2"; 
import MultiGameResultWin from "../MultiGameResult";
import MultiGameResultLose from "../MultiGameResultLose";
// import { isMotionStart } from "../openvidu/OvVideo";

export let isLeftPlayerThrow = false;
export let isLeftPlayerMoveGuildLine = false;
export let isRightPlayerThrow = false;
export let isRightPlayerMoveGuildLine = false;
export let mySquart = 0;
export let heSquart = 0;

export let amIHost = false;
export let isOtherPlayerReady = false;
export let isPhaserGameStart = false;
export let gameTimePassed = 0;
export let gameTimeTotal;

const DynamicComponentWithNoSSR = dynamic(() => import("../MultiGame/Index"), {
    ssr: false,
});

export function sendSignalThrow(session) {
    console.log(session);
    if (session) {
        session
            .signal({
                data: `${localStorage.getItem("username")}`, // Any string (optional)
                to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
                type: "throw", // The type of message (optional)
            })
            .then(() => {
                console.log("Throw !!! Message successfully sent");
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

export function sendSignalJumpingJacks(session) {
    if (session) {
        session
            .signal({
                data: `${localStorage.getItem("username")}`, // Any string (optional)
                to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
                type: "jumpingJacks", // The type of message (optional)
            })
            .then(() => {
                console.log("Message successfully sent");
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

export default function OpenViduComponent({
    roomName,
    userName,
    jwtToken,
    children,
    setIsMovenetLoaded,
    setIsOpenViduLoaded
}) {
    useEffect(() => {
        localStorage.setItem("refresh", "1");
        localStorage.setItem("readyToStart", "notReady");
    }, []);



    const [loading, setLoading] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [currSession, setCurrSession] = useRecoilState(currSessionId);
    const [myInRoomState, setInRoomState] = useRecoilState(inroomState);
	const [timeOfGamePlay, setTimeOfGamePlay] = useRecoilState(gamePlayTime);
    const [playerGaming, setPlayerGaming] = useRecoilState(isGaming);

    const userIdRef = useRef("");

    useEffect(() => {
        if (window) userIdRef.current = localStorage.getItem("username");
    }, [userIdRef.current]);

    useEffect(() => {
        setLoading(true);
    }, []);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, []);

    function onBackButtonEvent(e) {
        e.preventDefault();
        window.history.pushState(null, null, document.URL);
    }

    useEffect(() => {
        function handleResize() {
            setHeight(window.innerHeight);
        }

        handleResize(); // 초기화
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 1) OV 오브젝트 생성
    const [OV, setOV] = useState(null);
    const [session, setSession] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);

    const router = useRouter();
    const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
    const currentVideoDeviceRef = useRef(null);

	const [isWinModalOpen, setIsWinModalOpen] = useState(false);
	const [isLoseModalOpen, setIsLoseModalOpen] = useState(false);

	const [isMoveNetStart, setIsMoveNetStart] = useState(false);

	const [isModalClose, setIsModalClose] = useState(false);

    const [isIWinning, setIsIWinning] = useState("");
    const [isRWinning, setIsRWinning] = useState("");

    // const [isMotionStart, setIsMotionStart] = useRecoilState(motionStart);
    const [isMotionStart, setIsMotionStart] = useState(false);

  let isClicked = false;
  let isAllReady = true;
  let isRoomOutBtnClicked = false
  let gameTimer;
  let gameStartTime;
  let gameCurrTime;

  const [ rightUserName, setRightUserName ] = useState("");

    useEffect(() => {
        joinSession();
        if (myInRoomState === 1) {
            const targetBtn = document.getElementById("buttonGameReady");
            targetBtn.style.display = "none";
            localStorage.setItem('host', 'true')

            const targetBtnS = document.getElementById("buttonGameStart");
            targetBtnS.style.backgroundColor = "gray";
        } else if (myInRoomState === 2) {
            const targetBtn = document.getElementById("buttonGameStart");
            targetBtn.style.display = "none";
            localStorage.setItem('host', 'false')

        }
		const targetStringVS = document.getElementById("stringVS");
		targetStringVS.style.display = "none";
        // console.log("myInRoomState : " + myInRoomState);
        // isClicked = false;
        setPlayerGaming(1);
        return () => {
            // if (!isClicked) leaveSession();
        };
    }, []);

    useEffect(() => {
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, []);
    function onBackButtonEvent(e) {
        e.preventDefault();
        window.history.pushState(null, null, document.URL);
    }

	useEffect(() => {
		if (isModalClose) {
			leaveSession();
		}
	}, [isModalClose]);

    useEffect(() => {
        if (isMotionStart) {
            if (myInRoomState === 1) {
                console.log("@@@@@@@@@@@@@@@@@  start !!!  " + isMotionStart);
                gameStart();
            } else if (myInRoomState === 2) {
                console.log("@@@@@@@@@@@@@@@@@  ready !!!  " + isMotionStart);
                gameReady();
            }
        }
        setIsMotionStart(false);
    }, [isMotionStart]);

    const onbeforeunload = (event) => {
        leaveSession();
    };

    const deleteSubscriber = (streamManager) => {
        let newSubscribers = [...subscribers];
        setSubscribers(newSubscribers.filter((v) => v !== streamManager));
    };

    const leaveSession = async () => {
        const mySession = session;

        try {
            // const assessToken = Cookies.get("token");
            const roomId = currSession;
            console.log("this is levea room session !!! " + roomId);
            const response = await axios.post(API_URL + `/leave/${roomId}`, {
                userId: userIdRef.current,
            });
            console.log(response.data);
            switch (response.data) {
                case "deleteRoom":
                    // message : 방 다 나가
                    allLeaveSession();

                    break;
                default:
                    //   alert(response.data);
                    if (mySession) {
                        mySession.disconnect();
                        setOV(null);
                        setSession(undefined);
                        setSubscribers([]);
                        setPublisher(undefined);
                        router.push(`/room`);
                    }
                    // disconnect Session
                    break;
            }
        } catch (error) {
            console.log(error);
            const { response } = error;
            if (response) {
                switch (response.status) {
                    case 404:
                        // alert(response.data);
                        console.log(response.data);
                        break;
                    case 501:
                        // alert(response.data);
                        console.log(response.data);
                        break;
                    default:
                        // alert("Unexpected Error");
                        console.log("Unexpected Error");
                }
            }
        }
    };

    // 세션이 생성 됐을 때,
    useEffect(() => {
        if (session !== undefined) {
            let mySession = session;
			gameTimeTotal = timeOfGamePlay;
			console.log("Phaser 에게 넘겨주는 시간 : " + gameTimeTotal);

            mySession.on("streamCreated", (event) => {
                var newsubscriber = mySession.subscribe(event.stream, undefined);
                setSubscribers((curr) => [...curr, newsubscriber]);
				sendSignalInRoom();
            });

            mySession.on("connectionCreated", (event) => {
                console.log(event.connection);
            });

            mySession.on("streamDestroyed", (event) => {
                // if (!isRoomHost.isHost) {
                //     leaveSession();
                // }
                deleteSubscriber(event.stream.streamManager);
            });

			mySession.on("signal:inRoom", (event) => {
				if (event.data !== localStorage.getItem("username")) {
					setRightUserName(event.data);
					console.log("상대 User Name !!!" + rightUserName);
				}
            });

            // On every asynchronous exception...
            mySession.on("signal:jumpingJacks", (event) => {
                if (event.data === localStorage.getItem("username")) {
                    // alert("I throw !!!");
                    isLeftPlayerThrow = true;
                    mySquart += 1;
                    console.log("my count : " + mySquart);
                    setIsIWinning("Junping");
                    setTimeout(function () {
                        isLeftPlayerThrow = false;
                        setIsIWinning("");
                    }, 300);
                } else {
                    isRightPlayerThrow = true;
                    heSquart += 1;
                    console.log("he count : " + heSquart);
                    setIsRWinning("Junping")
                    setTimeout(function () {
                        isRightPlayerThrow = false;
                        setIsRWinning("")
                    }, 300);
                }
                // if(mySquart >= heSquart) {
                //     setIsIWinning("Squat !!!");
                //     setIsRWinning("");
                // } else {
                //     setIsIWinning("");
                //     setIsRWinning("Squat !!!")
                // }
            });

            mySession.on("signal:throw", (event) => {
                if (event.data === localStorage.getItem("username")) {
                    //   console.log("my character jumping jacks !!!");
                    isLeftPlayerMoveGuildLine = true;
                    setTimeout(function () {
                        isLeftPlayerMoveGuildLine = false;
                    }, 100);
                } else {
                    //   console.log("enemy character attack jumping jacks !!!");
                    isRightPlayerMoveGuildLine = true;
                    setTimeout(function () {
                        isRightPlayerMoveGuildLine = false;
                    }, 100);
                }
            });

            mySession.on("signal:allLeaveSession", (event) => {
                // 추후 삭제 예정
                // alert("방장이 방나감");
                console.log(event.from);
                leaveSession();

                if (myInRoomState === 2) {
                    Swal.fire({
                        title: '방장이 나갔습니다',
                        icon: 'warning',
                    });
                }
                
            });

            mySession.on("start", (event) => {
                // Phaser 시작
                isPhaserGameStart = true;
				setIsMoveNetStart(true);
                // setTimeout(function () {
                //     setIsMoveNetStart(true);
                // }, 5000);
                console.log("isPhaserGameStart : " + isPhaserGameStart);

				const targetBtnReady = document.getElementById("buttonGameReady");
      			targetBtnReady.style.display = "none";
	  			const targetBtnStart = document.getElementById("buttonGameStart");
      			targetBtnStart.style.display = "none";
				const targetBtnLeave = document.getElementById("buttonLeaveRoom");
				targetBtnLeave.style.display = "none";

                const targetStringRoomTitle = document.getElementById("room-title");
				targetStringRoomTitle.style.display = "none";

				const targetStringVS = document.getElementById("stringVS");
				targetStringVS.style.display = "block";

				mySquart = 0;
				heSquart = 0;

				gameStartTime = new Date;
				gameTimer = setInterval(setTimePassed, 1000);
            });

            mySession.on("end", (event) => {
                // Phaser 종료
                console.log("PhaserGameEnd : " + event.data);
                // alert("PhaserGameEnd : " + event.data);
                setPlayerGaming(0);
				clearInterval(gameTimer);
				// handleOpenWinModal();
				if (mySquart >= heSquart) {
					handleOpenWinModal();
				} else {
					handleOpenLoseModal();
				}
            });

      		mySession.on("signal:otherPlayerReady", (event) => {
				isAllReady = true;
				isOtherPlayerReady = true;
                localStorage.setItem("readyToStart", "ready");
				// setRightUserName(event.data);
				console.log("OtherPlayerReady !!!" + rightUserName);

				// const targetBtnStart = document.getElementById("buttonGameStart");
				// targetBtnStart.style.display = "block";
                const targetBtnS = document.getElementById("buttonGameStart");
                targetBtnS.style.backgroundColor = "red";
                const targetBtnR = document.getElementById("buttonGameReady");
                targetBtnR.style.backgroundColor = "gray";
			});

            // On every asynchronous exception...
            mySession.on("exception", (exception) => {
                console.warn(exception);
            });

            getToken(roomName, jwtToken).then((token) => {
                mySession
                    .connect(token, { clientData: userName })
                    .then(async () => {
                        let publisher = await OV.initPublisherAsync(undefined, {
                            audioSource: undefined, // The source of audio. If undefined default microphone
                            videoSource: undefined, // The source of video. If undefined default webcam
                            publishAudio: false, // Whether you want to start publishing with your audio unmuted or not
                            publishVideo: true, // Whether you want to start publishing with your video enabled or not
                            resolution: "445x800", // 비율 정하기 The resolution of your video
                            frameRate: 30, // The frame rate of your video
                            insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                            mirror: false, // Whether to mirror your local video or not
                        });

                        mySession.publish(publisher);

                        var devices = await OV.getDevices();
                        var videoDevices = devices.filter(
                            (device) => device.kind === "videoinput"
                        );
                        var currentVideoDeviceId = publisher.stream
                            .getMediaStream()
                            .getVideoTracks()[0]
                            .getSettings().deviceId;
                        var currentVideoDevice = videoDevices.find(
                            (device) => device.deviceId === currentVideoDeviceId
                        );

                        currentVideoDeviceRef.current = currentVideoDevice;
                        setPublisher(publisher);
                    })
                    .catch((error) => {
                        console.log(
                            "There was an error connecting to the session:",
                            error.code,
                            error.message
                        );
                    });
            });
        }
    }, [session]);

    const joinSession = async () => {
        let newOV = new OpenVidu();
        setOV(newOV);
        newOV.enableProdMode();

        // 2) session 초기화 -> useEffect 호출
        setSession(newOV.initSession());
    };

    const callLeaveSession = () => {
        isClicked = true;
        leaveSession();
    };

    const allLeaveSession = () => {
        if (session) {
            console.log("allLeaveSession");
            session
                .signal({
                    data: "baba",
                    to: [],
                    type: "allLeaveSession",
                })
                .then(() => {
                    console.log("Message successfully sent");
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const sendSurverLeaveSession = async () => {
        const roomId = currSession;
        console.log(roomId);
        const assessToken = Cookies.get("token");
        try {
            const response = await axios.get(API_URL + `/destroy/${roomId}`, {
                headers: { Authorization: `Bearer ${assessToken}` },
            });
            session.disconnect();
            setOV(null);
            setSession(undefined);
            setSubscribers([]);
            setPublisher(undefined);
            router.push(`/room`);
        } catch (error) {
            console.log("Unexpected Error");
        }
    };

	function sendSignalInRoom() {
        if (session) {
            console.log("sendSignalInRoom");
            session.signal({
                data: `${localStorage.getItem('username')}`,
                to: [],
                type: 'inRoom'
            })
                .then(() => {
                    console.log('Message successfully sent');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

  const gameStart = async () => {
	if (isOtherPlayerReady) {
    	const roomId = currSession;
    	const assessToken = Cookies.get("token");
    	try {
			console.log(roomId);
      		const response = await axios.get(API_URL + `/game/${roomId}`, {
        	headers: { Authorization: `Bearer ${assessToken}` },
      	});
    	} catch (error) {
      		console.log(error);
    	}
	}
  };
  const gameReady = () => {
    if (session) {
      session
        .signal({
          data: `${localStorage.getItem("username")}`,
          to: [],
          type: "otherPlayerReady",
        })
        .then(() => {
          console.log("Message successfully sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const setTimePassed = () => {
	var gameCurrTime = new Date();
	// var hours = now.getHours();
	// var minutes = now.getMinutes();
	// var seconds = now.getSeconds();
	// gameStartTime = (hours*3600) + (minutes*60) + seconds;
	gameTimePassed = Math.floor((gameCurrTime.getTime() - gameStartTime.getTime()) / 1000);
	
	console.log("지난 시간 : ", gameTimePassed);

	if (gameTimePassed + 5 >= gamePlayTime) {
		console.log("SetTimePassed 에서 게임이 끝나따 !!! ");
		clearInterval(gameTimer);
		if (mySquart >= heSquart) {
			handleOpenWinModal();
		} else {
			handleOpenLoseModal();
		}
	}
  };

  const handleOpenWinModal = () => {
    setIsWinModalOpen(true);
  }
  const handleCloseWinModal = () => {
    setIsWinModalOpen(false);
  };
  const handleOpenLoseModal = () => {
    setIsLoseModalOpen(true);
  }
  const handleCloseLoseModal = () => {
    setIsLoseModalOpen(false);
  };

    return (
        <div className="video-container">


            <div>
                {/* <div>
          {session && publisher !== undefined ? (
            <div id="session">
              {publisher !== undefined ? (
                <div
                  id="main-video"
                  style={{ position: "static", top: "30px", left: "30px" }}
                >
                  <OvVideo
                    streamManager={publisher}
                    userName={userName}
                    session={session}
                  />
                </div>
              ) : (
                <Loading />
              )}
            </div>
          ) : null}
        </div> */}

        <div id="game-container">
		
            {session !== undefined ? (
                <div id="session">
                {publisher !== undefined ? (
                    <div
                    id="main-video"
                    style={{ position: "absolute", top: "0px", bottom:"140px", left: "0px", right: "1370px" ,width: "500px", height: "800px" }}
                    >
                    <OvVideo
                        streamManager={publisher}
                        userName={userName}
                        session={session}
                        setIsOpenViduLoaded={setIsOpenViduLoaded}
                        setIsMovenetLoaded={setIsMovenetLoaded}
						isMoveNetStart={isMoveNetStart}
                        setIsMotionStart={setIsMotionStart}
                    />
                    </div>
                ) : (
                <Loading />
                )}
                </div>
            ) : null}
        
            {loading ? <DynamicComponentWithNoSSR /> : null}
			
			<p id="room-title" className="session-title" style={{ position: "absolute", top: "20px", left: "950px", fontSize: "60px" }}>{currSession}</p>
			<p id="stringVS" className="stringVS" style={{ position: "absolute", top: "820px", bottom:"30px", right: "30px", left: "930px", width: "250px", height: "100px", fontSize: "60px" }}></p>
			<span className="user-name" style={{ position: "absolute", top: "800px", left: "100px", color: "yellow" }}>{userName}</span>
			<span className="user-name" style={{ position: "absolute", top: "800px", right: "140px", color: "yellow" }}>{rightUserName}</span>
            <button
                style={{ position: "absolute", top: "600px", left: "800px" }}
                className="buttonGameStart"
                id="buttonGameStart"
                onClick={gameStart}
            >
                <span>시작</span>
            </button>
            <button
                style={{ position: "absolute", top: "600px", left: "800px" }}
                className="buttonGameReady"
                id="buttonGameReady"
                onClick={gameReady}
            >
                <span>준비</span>
            </button>
			<button
                style={{ position: "absolute", top: "680px", bottom:"30px", right: "30px", left: "1150px", width: "150px", height: "60px", fontSize: "30px", color: "white", backgroundColor: "red", borderRadius: "20px" }}
                className="buttonLeaveRoom"
                id="buttonLeaveRoom"
                onClick={callLeaveSession}
            >
                나가기
            </button>
        </div>

        <div>
          {subscribers.map((sub, i) => (
            <div
              key={i}
              style={{ position: "absolute", top: "0px", bottom:"140px", right: "0px", left: "1400px", width: "500px", height: "800px" }}
            >
              <SubVideo streamManager={sub} />
            </div>
          ))}
        </div>
      </div>

      <p className="leftWinning" style={{ position: "absolute", top: "600px", left: "100px", width: "400px", height: "200px" }}>{isIWinning}</p>
      <p className="leftWinning" style={{ position: "absolute", top: "600px", left: "1500px", width: "400px", height: "200px" }}>{isRWinning}</p>

	  		{/* <div className="nav-bar flex justify-center align-center" style={{ position: "absolute", top: "800px", bottom:"30px", right: "30px", left: "1400px", width: "300px", height: "100px" }}>
        		<div className="contents-box flex flex-inline justify-center align-center">
          			<p className="session-title">{roomName}</p>
          			<button
            			className=""
            			id="buttonLeaveSession"
            			onClick={callLeaveSession}
          			>
            			방 나가기
          			</button>
        		</div>
      		</div> */}

			{isWinModalOpen && <MultiGameResultWin roomId={currSession} name={userName} setIsWinModalOpen={setIsWinModalOpen} setIsModalClose={setIsModalClose}/>}
			{isLoseModalOpen && <MultiGameResultLose setIsWinModalOpen={setIsLoseModalOpen} setIsModalClose={setIsModalClose} />}
			
            <style jsx>{`
                .video-container{
                }

                .nav-bar{
                    height: 60px;
                    background-color: #12DEFF;
                    width: 680px;
                    margin: 0px auto;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                    box-shadow: 1px 1px 1px 1px;
                }
                .session-title{
                    position: absolute;
                    left: 10px;
                    top 50%;
                    left: 70px;
                    transform: translate(-50%, 50%);
                    font-size: 18px;
                    align-items: center;
                    color: white;
                }

				.user-name {
					display: flex;
					justify-content: center;
					font-size: 150px;
					background-color: ;
				}

				.stringVS {
					
				}

                .contents-box{
                    position: relative;
                    margin-top: 5px;
                    background-color: #0ABDFF;
                    width: 660px;
                    height: 50px;
                    border-radius: 10px; 
                }

                .leftWinning {
                    color: red;
                    font-size: 80px;
                }
                
				.buttonGameStart {
					// font-size: 80px;
					color: white;
					// background-color: red;
					// width: 500px;
					// height: 200px;
					border-radius: 20px; 
					// border: 3px solid black;
				}
				.buttonGameStart {
					// background: linear-gradient(0deg, rgba(213, 252, 191, 1) 0%, rgba(54, 142, 6, 1) 100%);
					font-size: 120px;
					color: white;
					width: 300px;
					height: 150px;
					  line-height: 42px;
					  padding: 0;
					  border: none;
					}
					.buttonGameStart span {
						line-height: 140px;
					  position: relative;
					  display: block;
					  width: 100%;
					  height: 100%;
					}
					// .buttonGameStart:before,
					// .buttonGameStart:after {
					//   position: absolute;
					//   content: "";
					//   right: 0;
					//   bottom: 0;
					//   background: rgba(54, 142, 6, 1);
					//   box-shadow:
					//    -7px -7px 20px 0px rgba(255,255,255,.9),
					//    -4px -4px 5px 0px rgba(255,255,255,.9),
					//    7px 7px 20px 0px rgba(0,0,0,.2),
					//    4px 4px 5px 0px rgba(0,0,0,.3);
					//   transition: all 0.3s ease;
					// }
					// .buttonGameStart:before{
					//    height: 0%;
					//    width: 2px;
					// }
					// .buttonGameStart:after {
					//   width: 0%;
					//   height: 2px;
					// }
					// .buttonGameStart:hover{
					//   color: rgba(54, 142, 6, 1);
					// //   background: transparent;
                    //     background: white;
					// }
					// .buttonGameStart:hover:before {
					//   height: 100%;
					// }
					// .buttonGameStart:hover:after {
					//   width: 100%;
					// }
					// .buttonGameStart span:before,
					// .buttonGameStart span:after {
					//   position: absolute;
					//   content: "";
					//   left: 0;
					//   top: 0;
					//   background: rgba(54, 142, 6, 1);
					//   box-shadow:
					//    -7px -7px 20px 0px rgba(255,255,255,.9),
					//    -4px -4px 5px 0px rgba(255,255,255,.9),
					//    7px 7px 20px 0px rgba(0,0,0,.2),
					//    4px 4px 5px 0px rgba(0,0,0,.3);
					//   transition: all 0.3s ease;
					// }
					// .buttonGameStart span:before {
					//   width: 2px;
					//   height: 0%;
					// }
					// .buttonGameStart span:after {
					//   height: 2px;
					//   width: 0%;
					// }
					// .buttonGameStart span:hover:before {
					//   height: 100%;
					// }
					// .buttonGameStart span:hover:after {
					//   width: 100%;
					// }

					.buttonGameReady {
						// font-size: 40px;
						color: white;
						// background-color: red;
						// width: 250px;
						// height: 100px;
						border-radius: 20px; 
						// border: 3px solid black;
					}
					.buttonGameReady {
						// background: linear-gradient(0deg, rgba(213, 252, 191, 1) 0%, rgba(54, 142, 6, 1) 100%);
                        background-color: green;
						font-size: 120px;
						color: white;
						width: 300px;
						height: 150px;
						  line-height: 42px;
						  padding: 0;
						  border: none;
						}
						.buttonGameReady span {
							line-height: 140px;
						  position: relative;
						  display: block;
						  width: 100%;
						  height: 100%;
						}
						.buttonGameReady:before,
						.buttonGameReady:after {
						  position: absolute;
						  content: "";
						  right: 0;
						  bottom: 0;
						  background: rgba(54, 142, 6, 1);
						  box-shadow:
						   -7px -7px 20px 0px rgba(255,255,255,.9),
						   -4px -4px 5px 0px rgba(255,255,255,.9),
						   7px 7px 20px 0px rgba(0,0,0,.2),
						   4px 4px 5px 0px rgba(0,0,0,.3);
						  transition: all 0.3s ease;
						}
						.buttonGameReady:before{
						   height: 0%;
						   width: 2px;
						}
						.buttonGameReady:after {
						  width: 0%;
						  height: 2px;
						}
						.buttonGameReady:hover{
						  color: rgba(54, 142, 6, 1);
						//   background: transparent;
                            background: white;
						}
						.buttonGameReady:hover:before {
						  height: 100%;
						}
						.buttonGameReady:hover:after {
						  width: 100%;
						}
						.buttonGameReady span:before,
						.buttonGameReady span:after {
						  position: absolute;
						  content: "";
						  left: 0;
						  top: 0;
						  background: rgba(54, 142, 6, 1);
						  box-shadow:
						   -7px -7px 20px 0px rgba(255,255,255,.9),
						   -4px -4px 5px 0px rgba(255,255,255,.9),
						   7px 7px 20px 0px rgba(0,0,0,.2),
						   4px 4px 5px 0px rgba(0,0,0,.3);
						  transition: all 0.3s ease;
						}
						.buttonGameReady span:before {
						  width: 2px;
						  height: 0%;
						}
						.buttonGameReady span:after {
						  height: 2px;
						  width: 0%;
						}
						.buttonGameReady span:hover:before {
						  height: 100%;
						}
						.buttonGameReady span:hover:after {
						  width: 100%;
						}

				// .buttonGameStart {
				// 	font-size: 40px;
				// 	color: white;
				// 	width: 250px;
				// 	height: 80px;
				// 	line-height: 42px;
				// 	padding: 0;
				// 	border: none;
				// 	border-radius: 50px; 
				// 	background: rgb(255,27,0);
				//   	background: linear-gradient(0deg, rgba(255,27,0,1) 0%, rgba(54, 142, 6, 1) 100%);
				// }
				// .buttonGameStart:hover {
				// 	color: #f0094a;
				// 	background: transparent;
				// 	box-shadow:none;
				// }
				// .buttonGameStart:before,
				// .buttonGameStart:after{
				// 	content:'';
				// 	position:absolute;
				// 	top:0;
				// 	right:0;
				// 	height:4px;
				// 	width:0;
				// 	background: #f0094a;
				// 	box-shadow:
				// 		-1px -1px 5px 0px #fff,
				// 		7px 7px 20px 0px #0003,
				// 		4px 4px 5px 0px #0002;
				// 		transition:400ms ease all;
				// }
				// .buttonGameStart:after{
				// 	right:inherit;
				// 	top:inherit;
				// 	left:0;
				// 	bottom:0;
				// }
				// .buttonGameStart:hover:before,
				// .buttonGameStart:hover:after{
				// 	width:100%;
				// 	transition:800ms ease all;
				// }
                `}</style>
        </div>
    );
}