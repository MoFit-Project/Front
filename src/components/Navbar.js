import Link from 'next/link'
import LogoutButton from "./LogoutButton";


export default function NavBar({ children }) {
  return (
    <>

      <nav className='bg-blue-700 p-2'>
        <div className="flex items-center justify-between mx-auto w-8/12">
          <div className="flex items-center flex-shrink-0 text-white ml-4">
            <Link href={'/'} legacyBehavior>
              <span className="font-semibold text-xl tracking-tight cursor-pointer mb-1">MOFIT</span>
            </Link>
          </div>
          <div className="flex items-center w-auto">
            <div className="text-sm flex-grow">
              <Link href={'/'} legacyBehavior>
                <a className="mt-0 inline-block text-teal-200 hover:text-white mr-4">
                  모드선택
                </a>
              </Link>
              <Link href={'/mypage'} legacyBehavior>
                <a className="mt-0 inline-block text-teal-200 hover:text-white mr-4">
                  마이페이지
                </a>
              </Link>
              <Link href={'/ranking'} legacyBehavior>
                <a className="mt-0 inline-block text-teal-200 hover:text-white mr-4">
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