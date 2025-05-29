import React from 'react'

//component
import ButtonBG from '../Form/ButtonBG'

//icon
import { Plus } from 'lucide-react'

type TitlePageProps = {
    title: string;
    description?: string;
    btnText?: string;
    handleOpenModel?: () => void;
}

function TitlePage({ title, description, handleOpenModel, btnText }: TitlePageProps) {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className='flex flex-col'>
                <p className='text-[20px] font-bold'>{title}</p>
                {description && (
                    <p className='text-[14px] text-[#4B5563]'>{description}</p>
                )}
            </div>
            {btnText && handleOpenModel && (
                <ButtonBG size='h-[38px]' text={btnText} icon={Plus} onClick={handleOpenModel} />
            )}
        </div>

    )
}

export default TitlePage
