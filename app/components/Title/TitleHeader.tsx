import React from 'react'

type TitleHeaderProps = {
    text: string
}
function TitleHeader({ text }: TitleHeaderProps) {
    return (
      <h1 className='text-2xl font-semibold text-gray-800'>{text}</h1>
    );
  }

export default TitleHeader