'use client'

import type { FarmsProps } from "@/types";
import type { ChangeEvent } from "react";
import { Button } from "@nextui-org/button";
import { Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useContext, useState } from "react";
import { Input } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { fetchFarmsFromAPI, updateFarmToAPI } from "@/services/farmsService";
import { FarmContext } from "@/context/farmContext";
import { formatarHora } from "@/utils";

interface FarmsPageProps {
    farms: FarmsProps[],
    handleDeleteFarm: (id: string) => void
}

const pageSize = [
    { key: "1", label: "1" },
    { key: "5", label: "5" },
    { key: "10", label: "10" },
    { key: "20", label: "20" }
];

const landUnitType = [
    { key: "hectare", label: "Hectare" },
    { key: "acre", label: "Acre" },
];

export default function Farms({ farms, handleDeleteFarm }: FarmsPageProps) {

    const [resultsPerPage, setResultsPerPage] = useState<string>('5')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [landUnit, setLandUnit] = useState<string>("")
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [farmToEdit, setFarmToEdit] = useState<FarmsProps>({} as FarmsProps)

    const startIndex = (currentPage - 1) * Number(resultsPerPage)
    const endIndex = startIndex + Number(resultsPerPage)

    const farmContext = useContext(FarmContext)

    const theCrops: Record<string, string> = {}
    if (farmContext?.cropsList) {
        for (const item of farmContext.cropsList) {
            theCrops[item.id] = item.name
        }
    }

    const handleSelectiUnitOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setLandUnit(e.target.value);
        setFarmToEdit({ ...farmToEdit, landUnit: e.target.value })
    };

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setResultsPerPage(e.target.value);
    };

    const handleOpenModal = (farm: FarmsProps) => {
        setFarmToEdit(farm)
        setLandUnit(farm.landUnit.toLowerCase())
        onOpen()
    }

    const handleUpdateFarm = () => {
        updateFarmToAPI({ ...farmToEdit, updatedAt: new Date().toISOString() })
            .then(data => {
                alert(`Farm ${farmToEdit.farmName} updated!`)
                fetchFarmsFromAPI()
                console.log(data)
            })
            .catch(error => console.log(error))
            .finally(() => onClose());
    }

    const handleIrrigatedCropChange = (cropSelectedId: number) => {
        setFarmToEdit((prevFarm) => ({
            ...prevFarm,
            cropProductions: prevFarm.cropProductions.map((crop) =>
                crop.id === cropSelectedId
                    ? { ...crop, isIrrigated: !crop.isIrrigated }
                    : crop
            )
        }))
    }

    const handleInsuredCropChange = (cropSelectedId: number) => {
        setFarmToEdit((prevFarm) => ({
            ...prevFarm,
            cropProductions: prevFarm.cropProductions.map((crop) =>
                crop.id === cropSelectedId
                    ? { ...crop, isInsured: !crop.isInsured }
                    : crop
            )
        }))
    }

    const sortedFarms = farms.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <>
            <div className='w-full flex flex-row justify-center items-center'>
                <Pagination
                    initialPage={currentPage}
                    total={Math.ceil(farms.length / Number(resultsPerPage))}
                    className="flex flex-1"
                    onChange={setCurrentPage}
                    isCompact
                />
                <Select
                    className="flex flex-1"
                    selectedKeys={resultsPerPage}
                    onChange={handleSelectionChange}
                    label="Results per page: "
                    labelPlacement="outside-left"
                >
                    {pageSize.map((pages) => (
                        <SelectItem key={pages.key}>{pages.label}</SelectItem>
                    ))}
                </Select>
            </div>
            {sortedFarms.slice(startIndex, endIndex).map((farm) => {
                return (
                    <div className="flex flex-col bg-slate-800 rounded-md p-2 gap-y-4 my-4" key={farm.id}>
                        <div className='w-full flex flex-row justify-between'>
                            <div className="flex flex-col items-start">
                                <p>Farm name: {farm.farmName}</p>
                                <p>Farm email: {farm.email}</p>
                                <p>Farm address: {farm.address}</p>
                            </div>
                            <div>
                                <p>Farm size: {farm.landArea} {farm.landUnit}</p>
                            </div>
                        </div>
                        <div className="flex flex-col bg-slate-600 rounded-md p-2">
                            {farm.cropProductions.map(crop => {
                                return (
                                    <div key={crop.id} className='w-full flex flex-row justify-between'>
                                        <div>
                                            <p>ID:{crop.id} | {theCrops[crop.cropTypeId]}</p>
                                        </div>
                                        <div>
                                            <p>
                                                Irrigated: {crop.isIrrigated ? 'Yes' : 'No'} | Insured: {crop.isInsured ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-full flex flex-row justify-between items-center">
                            <p>Created at: {formatarHora(farm.createdAt)} </p>
                            <p>Last update: {formatarHora(farm.updatedAt)} </p>
                        </div>
                        <div className="w-full flex flex-row justify-between items-center">
                            <p className="text-sm">Identifier: {farm.id}</p>
                            <div className="flex flex-row gap-x-4">
                                <Button color="primary" onPress={() => handleOpenModal(farm)}>Edit</Button>
                                <Popover placement="top">
                                    <PopoverTrigger>
                                        <Button color="danger">Delete</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="px-1 py-2 flex flex-col gap-y-4">
                                            <div className="text-small font-bold text-center">Confirm delete?</div>
                                            <div className="flex flex-row gap-x-4 justify-center">
                                                <Button color="danger" onClick={() => handleDeleteFarm(farm.id.toString())}>Confirm</Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                );
            })}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Editing farm</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-row gap-x-4">
                                    <div className="flex flex-col gap-y-4">
                                        <Input
                                            label="Farm Name"
                                            type="text"
                                            value={farmToEdit.farmName}
                                            onChange={e => setFarmToEdit({ ...farmToEdit, farmName: e.target.value })}
                                        />
                                        <Input
                                            label="LandArea"
                                            type="number"
                                            value={farmToEdit.landArea.toString()}
                                            onChange={e => setFarmToEdit({ ...farmToEdit, landArea: Number(e.target.value) })}
                                        />
                                        <Input
                                            label="Farm Email"
                                            type="type"
                                            value={farmToEdit.email}
                                            onChange={e => setFarmToEdit({ ...farmToEdit, email: e.target.value })}
                                        />
                                        <Select
                                            className="w-full"
                                            label="Land Unit"
                                            placeholder="Select land unit"
                                            defaultSelectedKeys={[farmToEdit.landUnit.toLocaleLowerCase()]}
                                            selectedKeys={[landUnit]}
                                            onChange={handleSelectiUnitOnChange}
                                        >
                                            {landUnitType.map((unit) => (
                                                <SelectItem key={unit.key}>{unit.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-y-4">
                                        <ul>
                                            {farmToEdit.cropProductions.map(cropsSelected => {
                                                return (
                                                    <li key={cropsSelected.cropTypeId} className="flex flex-col mb-2">
                                                        {theCrops[cropsSelected.cropTypeId]}
                                                        <Checkbox isSelected={cropsSelected.isIrrigated} onValueChange={() => { handleIrrigatedCropChange(cropsSelected.id) }}>
                                                            Is irrigated?
                                                        </Checkbox>
                                                        <Checkbox isSelected={cropsSelected.isInsured} onValueChange={() => { handleInsuredCropChange(cropsSelected.id) }}>
                                                            Is insured?
                                                        </Checkbox>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        {/* <h1 className={'text-lg'}>Select your crops</h1>
                                        <Listbox
                                            disallowEmptySelection
                                            aria-label="Multiple selection example"
                                            selectedKeys={selectedCrops}
                                            defaultSelectedKeys={farmToEdit.cropProductions.map(crop => crop.cropTypeId.toString())}
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
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={onClose}>Cancel</Button>
                                <Button color="success" onClick={() => handleUpdateFarm()}>Confirm</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
