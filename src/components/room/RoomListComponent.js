import Image from "next/image"

export default function RoomListComponent({ roomName, person }) {

    return (
        <div className="container">
            <div className=" w-full h-full p-3 inline-flex rounded-lg shadow ">
                <img className="mode-img" src="https://fakeimg.pl/300/" />
                <div className="flex flex-col w-full justify-round">
                    <div className="w-full items-start">
                        <p className="inset-shadow w-full elem-contents rounded-md p-3 text-md ">{roomName ? roomName : '방 제목'}</p>
                    </div>
                    <div className="flex mt-2">
                    </div>
                    <div className="flex justify-between">
                        <div className="flex ">
                            <p className="mode-p inset-shadow elem-contents rounded-md mr-3 p-3">스쿼트 모드</p>
                            <small className="inset-shadow rounded-md elem-contents p-3">{person ? person : 1}/2</small>
                        </div>
                        <div className="flex justify-end">
                            <button className="elem-contents enter-btn w-48 rounded-md text-sm">입장</button>
                        </div>
                    </div>

                </div>
            </div>
            <style jsx>{`
                .game-status{

                }

                .mode-p{
                    padding-top: auto;
                }

                .container {
                    width: 520px;
                    margin: 0px auto;
                    background-color: #12DEFF;
                    border-radius: 10px;
                    box-shadow: 1px 1px 1px 1px #006ECC;
                    border-top:2px solid #ffff;
                    border-left:2px solid #ffff;
                    height: 140px;
                }
                .inset-shadow {
                    box-shadow: .4px .4px .4px .4px inset #053b58;
                }
                .enter-btn {
                    border-bottom: 3px solid #034279;
                    border-right: 1.5px solid #034279;
                    border-top: 1px solid white;
                    border-left: .5px solid white;
                    transition:all 0.1s;
                    text-align: middle;


                }
                .enter-btn:active {
                    transform: translateY(2px);
                    border-bottom: 1px solid #034279;
                    border-right: 0px solid #034279;
                }
                .elem-contents{
                    background-color: #0594E0;
                    padding: 10px 10px;
                    {/* border-top:1px solid #ffff;
                    border-left:1px solid #ffff; */}
                    color: white;
                    -webkit-text-stroke: 0.3px black;
                    text-stroke: 0.5px black;
                    text-align: start;
                }
                .mode-img{
                    border-radius: 10px;
                    margin-right: 10px;
                }
                .mode-img-container{
                    border-radius: 10px;
                }
            `}</style>
        </div >
    );
}