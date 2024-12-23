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
            isRequired
            label=" Name"
            type="text"
            errorMessage="Name already exists"
            isInvalid={listFarms?.includes(value)}
            onChange={(e) => handleChange(e.target.value)}
            variant="bordered"
        />
    )
}