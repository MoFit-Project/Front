import {useRouter} from "next/router";


function modeSelect() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();



    return (
        <div className="max-w-md mx-auto mt-10">
            <img
                className="mx-auto h-12 w-auto"
                src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png"
                alt="Your Company"
            ></img>
            <h1 className="text-4xl font-bold text-center mb-8 text-green-700">
                Mofit
            </h1>
            <div className="text-center">
                <button type={"button"} onClick={()=> router.push('/singleMode')}
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    싱글 플레이
                </button>
            </div>


            <div className="text-center">
                <button type={"button"} onClick={()=> router.push('/room')}
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    멀티 플레이
                </button>
            </div>
        </div>
    );
}
    export default modeSelect;