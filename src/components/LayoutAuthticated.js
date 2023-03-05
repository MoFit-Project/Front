import {useRouter} from 'next/router';
import {useEffect} from 'react';
import Cookies from 'js-cookie';

export default function LayoutAuthenticated(props) {

    const router = useRouter();
    useEffect(() => {
        return checkIsLoggedIn();
    }, [router]);

    function checkIsLoggedIn() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return () => {
            };
        } else {

        }
    }

    return (
        <div className='w-full h-screen'>
            {props.children}

        </div>
    )
}