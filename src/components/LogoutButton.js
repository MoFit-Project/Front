import {destroyCookie} from "nookies";
import {useRouter} from "next/router";

export default function logoutButton () {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    destroyCookie(null, "token")
    return (
        <button className="bg-green-800 text-white font-bold py-1 px-3 ml-12 rounded-md block mt-1" onClick={()=>router.push("/login")}>
        로그아웃
    </button>
    )

}