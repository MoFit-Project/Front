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
import SubVideo from "./SubVideo";
import Loading from "../Loading";
import dynamic from "next/dynamic";
import axios from "axios";
import Cookies from "js-cookie";
// import { currSessionId } from "../CreateRoomModal";
import { enterRoomSessionId } from "@/pages/room";
import MultiGameResultWin from "../MultiGameResult";
import MultiGameResultLose from "../MultiGameResultLose";

export let isLeftPlayerThrow = false;
export let isLeftPlayerMoveGuildLine = false;
export let isRightPlayerThrow = false;
export let isRightPlayerMoveGuildLine = false;
export let mySquart2 = 0;
export let heSquart2 = 0;

export let amIHost = false;
export let isOtherPlayerReady = false;
export let isPhaserGameStart = true;
export let isPhaserGameStart2 = false;
export let gameTimePassed2 = 0;
export let gameTimeTotal2;

const DynamicComponentWithNoSSR = dynamic(() => import("../MultiGame2/Index"), {
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

    const [loading, setLoading] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [currSession, setCurrSession] = useRecoilState(currSessionId);
    const [myInRoomState, setInRoomState] = useRecoilState(inroomState);
	const [timeOfGamePlay, setTimeOfGamePlay] = useRecoilState(gamePlayTime);

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
        } else if (myInRoomState === 2) {
            const targetBtn = document.getElementById("buttonGameStart");
            targetBtn.style.display = "none";
        }
		const targetStringVS = document.getElementById("stringVS");
		targetStringVS.style.display = "none";
        // console.log("myInRoomState : " + myInRoomState);
        // isClicked = false;
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
                    // message : 방 다 나가기
                    allLeaveSession();

                    break;
                default:
                    //   console.log(response.data);
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
			gameTimeTotal2 = timeOfGamePlay;
			console.log("Phaser 에게 넘겨주는 시간 : " + gameTimeTotal2);

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
            mySession.on("signal:throw", (event) => {
                if (event.data === localStorage.getItem("username")) {
                    isLeftPlayerThrow = true;
                    mySquart2 += 1;
                    console.log("my count : " + mySquart2);
                    setTimeout(function () {
                        isLeftPlayerThrow = false;
                    }, 300);
                } else {
                    isRightPlayerThrow = true;
                    heSquart2 += 1;
                    console.log("he count : " + heSquart2);
                    setTimeout(function () {
                        isRightPlayerThrow = false;
                    }, 300);
                }
            });

            mySession.on("signal:jumpingJacks", (event) => {
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
                sendSurverLeaveSession();
                leaveSession();
            });

            mySession.on("start", (event) => {
                // Phaser 시작
				mySquart2 = 0;
				heSquart2 = 0;
                isPhaserGameStart2 = true;
				setIsMoveNetStart(true);
                console.log("isPhaserGameStart2 : " + isPhaserGameStart2);

				const targetBtnReady = document.getElementById("buttonGameReady");
      			targetBtnReady.style.display = "none";
	  			const targetBtnStart = document.getElementById("buttonGameStart");
      			targetBtnStart.style.display = "none";
				// const targetBtnLeave = document.getElementById("buttonLeaveRoom");
				// targetBtnLeave.style.display = "none";

				const targetStringVS = document.getElementById("stringVS");
				targetStringVS.style.display = "block";

				gameStartTime = new Date;
				gameTimer = setInterval(setTimePassed, 1000);
            });

            mySession.on("end", (event) => {
                // Phaser 종료
                console.log("PhaserGameEnd : " + event.data);

				clearInterval(gameTimer);

				if (mySquart2 >= heSquart2) {
					handleOpenWinModal();
				} else {
					handleOpenLoseModal();
				}
            });

      		mySession.on("signal:otherPlayerReady", (event) => {
				isAllReady = true;
				isOtherPlayerReady = true;
				setRightUserName(event.data);
				console.log("OtherPlayerReady !!!" + rightUserName);

				const targetBtnStart = document.getElementById("buttonGameStart");
				targetBtnStart.style.display = "block";
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
                            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                            publishVideo: true, // Whether you want to start publishing with your video enabled or not
                            resolution: "500x800", // 비율 정하기 The resolution of your video
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
	if (isAllReady) {
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
	gameTimePassed2 = Math.floor((gameCurrTime.getTime() - gameStartTime.getTime()) / 1000);
	
	console.log("지난 시간 : ", gameTimePassed2);

	if (gameTimePassed2 + 5 > gamePlayTime) {
		clearInterval(gameTimer);
		if (mySquart2 >= heSquart2) {
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
            <div id="game-container">
		
            {session !== undefined ? (
                <div id="session">
                {publisher !== undefined ? (
                    <div
                    id="main-video"
                    style={{ position: "absolute", top: "30px", bottom:"140px", left: "30px", right: "1370px" ,width: "500px", height: "800px" }}
                    >
                    <OvVideo
                        streamManager={publisher}
                        userName={userName}
                        session={session}
                        setIsOpenViduLoaded={setIsOpenViduLoaded}
                        setIsMovenetLoaded={setIsMovenetLoaded}
						isMoveNetStart={isMoveNetStart}
                    />
                    </div>
                ) : (
                <Loading />
                )}
                </div>
            ) : null}
        
            {loading ? <DynamicComponentWithNoSSR /> : null}
			
			<p className="session-title" style={{ position: "absolute", top: "-20px", left: "950px", fontSize: "60px" }}>{currSession}</p>
			<p id="stringVS" className="stringVS" style={{ position: "absolute", top: "820px", bottom:"30px", right: "30px", left: "930px", width: "250px", height: "100px", fontSize: "60px" }}>VS</p>
			<span className="user-name" style={{ position: "absolute", top: "810px", left: "570px" }}>{userName}</span>
			<span className="user-name" style={{ position: "absolute", top: "810px", right: "570px" }}>{rightUserName}</span>
            <button
                style={{ position: "absolute", top: "820px", left: "850px" }}
                className="buttonGameStart"
                id="buttonGameStart"
                onClick={gameStart}
            >
                <span>시작</span>
            </button>
            <button
                style={{ position: "absolute", top: "820px", left: "850px" }}
                className="buttonGameReady"
                id="buttonGameReady"
                onClick={gameReady}
            >
                <span>준비</span>
            </button>
			<button
                style={{ position: "absolute", top: "820px", bottom:"30px", right: "30px", left: "1600px", width: "250px", height: "100px", fontSize: "50px", color: "white", backgroundColor: "red", borderRadius: "20px" }}
                className="buttonLeaveRoom"
                id="buttonLeaveRoom"
                onClick={callLeaveSession}
            >
                방나가기
            </button>
        </div>

        <div>
          {subscribers.map((sub, i) => (
            <div
              key={i}
              style={{ position: "absolute", top: "30px", bottom:"170px", right: "30px", left: "1370px", width: "500px", height: "800px" }}
            >
              <SubVideo streamManager={sub} />
            </div>
          ))}
        </div>
      </div>
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
					font-size: 60px;
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
                
				.buttonGameStart {
					font-size: 40px;
					color: white;
					background-color: red;
					width: 250px;
					height: 100px;
					border-radius: 20px; 
					// border: 3px solid black;
				}
				.buttonGameStart {
					background: linear-gradient(0deg, rgba(244, 123, 123, 1) 0%, rgba(238, 47, 47, 1) 100%);
					font-size: 50px;
					color: white;
					width: 250px;
					height: 100px;
					  line-height: 42px;
					  padding: 0;
					  border: none;
					}
					.buttonGameStart span {
						line-height: 100px;
					  position: relative;
					  display: block;
					  width: 100%;
					  height: 100%;
					}
					.buttonGameStart:before,
					.buttonGameStart:after {
					  position: absolute;
					  content: "";
					  right: 0;
					  bottom: 0;
					  background: rgba(238, 47, 47, 1);
					  box-shadow:
					   -7px -7px 20px 0px rgba(255,255,255,.9),
					   -4px -4px 5px 0px rgba(255,255,255,.9),
					   7px 7px 20px 0px rgba(0,0,0,.2),
					   4px 4px 5px 0px rgba(0,0,0,.3);
					  transition: all 0.3s ease;
					}
					.buttonGameStart:before{
					   height: 0%;
					   width: 2px;
					}
					.buttonGameStart:after {
					  width: 0%;
					  height: 2px;
					}
					.buttonGameStart:hover{
					  color: rgba(238, 47, 47, 1);
					  background: transparent;
					}
					.buttonGameStart:hover:before {
					  height: 100%;
					}
					.buttonGameStart:hover:after {
					  width: 100%;
					}
					.buttonGameStart span:before,
					.buttonGameStart span:after {
					  position: absolute;
					  content: "";
					  left: 0;
					  top: 0;
					  background: rgba(238, 47, 47, 1);
					  box-shadow:
					   -7px -7px 20px 0px rgba(255,255,255,.9),
					   -4px -4px 5px 0px rgba(255,255,255,.9),
					   7px 7px 20px 0px rgba(0,0,0,.2),
					   4px 4px 5px 0px rgba(0,0,0,.3);
					  transition: all 0.3s ease;
					}
					.buttonGameStart span:before {
					  width: 2px;
					  height: 0%;
					}
					.buttonGameStart span:after {
					  height: 2px;
					  width: 0%;
					}
					.buttonGameStart span:hover:before {
					  height: 100%;
					}
					.buttonGameStart span:hover:after {
					  width: 100%;
					}

					.buttonGameReady {
						font-size: 40px;
						color: white;
						background-color: red;
						width: 250px;
						height: 100px;
						border-radius: 20px; 
						// border: 3px solid black;
					}
					.buttonGameReady {
						background: linear-gradient(0deg, rgba(244, 123, 123, 1) 0%, rgba(238, 47, 47, 1) 100%);
						font-size: 50px;
						color: white;
						width: 250px;
						height: 100px;
						line-height: 42px;
						padding: 0;
						border: none;
					}
					.buttonGameReady span {
						line-height: 100px;
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
						background: rgba(238, 47, 47, 1);
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
						color: rgba(238, 47, 47, 1);
						background: transparent;
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
						background: rgba(238, 47, 47, 1);
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
                `}</style>
        </div>
    );
}