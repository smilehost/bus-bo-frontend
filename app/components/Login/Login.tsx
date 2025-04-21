import React from 'react'
import InputLabel from '../Form/InputLabel'
import ButtonBG from '../Form/ButtonBG'
function Login() {
  return (
    <div className=' shadow-xl rounded-lg overflow-hidden'>
      <div className='flex flex-col justify-center items-center gap-3 bg-main py-8 w-[448px] text-white'>
        <div className='border-6 border-white rounded-full w-[64px] h-[64px] shadow' />
        <div className='flex flex-col gap-2 items-center'>
          <p className='font-bold text-xl '>Bus Ticketing System</p>
          <p className='text-xs'>Log in to access your account</p>
        </div>
      </div>
      <form className='p-6 flex flex-col gap-8'>
        <InputLabel label='Username' placeholder='Enter your username' />
        <InputLabel label='Password' placeholder='Enter your password' />
       <div className='mt-2'>
        <ButtonBG size_w={`w-[100%]`} text='Sign In'/>
       </div>
      </form>
    </div>
  )
}

export default Login
