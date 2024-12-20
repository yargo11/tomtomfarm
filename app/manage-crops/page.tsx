'use client';

import { addCropsToAPI, deleteCropFromAPI, fetchCropTypes } from "@/services/cropsService";
import { fetchFarmsFromAPI } from "@/services/farmsService";
import type { CropsProps, FarmsProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ManageCrops() {

    const [cropsList, setCropsList] = useState<CropsProps[]>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newCrop, setNewCrop] = useState<string>('')

    const getData = useCallback(() => {
        fetchCropTypes()
            .then(data => setCropsList(data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    function AddCrop(crop: string) {

        const newCropId = cropsList.length === 0
            ? '1'
            : Math.max(...cropsList.map(crop => Number(crop.id))) + 1

        addCropsToAPI(newCropId.toString(), crop)
            .then((updatedCrops: CropsProps[]) => { setCropsList(updatedCrops) })
            .catch((error: Error) => console.error('Error: ', error))
    }


    async function checkFarmsBeforeDeleteCrop(id: string) {
        let cropExists = false
        try {
            const farms = await fetchFarmsFromAPI()
            farms.map((farm: FarmsProps) =>
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
                .then((updatedCrops: CropsProps[]) => { setCropsList(updatedCrops) })
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
                <ul>
                    {cropsList.map(crop => {
                        return (
                            <li key={crop.id}>{crop.id} - {crop.name}
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