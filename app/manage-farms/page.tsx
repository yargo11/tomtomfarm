'use client';

import Farms from "@/components/farms";
import { FarmContext } from "@/context/farmContext";
import { addFarmToAPI, deleteFarmFromAPI } from "@/services/farmsService";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import type { FarmsProps } from "@/types";
import type { ChangeEvent } from "react";
import AddressInput from "@/components/inputs/addressInput";
import EmailInput from "@/components/inputs/emailInput";
import NameInput from "@/components/inputs/nameInput";
import { v4 as uuidv4 } from 'uuid';

import { FaPlus } from "react-icons/fa";

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
    const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false)

    const farmContext = useContext(FarmContext)
    const { v4: uuidv4 } = require('uuid');

    const listFarms: string[] | undefined = farmContext?.farms.map(farm => farm.farmName)
    const listEmails: string[] | undefined = farmContext?.farms.map(farm => farm.email)

    // update cropsProduction objet when clicking a crop from list
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
                    farm.farmName
                        ? farm.farmName.toLowerCase().includes(searchFilter.toLowerCase())
                        : String(farm.id).toLowerCase().includes(searchFilter.toLowerCase())
                )
                setFilteredFarms(filtered)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchFilter, farmContext?.farms])

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setLandUnit(e.target.value);
        setFarm({ ...farm, landUnit: e.target.value })
    };

    function handleOpenModal() {
        setFarm({} as FarmsProps)
        setLandUnit("")
        setSelectedCrops(new Set([]))

        onOpen()
    }

    function handleAddNewFarm() {
        const newFarm = {
            id: uuidv4(),
            farmName: farm.farmName,
            landArea: farm.landArea,
            landUnit: farm.landUnit,
            email: farm.email ? farm.email : '',
            address: farm.address ? farm.address : '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cropProductions: farm.cropProductions,
        };

        addFarmToAPI(newFarm)
            .then((updatedFarms) => {
                farmContext?.setFarms(updatedFarms)
                setIsEmailInvalid(false)
                alert(`${newFarm.farmName ? newFarm.farmName : newFarm.id} succefully added`);
            })
            .catch((error) => {
                console.error('Error: ', error)
                alert('Sommething went wrong')
            })

        onClose()
    }

    function handleDeleteFarm(id: string) {
        deleteFarmFromAPI(id)
            .then((updatedFarms: FarmsProps[]) => {
                farmContext?.setFarms(updatedFarms)
                alert('Farm deleted!')
            })
            .catch((error: Error) => console.error('Error: ', error))
    }

    function checkFarmForSubmit() {
        if (!listFarms?.includes(farm.farmName) &&
            !isEmailInvalid &&
            farm.landArea > 0 &&
            farm.landUnit !== '' &&
            farm.cropProductions.length >= 1
        ) {
            return true
        }
        return false
    }

    return (
        <div className='min-h-screen p-2 flex flex-col items-center gap-y-4'>
            <h1 className='text-2xl text-gray-900 font-mono'>Farms list</h1>
            <div className='flex flex-col max-w-3xl w-full rounded-lg gap-y-4'>
                <div className="flex flew-row justify-between items-center">
                    <Button onPress={handleOpenModal} color="success" className="text-slate-50"><FaPlus /> Farm</Button>
                    <Link href='/' className='hover:underline'>Back</Link>
                </div>
                <div className="flex flex-row gap-x-2">
                    <Input value={searchFilter} onValueChange={setSearchFilter} placeholder="Filter you search" variant="bordered" />
                </div>
                <Farms farms={filteredFarms} handleDeleteFarm={handleDeleteFarm} />
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="my-auto">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add new farm</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-y-3">

                                    <NameInput
                                        value={farm.farmName}
                                        onChange={value => setFarm({ ...farm, farmName: value })}
                                        listFarms={listFarms || []}
                                    />

                                    <EmailInput
                                        value={farm.email}
                                        isEmailInvalid={isEmailInvalid}
                                        setIsEmailInvalid={setIsEmailInvalid}
                                        onChange={(value) => setFarm({ ...farm, email: value })}
                                        listEmails={listEmails || []}
                                    />

                                    <AddressInput
                                        value={farm.address}
                                        onChange={(value) => setFarm({ ...farm, address: value })}
                                    />

                                    <Input
                                        isRequired
                                        label="LandArea"
                                        type="number"
                                        onChange={e => setFarm({ ...farm, landArea: Number(e.target.value) })}
                                        variant="bordered"
                                    />
                                    <Select
                                        isRequired
                                        className="w-full"
                                        label="Land Unit"
                                        placeholder="Select land unit"
                                        selectedKeys={[landUnit]}
                                        onChange={handleSelectionChange}
                                        variant="bordered"
                                    >
                                        {landUnitType.map((unit) => (
                                            <SelectItem key={unit.key}>{unit.label}</SelectItem>
                                        ))}
                                    </Select>

                                    <Select
                                        className="w-full"
                                        label="Select crops"
                                        placeholder="Corn, beans, rice..."
                                        selectionMode="multiple"
                                        variant="bordered"
                                        selectedKeys={selectedCrops}
                                        onSelectionChange={(keys) => {
                                            if (keys instanceof Set) {
                                                setSelectedCrops(new Set(Array.from(keys).map((key) => String(key))));
                                            }
                                        }}
                                    >
                                        {farmContext?.cropsList?.length ? (farmContext.cropsList.map(crops => {
                                            return (
                                                <SelectItem key={crops.id}>{crops.name}</SelectItem>
                                            )
                                        })) : <SelectItem>No Crops Available</SelectItem>
                                        }
                                    </Select>
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={onClose}>Cancel</Button>
                                <Button
                                    onClick={() => handleAddNewFarm()}
                                    color={!checkFarmForSubmit() ? 'default' : 'success'}
                                    disabled={!checkFarmForSubmit()}
                                    className="text-slate-50"
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