import {destroyCookie} from "nookies";
import {useRouter} from "next/router";

export default function logout () {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    destroyCookie(null, "token")
        .then(router.push("/login"))

}