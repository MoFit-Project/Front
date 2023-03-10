import Link from 'next/link'
import LogoutButton from "./LogoutButton";
import Head from "next/head";
import {useEffect, useRef} from "react";


export default function NavBar({ children }) {
  const myAudioRef = useRef(null);

  useEffect(() => {
    const myAudio = new Audio("webBgm.mp3");
    myAudio.loop = true;
    myAudioRef.current = myAudio;
    myAudio.play();

    return () => {
      myAudio.pause();
      myAudioRef.current = null;
    }
  }, []);

  return (
    <>
      <nav className='bg-blue-700 p-2'>
        <div className="flex items-center justify-between mx-auto w-10/12">
          <div className="flex items-center flex-shrink-0 text-white ml-4">
            <Link href={'/'} legacyBehavior>
              <span className="font-semibold text-7xl tracking-tight cursor-pointer mb-1">MOFIT</span>
            </Link>
          </div>
          <div className="flex items-center w-auto">
            <div className="text-5xl flex-grow">
              <Link href={'/'} legacyBehavior>
                <a className="mt-0 inline-block text-teal-200 hover:text-white mr-14">
                  모드선택
                </a>
              </Link>
              <Link href={'/ranking'} legacyBehavior>
                <a className="mt-0 inline-block text-teal-200 hover:text-white mr-14">
                  랭킹
                </a>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}