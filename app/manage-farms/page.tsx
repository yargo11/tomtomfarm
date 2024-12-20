'use client';

import Farms from "@/components/farms";
import { FarmContext } from "@/context/farmContext";
import { addFarmToAPI, deleteFarmFromAPI } from "@/services/farmsService";
import type { FarmsProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import type { ChangeEvent } from "react";

const landUnitType = [
    { key: "hectare", label: "Hectare" },
    { key: "acre", label: "Acre" },
];

export default function ManageFarms() {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [farm, setFarm] = useState<FarmsProps>({} as FarmsProps) //new farm
    const [landUnit, setLandUnit] = useState<string>("")
    const [searchFilter, setSearchFilter] = useState<string>('')
    const [filteredFarms, setFilteredFarms] = useState<FarmsProps[]>([])
    const [selectedCrops, setSelectedCrops] = useState<Set<string>>(new Set([]));

    const farmContext = useContext(FarmContext)

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
            if (farmContext?.farms) {
                const filtered = farmContext.farms.filter((farm) =>
                    farm.farmName.toLowerCase().includes(searchFilter.toLowerCase())
                )
                setFilteredFarms(filtered)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchFilter, farmContext])

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

        addFarmToAPI(newFarm)
            .then((updatedFarms) => { farmContext?.setFarms(updatedFarms) })
            .catch((error) => console.error('Error: ', error))

        onClose()
    }

    function handleDeleteFarm(id: string) {
        deleteFarmFromAPI(id)
            .then((updatedFarms: FarmsProps[]) => { farmContext?.setFarms(updatedFarms) })
            .catch((error: Error) => console.error('Error: ', error))
    }

    return (
        <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
            <h1 className='text-2xl'>Tomtom Crops</h1>
            <div className='flex flex-col max-w-lg w-full rounded-lg gap-y-4'>
                <div className="flex flew-row justify-between items-center">
                    <Button onPress={onOpen}>Add new Farm</Button>
                    <Link href='/'>Back</Link>
                </div>
                <Input value={searchFilter} onValueChange={setSearchFilter} placeholder="Filter you search" />

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
                                    label="Farm Email"
                                    type="type"
                                    onChange={e => setFarm({ ...farm, email: e.target.value })}
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
                                    {farmContext?.cropsList?.length ? (farmContext.cropsList.map(crops => {
                                        return (
                                            <ListboxItem key={crops.id}>{crops.name}</ListboxItem>
                                        )
                                    })) : <ListboxItem>No Crops Available</ListboxItem>}
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