import React from 'react'
import Image from 'next/image'

function page() {
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <Image
                src={"/qr.jpg"}
                width={1000}
                height={1000}
                alt="qr"
                priority
         
            />
        </div>
    )
}

export default page
