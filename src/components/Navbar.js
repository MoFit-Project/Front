import { Disclosure, Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import LogoutButton from "./LogoutButton";


export default function NavBar() {
  return (
    <Disclosure as="nav" className="bg-green-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-12 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={'/'} legacyBehavior>
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src="https://cdn-icons-png.flaticon.com/512/7420/7420915.png"
                      alt="Your Company"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">

                  </div>
                </div>
                <div>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </Disclosure>
  )
}
