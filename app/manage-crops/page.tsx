'use client';

import { FarmContext } from "@/context/farmContext";
import { addCropsToAPI, deleteCropFromAPI } from "@/services/cropsService";
import type { CropsProps, FarmsProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function ManageCrops() {

    const farmContext = useContext(FarmContext)

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [newCrop, setNewCrop] = useState<string>('')

    const listCrops: string[] | undefined = farmContext?.cropsList.map(crop => crop.name.toLowerCase())

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
            alert('This crops is inserted in some farms, delete from farms first!')
        }
    }

    return (
        <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
            <h1 className='text-2xl'>Tomtom Crops</h1>
            <div className='max-w-lg w-full p-1 m-1 rounded-lg'>
                <div className="flex flew-row justify-between items-center mb-4">
                    <Button
                        onPress={onOpen}
                        color='success'
                        className="text-slate-50"
                    >
                        <FaPlus /> Add new Crop
                    </Button>
                    <Link href='/' className="underline-offset-2 hover:underline transition-all duration-200">Back</Link>
                </div>
                <ul className="flex flex-col bg-slate-50 border-1 rounded-md p-2 my-4 shadow-lg">
                    {farmContext?.cropsList.map((crop, idx) => {
                        return (
                            <li key={crop.id} className='flex flex-col p-1 '>
                                <div className='flex flew-row justify-between items-center'>
                                    {crop.id} - {crop.name}

                                    <Popover placement="top">
                                        <PopoverTrigger>
                                            <Button color='danger'>Delete</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="px-1 py-2 flex flex-col">
                                                <div className="text-small font-bold text-center">Confirm delete?</div>
                                                <div className="flex flex-row gap-x-4 justify-center">
                                                    <Button
                                                        color='danger'
                                                        onClick={() => deleteCrop(crop.id.toString())}
                                                    >
                                                        Confirm
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {idx !== farmContext.cropsList.length - 1 &&
                                    <Divider className="my-2" />
                                }
                            </li>
                        )
                    })}
                </ul>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="my-auto">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add new crop</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Crop"
                                    type="text"
                                    errorMessage="Crop already exists"
                                    isInvalid={listCrops?.includes(newCrop)}
                                    value={newCrop}
                                    onValueChange={setNewCrop}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color={(listCrops?.includes(newCrop) || newCrop === '') ? 'default' : 'success'}
                                    onClick={() => AddCrop(newCrop)}
                                    disabled={listCrops?.includes(newCrop) || newCrop === ''}
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}