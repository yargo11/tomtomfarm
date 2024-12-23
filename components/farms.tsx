'use client'

import type { CropsProps, FarmsProps } from "@/types";
import type { ChangeEvent } from "react";
import { Button } from "@nextui-org/button";
import { Checkbox, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useContext, useState } from "react";
import { Input } from "@nextui-org/input";
import { fetchFarmsFromAPI, updateFarmToAPI } from "@/services/farmsService";
import { FarmContext } from "@/context/farmContext";
import { formatarHora } from "@/utils";
import { FaRegTrashAlt } from "react-icons/fa";

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
                alert(`Farm ${farmToEdit.farmName ? farmToEdit.farmName : farmToEdit.id} updated!`)
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

    const removeCropFromFarm = (farm: FarmsProps, cropId: number) => {

        const updatedCropProductions = farm.cropProductions.filter(
            (crop) => crop.cropTypeId !== cropId
        );

        setFarmToEdit({ ...farm, cropProductions: updatedCropProductions })

        console.log(updatedCropProductions)
        console.log(farmToEdit)

        updateFarmToAPI({ ...farmToEdit, updatedAt: new Date().toISOString() })
            .then(data => {
                alert(`Crop ${cropId} removed!`)
                fetchFarmsFromAPI()
                console.log(data)
            })
            .catch(error => console.log(error))
            .finally(() => onClose());
    }

    const sortedFarms = farms.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <>
            <div className='w-full flex flex-col sm:flex-row justify-center items-center gap-4'>
                <Pagination
                    initialPage={currentPage}
                    total={Math.ceil(farms.length / Number(resultsPerPage))}
                    className="flex md:w-3/4"
                    onChange={setCurrentPage}
                    isCompact
                />
                <Select
                    className="flex md:w-1/4 "
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
                    <div className="flex flex-col bg-slate-50 border-1 rounded-md p-2 gap-y-4 my-4 shadow-lg" key={farm.id}>
                        <div className='w-full flex flex-row justify-between flex-wrap'>
                            <div className="flex flex-col items-start flex-wrap">
                                <p className="text-lg"><span className="font-semibold">Name</span>:
                                    {farm.farmName ? farm.farmName : farm.id}
                                </p>
                                <p className="text-lg"><span className="font-semibold">Email</span>:
                                    {farm.email ? farm.email : 'Unknow'}
                                </p>
                                <p className="text-lg"><span className="font-semibold">Address</span>:
                                    {farm.address ? farm.address : 'Unknow'}
                                </p>
                            </div>
                            <div>
                                <p className="text-lg"><span className="font-semibold">
                                    Size: </span>: {farm.landArea} {farm.landUnit}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col border-1 border-slate-500 shadow-lg rounded-md p-2">
                            {farm.cropProductions.map((crop, idx) => {
                                return (
                                    <div key={crop.id}>
                                        <div className='w-full flex flex-row justify-between flex-wrap'>
                                            <div className="flex items-center">
                                                {/* ID:{crop.id} | */}
                                                {theCrops[crop.cropTypeId]}
                                            </div>
                                            <div className="flex flex-row items-center flex-wrap">
                                                Irrigated: <span className={crop.isIrrigated ? 'text-green-500 pl-1 font-semibold' : 'text-red-500 pl-1 font-semibold '}>{crop.isIrrigated ? 'Yes' : 'No'}</span>
                                                <Divider orientation="vertical" className="h-auto mx-2" />
                                                Insured: <span className={crop.isInsured ? 'text-green-500 pl-1 font-semibold' : 'text-red-500 pl-1 font-semibold'}>{crop.isInsured ? 'Yes' : 'No'}</span>
                                                <Divider orientation="vertical" className="h-auto mx-2" />

                                                {farm.cropProductions.length >= 2 &&
                                                    <Popover placement="top">
                                                        <PopoverTrigger>
                                                            <Button color='danger'>
                                                                <FaRegTrashAlt />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <div className="px-1 py-2 flex flex-col">
                                                                <div className="text-small font-bold text-center">Confirm remove?</div>
                                                                <div className="flex flex-row gap-x-4 justify-center">
                                                                    <Button
                                                                        color='danger'
                                                                        onClick={() => removeCropFromFarm(farm, crop.id)}
                                                                    >
                                                                        Confirm
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                }
                                            </div>
                                        </div>
                                        {idx !== farm.cropProductions.length - 1 &&
                                            <Divider orientation="horizontal" className="my-2" />
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-full flex flex-row justify-between items-center">
                            <p>Created at: {formatarHora(farm.createdAt)} </p>
                            <p>Last update: {formatarHora(farm.updatedAt)} </p>
                        </div>
                        <div className="w-full flex flex-row justify-between items-center flex-wrap gap-2">
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-fit my-auto" >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Editing farm</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-row gap-4 flex-wrap w-full">
                                    <div className="flex flex-col gap-y-4 w-full">
                                        <Input
                                            label="Farm Name"
                                            type="text"
                                            value={farmToEdit.farmName}
                                            variant="bordered"
                                            onChange={e => setFarmToEdit({ ...farmToEdit, farmName: e.target.value })}
                                        />

                                        <Input
                                            label="Farm Email"
                                            type="type"
                                            value={farmToEdit.email}
                                            variant="bordered"
                                            onChange={e => setFarmToEdit({ ...farmToEdit, email: e.target.value })}
                                        />

                                        <Input
                                            label="Address Email"
                                            type="type"
                                            value={farmToEdit.address}
                                            variant="bordered"
                                            onChange={e => setFarmToEdit({ ...farmToEdit, address: e.target.value })}
                                        />
                                        <Input
                                            label="LandArea"
                                            type="number"
                                            value={farmToEdit.landArea.toString()}
                                            variant="bordered"
                                            onChange={e => setFarmToEdit({ ...farmToEdit, landArea: Number(e.target.value) })}
                                        />
                                        <Select
                                            className="w-full"
                                            label="Land Unit"
                                            placeholder="Select land unit"
                                            defaultSelectedKeys={[farmToEdit.landUnit.toLocaleLowerCase()]}
                                            selectedKeys={[landUnit]}
                                            onChange={handleSelectiUnitOnChange}
                                            variant="bordered"
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
                                                            Irrigated
                                                        </Checkbox>
                                                        <Checkbox isSelected={cropsSelected.isInsured} onValueChange={() => { handleInsuredCropChange(cropsSelected.id) }}>
                                                            Insured
                                                        </Checkbox>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="success"
                                    onClick={() => handleUpdateFarm()}
                                    className="text-slate-50"
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}