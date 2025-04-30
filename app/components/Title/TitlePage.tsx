import React from 'react'

//component
import TitleHeader from './TitleHeader'

type TitleProps = {
    title: string,
    description: string
}
function TitlePage({ title, description }: TitleProps) {
    return (
      <div className='flex flex-col'>
        <TitleHeader text={title} />
        <p className='text-gray-500 text-sm'>{description}</p>
      </div>
    );
  }

export default TitlePage