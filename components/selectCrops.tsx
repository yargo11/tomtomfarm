import { FarmContext } from "@/context/farmContext";
import { Select, SelectItem } from "@nextui-org/react";
import { useContext } from "react";

export const animals = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
    { key: "tiger", label: "Tiger" },
    { key: "giraffe", label: "Giraffe" },
    { key: "dolphin", label: "Dolphin" },
    { key: "penguin", label: "Penguin" },
    { key: "zebra", label: "Zebra" },
    { key: "shark", label: "Shark" },
    { key: "whale", label: "Whale" },
    { key: "otter", label: "Otter" },
    { key: "crocodile", label: "Crocodile" },
];

export default function SelectCrops() {

    const farmContext = useContext(FarmContext)

    const crops = farmContext?.cropsList ? farmContext.cropsList.map(crop => crop.name) : []

    return (
        <Select
            className="w-full"
            label="Select crops"
            placeholder="Corn, beans, rice..."
            selectionMode="multiple"
            variant="bordered"
        >
            {crops.map((crop) => (
                <SelectItem key={crop}>{crop}</SelectItem>
            ))
            }
        </Select>
    );
}