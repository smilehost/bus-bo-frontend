"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import Image from 'next/image'

//component
import InputLabel from '../Form/InputLabel'
import TitleModel from '../Title/TitleModel'
import ButtonBG from '../Form/ButtonBG'
import ButtonDefault from '../Form/ButtonDefault'

type MemberModelProps = {
    open: boolean
    onClose: () => void
    onHandle: (member: { name: string, phone: string }) => void
}

function MemberModel({ open, onClose, onHandle }: MemberModelProps) {
    //new member 
    const [newName, setNewName] = useState<string>('')
    const [newPhone, setNewPhone] = useState<string>('')

    const handleSubmit = () => {
        if (!newName || !newPhone) {
            alert("กรอกบ่ครบ")
            return;
        }
        onHandle({ name: newName, phone: newPhone });
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <div className='w-[448px] py-2 relative'>
                    <div className=''>
                        <TitleModel title="Add New Member" description='Fill in the member details below' />
                        <div className='mt-7 flex flex-col gap-4'>
                            <InputLabel label='Member Name' placeholder='Enter member name' type='text' size='' setValue={setNewName} />
                            <InputLabel label='Phone Number' placeholder='123-456-7890' type='text' size='' setValue={setNewPhone} />
                        </div>
                    </div>
                    <div className='flex gap-3 justify-end mt-7'>
                        <ButtonDefault size="" text='Cancel' onClick={onClose} />
                        <ButtonBG size="" text='Add Member' onClick={handleSubmit} />
                    </div>
                    <div className='absolute top-0 right-0 cursor-pointer'
                        onClick={onClose}
                    >
                        <Image
                            src={"/icons/close.svg"}
                            width={24}
                            height={24}
                            priority
                            alt='close-icon'
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MemberModel
