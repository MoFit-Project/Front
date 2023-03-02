import { useState, useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import OvVideo from "./OvVideo";
import { getToken } from "../../../public/createToken.js";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
import { currSessionId } from "../../recoil/currSessionId";
import SubVideo from "./SubVideo";
import Loading from "../Loading";
import dynamic from "next/dynamic";
import axios from "axios";
// import { currSessionId } from "../CreateRoomModal";
import { enterRoomSessionId } from "@/pages/room";

export let isLeftPlayerThrow = false;
export let isLeftPlayerMoveGuildLine = false;
export let isRightPlayerThrow = false;
export let isRightPlayerMoveGuildLine = false;
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
        console.log("Message successfully sent");
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
}) {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [currSession, setCurrSession ] = useRecoilState(currSessionId);

  const userIdRef = useRef('');

  useEffect(() => {
    if (window)
      userIdRef.current = localStorage.getItem("username");
  }, [userIdRef.current]);

  useEffect(() => {
    setLoading(true);
  }, []);
  const [height, setHeight] = useState(0);

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

  let isClicked = false;

  useEffect(() => {
    joinSession();
    // isClicked = false;
    return () => {
        // if (!isClicked) leaveSession();
    };
  }, []);

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
        "userId": userIdRef.current,
      });
      console.log(response.data)
      switch (response.data) {
        case "deleteRoom":
          // message : 방 다 나가
          alert(response.data);
          break;
        default:
          alert(response.data);
          if (mySession) {
            mySession.disconnect();
          }
          // disconnect Session
          break;
      }
      if (mySession) {
        mySession.disconnect();
      }
      setOV(null);
      setSession(undefined);
      setSubscribers([]);
      setPublisher(undefined);
  
    } catch (error) {
      console.log(error);
      const { response } = error;
      if (response) {
        switch (response.status) {
          case 404:
            alert(response.data);
            break;
          case 501:
            alert(response.data);
            break;
          default:
            alert("Unexpected Error");
        }
      }
    }

   router.push(`/room`);
  };

  // 세션이 생성 됐을 때,
  useEffect(() => {
    if (session !== undefined) {
      let mySession = session;

      mySession.on("streamCreated", (event) => {
        var newsubscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((curr) => [...curr, newsubscriber]);
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

      // On every asynchronous exception...
      mySession.on("signal:throw", (event) => {
        if (event.data === localStorage.getItem("username")) {
          console.log("my character attack throw !!!");
          isLeftPlayerThrow = true;
          setTimeout(function () {
            isLeftPlayerThrow = false;
          }, 100);
        } else {
          console.log("enemy character attack throw !!!");
          isRightPlayerThrow = true;
          setTimeout(function () {
            isRightPlayerThrow = false;
          }, 100);
        }
      });

      mySession.on("signal:jumpingJacks", (event) => {
        if (event.data === localStorage.getItem("username")) {
          console.log("my character jumping jacks !!!");
          isLeftPlayerMoveGuildLine = true;
          setTimeout(function () {
            isLeftPlayerMoveGuildLine = false;
          }, 100);
        } else {
          console.log("enemy character attack jumping jacks !!!");
          isRightPlayerMoveGuildLine = true;
          setTimeout(function () {
            isRightPlayerMoveGuildLine = false;
          }, 100);
        }
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
              resolution: "320x480", // The resolution of your video
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
  }

  return (
    <div className="w-screen">
      <div className="flex justify-center" style={{ border: "solid black" }}>
        <h1 id="session-title">{roomName}</h1>
        <button className="" id="buttonLeaveSession" onClick={callLeaveSession}>
          방 나가기
        </button>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {session && publisher !== undefined ? (
            <div id="session" style={{ position: "relative" }}>
              {publisher !== undefined ? (
                <div id="main-video" style={{ top: "0px", left: "0px" }}>
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
        </div>

        <div
          id="game-container"
          style={{ flex: 3, display: "flex", justifyContent: "center" }}
        >
          {loading ? <DynamicComponentWithNoSSR /> : null}
        </div>

        <div style={{ flex: 1 }}>
          {subscribers.map((sub, i) => (
            <div key={i} style={{ top: "0px", right: "0px" }}>
              <SubVideo streamManager={sub} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
