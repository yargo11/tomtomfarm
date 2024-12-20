'use client';

import Farms from "@/components/farms";
import { addFarm, deleteFarm } from "@/functions/FarmFunctions";
import { fetchCropTypes } from "@/services/cropsService";
import { fetchFarmsFromAPI } from "@/services/farmsService";
import type { CropsProps, FarmsProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

const landUnitType = [
    { key: "hectare", label: "Hectare" },
    { key: "acre", label: "Acre" },
];

export default function ManageFarms() {

    const [farms, setFarms] = useState<FarmsProps[]>([])
    const [cropsList, setCropsList] = useState<CropsProps[]>([])
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [farm, setFarm] = useState<FarmsProps>({} as FarmsProps)
    const [landUnit, setLandUnit] = useState<string>("")
    const [searchFilter, setSearchFilter] = useState<string>('')
    const [filteredFarms, setFilteredFarms] = useState<FarmsProps[]>([])
    const [selectedCrops, setSelectedCrops] = useState<Set<string>>(new Set([]));

    useEffect(() => {
        fetchFarmsFromAPI()
            .then(data => setFarms(data))
            .catch(error => console.log(error));

        fetchCropTypes()
            .then(data => setCropsList(data))
            .catch(error => console.log(error));;
    }, []);

    //update cropsProduction objet when clicking a crop from list
    useEffect(() => {
        const newCropProductions = Array.from(selectedCrops).map((key, index) => ({
            id: Number.parseInt(key, 10),
            cropTypeId: Number.parseInt(key, 10),
            isIrrigated: false,
            isInsured: false
        }));
        setFarm((prevFarm) => ({ ...prevFarm, cropProductions: newCropProductions }))
    }, [selectedCrops])

    useEffect(() => {
        const timer = setTimeout(() => {
            const filtered = farms.filter((farm) => farm.farmName.toLowerCase().includes(searchFilter.toLowerCase()))
            setFilteredFarms(filtered)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchFilter, farms])

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setLandUnit(e.target.value);
        setFarm({ ...farm, landUnit: e.target.value })
    };

    function handleAddNewFarm() {
        const newFarm = {
            id: farm.id,
            farmName: farm.farmName,
            landArea: farm.landArea,
            landUnit: farm.landUnit,
            email: farm.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cropProductions: farm.cropProductions,
        };

        addFarm(newFarm)
            .then((updatedFarms) => { setFarms(updatedFarms) })
            .catch((error) => console.error('Error: ', error))

        onClose()
    }

    function handleDeleteFarm(id: string) {
        deleteFarm(id)
            .then((updatedFarms) => { setFarms(updatedFarms) })
            .catch((error) => console.error('Error: ', error))
    }

    return (
        <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
            <h1 className='text-2xl'>Tomtom Crops</h1>
            <div className='max-w-lg w-full p-1 m-1 rounded-lg bg'>
                <div className="flex flew-row justify-between items-center">
                    <Button onPress={onOpen}>Add new Farm</Button>
                    <Link href='/'>Back</Link>
                </div>
                <Input value={searchFilter} onValueChange={setSearchFilter} />

                <Farms farms={filteredFarms} handleDeleteFarm={handleDeleteFarm} />
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
                                <Input
                                    label="Farm Email"
                                    type="type"
                                    onChange={e => setFarm({ ...farm, email: e.target.value })}
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
                                <Button onClick={() => handleAddNewFarm()}>Confirm</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}