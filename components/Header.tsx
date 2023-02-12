import Image from 'next/image'
import React from 'react'
import { Bars4Icon, BeakerIcon, BellIcon, ChevronDownIcon, GlobeAltIcon, HomeIcon, PlusIcon, SparklesIcon, SpeakerWaveIcon, VideoCameraIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassCircleIcon, StarIcon } from '@heroicons/react/24/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'


function Header() {
  const { data : session } = useSession();
  return (
    <div className='sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center'>
        <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
            <Link href={'/'}>
                <Image alt="React" objectFit="container" src="" layout="fill" />
            </Link>
        </div>
    
        <div className='flex items-center xl:min-w-[300px]'>
            <HomeIcon className='h-5 w-5' />
            <p className='flex-1 hidden ml-2 lg:inline'>Home</p>
            <ChevronDownIcon className='h-5 w-5' />
        </div>

        {/* search box */}
        <form className='flex flex-1 items-center space-x-2 border-gray-200 rounded-sm bg-gray-100 px-3 py-1'>
            <MagnifyingGlassCircleIcon className="h-6 w-6 text-gray-400"/>
            <input className="flex-1 bg-transparent outline-none" type="text" placeholder='Search UpKeep '></input>
            <button type="submit" hidden />
        </form>
        <div className='m-x-5 hidden items-center space-x-2  text-gray-500 lg:inline-flex'>
            <SparklesIcon className='icon' />
            <GlobeAltIcon  className='icon' />
            <VideoCameraIcon  className='icon' />
            <hr className="h-10 border border-gray-100"/>
            <SparklesIcon className='icon' />
            <BellIcon  className='icon' />
            <PlusIcon  className='icon' />
            <SpeakerWaveIcon  className='icon' />
        </div>
        <div className='ml-5 flex-items center lg:hidden'>
            <Bars4Icon className='icon'/>
        </div>

        {/*Sign in if a session is present render login op else login  */}
        {session ? (
            <div onClick={() => signOut()} className='hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex'>
                <div className="flex-1 text-xs">
                    <p className="truncate">{session?.user?.name}</p>
                    <p className='text-gray-400'>1 Karma</p>
                </div>
                < ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400"/>
            </div>
        ) : (
            <div onClick={() => signIn()} className='hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex'>
                <p className='text-gray-400'>Sign In</p>
            </div>
        )}
       
    </div>
  )
}

export default Header