import React from 'react'

type ProfileProps = {
    size: string,
    charactor: string
}

function Profile({ size, charactor }: ProfileProps) {

    return (
        <div className={`${size} custom-bg-main rounded-full flex justify-center items-center text-white`}>
            <p className='text-[14px] font-medium'>{charactor.toUpperCase()}</p>
        </div>
    )
}

export default Profile
