import Link from 'next/link'
import LogoutButton from "./LogoutButton";


export default function NavBar({ children }) {
  return (
    <>

      <nav className='bg-teal-500 p-2'>
        <div className="flex items-center justify-between flex-wrap mx-auto w-8/12">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <Link href={'/'} legacyBehavior>
              <span className="font-semibold text-xl tracking-tight cursor-pointer">MOFIT</span>
            </Link>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              <Link href={'/mypage'} legacyBehavior>
                <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                  마이페이지
                </a>
              </Link>
              <Link href={'/ranking'} legacyBehavior>
                <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                  랭킹
                </a>
              </Link>
            </div>
            <div className='flex justify-end'>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}