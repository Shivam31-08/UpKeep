import { useSession } from 'next-auth/react'
import React from 'react'

type Props = {
    seed?: string
    large?: boolean
}

function Avatar({seed, large}: Props) {
    const {data : session}=useSession();
  return (
    <div className={`relative h-10 w-10 overflow-hidden rounded-full border-gray-300 bg-white ${large && 'h-20 w-20'}`}>
        <img src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${seed || session?.user?.name || 'placehoder'}`}/>
    </div>
  )
}

export default Avatar