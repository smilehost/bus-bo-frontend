import React from 'react'

interface TextErrorProps {
  text: string;
  fontSize?: string;
}
function TextError({ text, fontSize = "13px" }: TextErrorProps) {
  return (
    <p className={`text-red-500`}
      style={{
        fontSize: fontSize
      }}
    >* {text}</p>
  )
}

export default TextError
