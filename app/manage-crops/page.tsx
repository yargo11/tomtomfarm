'use client';

import { FarmContext } from "@/context/farmContext";
import { addCropsToAPI, deleteCropFromAPI } from "@/services/cropsService";
import type { CropsProps, FarmsProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useContext, useState } from "react";

export default function ManageCrops() {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [newCrop, setNewCrop] = useState<string>('')

    const farmContext = useContext(FarmContext)

    function AddCrop(crop: string) {

        const newCropId = farmContext?.cropsList.length === 0
            ? '1'
            : farmContext?.cropsList?.length ? (Math.max(...farmContext.cropsList.map(crop => Number(crop.id))) + 1) : 0

        addCropsToAPI(newCropId.toString(), crop)
            .then((updatedCrops: CropsProps[]) => { farmContext?.setCropsList(updatedCrops) })
            .catch((error: Error) => console.error('Error: ', error))
            .finally(() => { onClose() })
    }

    async function checkFarmsBeforeDeleteCrop(id: string) {
        let cropExists = false
        try {
            farmContext?.farms.map((farm: FarmsProps) =>
                farm.cropProductions.map(crops => {
                    if (
                        crops.id.toString() === id
                    ) { cropExists = true }
                }));
            return cropExists;
        } catch (error) {
            console.error("Error fetching farms:", error);
            return false;
        }
    }

    async function deleteCrop(id: string) {
        const cropExists = await checkFarmsBeforeDeleteCrop(id)
        if (!cropExists) {
            deleteCropFromAPI(id)
                .then((updatedCrops: CropsProps[]) => { farmContext?.setCropsList(updatedCrops) })
                .catch((error: Error) => console.error("Error: ", error))
        } else {
            console.log('This crops is inserted in some farms, delete from farms first!')
        }
    }

    return (
        <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
            <h1 className='text-2xl'>Tomtom Crops</h1>
            <div className='max-w-lg w-full p-1 m-1 rounded-lg'>
                <div className="flex flew-row justify-between items-center mb-4">
                    <Button onPress={onOpen}>Add new Crop</Button>
                    <Link href='/'>Back</Link>
                </div>
                <ul className="max-w-md bg-slate-800 p-4 rounded-md">
                    {farmContext?.cropsList.map(crop => {
                        return (
                            <li key={crop.id} className='flex flex-row items-center justify-between p-4 border-b-1'>
                                {crop.id} - {crop.name}
                                <Popover placement="top">
                                    <PopoverTrigger>
                                        <Button>Delete</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="px-1 py-2 flex flex-col gap-y-4">
                                            <div className="text-small font-bold text-center">Confirm delete?</div>
                                            <div className="flex flex-row gap-x-4 justify-center">
                                                <Button onClick={() => deleteCrop(crop.id.toString())}>Confirm</Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add new crop</ModalHeader>
                            <ModalBody>
                                <Input label="Crop" type="text" value={newCrop} onValueChange={setNewCrop} />
                            </ModalBody>
                            <ModalFooter>
                                <Button>Cancel</Button>
                                <Button onClick={() => AddCrop(newCrop)}>Confirm</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}