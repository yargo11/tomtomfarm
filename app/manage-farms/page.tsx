'use client';

import Farms from "@/components/farms";
import { FarmContext } from "@/context/farmContext";
import { addFarmToAPI, deleteFarmFromAPI } from "@/services/farmsService";
import { validateEmail } from "@/utils";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import type { FarmsProps } from "@/types";
import type { ChangeEvent } from "react";
import SelectCrops from "@/components/selectCrops";

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
    const [touchedEmail, setTouchedEmail] = useState<boolean>(false)
    const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false)

    const farmContext = useContext(FarmContext)

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
                    farm.farmName.toLowerCase().includes(searchFilter.toLowerCase())
                )
                setFilteredFarms(filtered)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchFilter, farmContext?.farms])

    // delay on email input
    useEffect(() => {
        if (!touchedEmail) return
        const delay = setTimeout(() => {
            if (listEmails?.includes(farm.email)) {
                setIsEmailInvalid(true)
            } else {
                setIsEmailInvalid(validateEmail(farm.email))
            }
        }, 500)

        return () => clearTimeout(delay)
    }, [farm.email, touchedEmail, listEmails])

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
            .then((updatedFarms) => {
                farmContext?.setFarms(updatedFarms)
                setIsEmailInvalid(false)
                alert(`${newFarm.farmName} succefully added`);
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

    function handleChangeEmail(email: string) {
        setFarm({ ...farm, email: email })
        setTouchedEmail(true)
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
                            <ModalHeader className="flex flex-col gap-1">Add new farm</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-y-4">
                                    <Input
                                        isRequired
                                        label=" Name"
                                        type="text"
                                        errorMessage="Name already exists"
                                        isInvalid={listFarms?.includes(farm.farmName)}
                                        onChange={e => setFarm({ ...farm, farmName: e.target.value })}
                                        variant="bordered"
                                    />
                                    <Input
                                        isRequired
                                        label=" Email"
                                        type="email"
                                        errorMessage="Invalid email or email already exists"
                                        isInvalid={isEmailInvalid}
                                        onChange={(e) => handleChangeEmail(e.target.value)}
                                        variant="bordered"
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

                                    <h1 className={'text-lg'}>Select your crops</h1>

                                    <SelectCrops />
                                    {/* <Listbox
                                            disallowEmptySelection
                                            aria-label="Multiple selection example"
                                            selectedKeys={selectedCrops}
                                            selectionMode="multiple"
                                            variant="flat"
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
                                        </Listbox> */}
                                </div>



                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={onClose}>Cancel</Button>
                                <Button
                                    onClick={() => handleAddNewFarm()}
                                    color={!checkFarmForSubmit() ? 'default' : 'success'}
                                    disabled={!checkFarmForSubmit()}
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