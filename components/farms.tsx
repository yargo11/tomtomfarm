'use client'

import { fetchCropTypes } from "@/services/cropsService";
import type { CropsProps, FarmsProps } from "@/types";
import type { ChangeEvent } from "react";
import { Button } from "@nextui-org/button";
import { Pagination, Popover, PopoverContent, PopoverTrigger, Select, SelectItem } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import formatarHora from "@/utils";
import { Input } from "@nextui-org/input";

interface FarmsPageProps {
    farms: FarmsProps[],
    handleDeleteFarm: (id: string) => void
}

const pageSize = [
    { key: "1", label: "1" },
    { key: "2", label: "2" },
    { key: "3", label: "3" },
    { key: "4", label: "4" },
    { key: "5", label: "5" }
];

export default function Farms({ farms, handleDeleteFarm }: FarmsPageProps) {

    const [cropsList, setCropsList] = useState<CropsProps[]>([])
    const [resultsPerPage, setResultsPerPage] = useState<string>('5')
    const [currentPage, setCurrentPage] = useState<number>(1)

    const startIndex = (currentPage - 1) * Number(resultsPerPage)
    const endIndex = startIndex + Number(resultsPerPage)

    const getData = useCallback(() => {
        fetchCropTypes()
            .then(data => setCropsList(data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    const theCrops: Record<string, string> = {}
    for (const item of cropsList) {
        theCrops[item.id] = item.name
    }

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setResultsPerPage(e.target.value);
    };

    const sortedFarms = farms.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <>
            {sortedFarms.slice(startIndex, endIndex).map((farm) => {
                return (
                    <div className="flex flex-col bg-slate-800 rounded-md p-2 gap-y-4 my-4" key={farm.id}>
                        <div className='w-full flex flex-row justify-between'>
                            <div className="flex flex-col items-start">
                                <p>Farm name: {farm.farmName}</p>
                                <p>Farm email: {farm.email}</p>
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
                                <Button>Edit</Button>
                                <Popover placement="top">
                                    <PopoverTrigger>
                                        <Button>Delete</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="px-1 py-2 flex flex-col gap-y-4">
                                            <div className="text-small font-bold text-center">Confirm delete?</div>
                                            <div className="flex flex-row gap-x-4">
                                                <Button>Cancel</Button>
                                                <Button onClick={() => handleDeleteFarm(farm.id.toString())}>Confirm</Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className='w-full flex flex-row justify-center items-center'>
                <Pagination
                    initialPage={currentPage}
                    total={Math.ceil(farms.length / Number(resultsPerPage))}
                    className="flex-1"
                    onChange={setCurrentPage}
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
        </>
    );
}
