'use client'

import { fetchCropTypes } from "@/services/cropsService";
import { fetchFarms } from "@/services/farmsService";
import type { CropsProps, FarmsProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";


export default function Farms() {

    const [farms, setFarms] = useState<FarmsProps[]>([])
    const [cropsList, setCropsList] = useState<CropsProps[]>([])

    const getData = useCallback(() => {
        fetchFarms()
            .then(data => setFarms(data))
            .catch(error => console.log(error));

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

    function deleteFarm(id: string) {
        fetch(`http://localhost:3000/farms/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete resource with ID ${id}. Status: ${response.status}`);
                }
                console.log(`Resource with ID ${id} deleted successfully`);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => { getData() });
    }

    return (
        <>
            {farms.map(farm => {
                return (
                    <div className="flex flex-col bg-slate-800 rounded-md p-2 gap-y-4 my-4" key={farm.id}>
                        <div className='w-full flex flex-row justify-between'>
                            <div>
                                <p>Farm name: {farm.farmName}</p>
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
                                                <Button onClick={() => deleteFarm(farm.id.toString())}>Confirm</Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
