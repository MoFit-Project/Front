import {useRouter} from "next/router";
function Home() {
    const router = useRouter();
    if (typeof window !== "undefined") {
        router.push("/login");
    }
    return null;

}

export default Home
