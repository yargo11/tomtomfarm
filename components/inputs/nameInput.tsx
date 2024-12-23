import { Input } from "@nextui-org/input";

interface NameInputProps {
    value: string;
    onChange: (value: string) => void;
    listFarms: string[]
}

export default function NameInput({ listFarms, onChange, value }: NameInputProps) {

    const handleChange = (value: string) => {
        onChange(value);
    };

    return (
        <Input
            label=" Name"
            type="text"
            errorMessage="Name already exists"
            isInvalid={value !== undefined && listFarms?.includes(value)}
            onChange={(e) => handleChange(e.target.value)}
            variant="bordered"
        />
    )
}