import React from 'react'

interface TextErrorProps {
    text: string;
}
function TextError({text}: TextErrorProps) {
  return (
    <p className='text-red-500 text-xs'>* {text}</p>
  )
}

export default TextError
