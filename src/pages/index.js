import {useRouter} from "next/router";
function Home() {
    const router = useRouter();
    return router.push("/login");


}

export default Home
