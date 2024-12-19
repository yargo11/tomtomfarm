'use client';

import Farms from "@/components/farms";
import { fetchCropTypes } from "@/services/cropsService";
import { fetchFarms } from "@/services/farmsService";
import type { CropProductionProps, CropsProps, FarmsProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

const landUnitType = [
    { key: "hectare", label: "Hectare" },
    { key: "acre", label: "Acre" },
];

export default function ManageCrops() {

    const [farmList, setFarmList] = useState<FarmsProps[]>([])
    const [cropsList, setCropsList] = useState<CropsProps[]>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [farm, setFarm] = useState<FarmsProps>({} as FarmsProps)
    const [landUnit, setLandUnit] = useState<string>("")

    const [cropsProduction, setCropsProduction] = useState<CropProductionProps[]>([])

    const [selectedCrops, setSelectedCrops] = useState<Set<string>>(new Set([]));
    const selectedCropsValue = useMemo(() => Array.from(selectedCrops).join(", "), [selectedCrops]);

    const getData = useCallback(() => {

        fetchCropTypes()
            .then(data => setCropsList(data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);


    useEffect(() => {

        const newCropProductions = Array.from(selectedCrops).map((key, index) => ({
            id: Number.parseInt(key, 10), // O índice do item no array, incrementado para começar em 1.
            cropTypeId: Number.parseInt(key, 10), // Converta o valor string para um número.
            isIrrigated: false, // Valor inicial padrão.
            isInsured: false, // Valor inicial padrão.
        }));

        setFarm((prevFarm) => ({ ...prevFarm, cropProductions: newCropProductions }))

    }, [selectedCrops])

    const AddFarm = () => {

        const newFarm = {
            "id": farm.id,
            "farmName": farm.farmName,
            "landArea": farm.landArea,
            "landUnit": farm.landUnit,
            "cropProductions": farm.cropProductions
        }

        fetch('http://localhost:3000/farms', {
            method: 'POST',
            headers: {
                'Content-type': 'applciation/json',
            },
            body: JSON.stringify(newFarm)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => { getData() })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => getData());
    }

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setLandUnit(e.target.value);
        setFarm({ ...farm, landUnit: e.target.value })
    };

    return (
        <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
            <h1 className='text-2xl'>Tomtom Crops</h1>
            <div className='max-w-lg w-full p-1 m-1 rounded-lg bg'>
                <div className="flex flew-row justify-between items-center">
                    <Button onPress={onOpen}>Add new Farm</Button>
                    <Link href='/'>Back</Link>
                </div>
                <Farms />
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add new crop</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Farm Name"
                                    type="text"
                                    onChange={e => setFarm({ ...farm, farmName: e.target.value })}
                                />
                                <Input
                                    label="LandArea"
                                    type="number"
                                    onChange={e => setFarm({ ...farm, landArea: Number(e.target.value) })}
                                />
                                <Select
                                    className="w-full"
                                    label="Land Unit"
                                    placeholder="Select land unit"
                                    selectedKeys={[landUnit]}
                                    onChange={handleSelectionChange}
                                >
                                    {landUnitType.map((unit) => (
                                        <SelectItem key={unit.key}>{unit.label}</SelectItem>
                                    ))}
                                </Select>

                                <h1 className={'text-lg'}>Select your crops</h1>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Multiple selection example"
                                    selectedKeys={selectedCrops}
                                    selectionMode="multiple"
                                    variant="flat"
                                    //REVER ESSE SELECTION
                                    onSelectionChange={(keys) => {
                                        if (keys instanceof Set) {
                                            setSelectedCrops(new Set(Array.from(keys).map((key) => String(key))));
                                        }
                                    }}
                                >
                                    {cropsList.map(crops => {
                                        return (
                                            <ListboxItem key={crops.id}>{crops.name}</ListboxItem>
                                        )
                                    })}
                                </Listbox>

                            </ModalBody>
                            <ModalFooter>
                                <Button>Cancel</Button>
                                <Button onClick={() => AddFarm()}>Confirm</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}