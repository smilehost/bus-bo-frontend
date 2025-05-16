import React from 'react'

//component
import TitlePage from './TitlePage'
import ButtonBG from '../Form/ButtonBG'

//icon
import { Plus } from 'lucide-react'

type TitlePageAndButton = {
    title: string;
    description: string;
    btnText: string;
    handleOpenModel: () => void;
}

function TitlePageAndButton({ title, description, handleOpenModel, btnText }: TitlePageAndButton) {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <TitlePage title={title} description={description} />
            <ButtonBG size='h-[38px]' text={btnText} icon={Plus} onClick={handleOpenModel} />
        </div>

    )
}

export default TitlePageAndButton
