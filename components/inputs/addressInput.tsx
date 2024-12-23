import { useState } from 'react';
import { Input } from '@nextui-org/input';

interface AddressInputProps {
    value: string;
    onChange: (value: string) => void;
}

interface ValidationError {
    required?: string;
    minLength?: string;
    format?: string;
}

export default function AddressInput({ value, onChange }: AddressInputProps) {
    const [errors, setErrors] = useState<ValidationError>({});

    const validateAddress = (value: string): ValidationError => {
        const errors: ValidationError = {};
        const minLength = 10; // Comprimento mínimo necessário
        const addressRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/; // Pelo menos uma letra e um número

        if (!value.trim()) {
            errors.required = 'O endereço é obrigatório.';
        } else {
            if (value.length < minLength) {
                errors.minLength = `O endereço deve ter pelo menos ${minLength} caracteres.`;
            }

            if (!addressRegex.test(value)) {
                errors.format = 'O endereço deve incluir pelo menos uma letra e um número.';
            }
        }

        return errors;
    };

    const handleChange = (value: string) => {
        onChange(value);
        setErrors(validateAddress(value));
    };

    return (
        <>
            <Input
                className="w-full"
                placeholder="St. Tomato 1239"
                label="Address"
                variant='bordered'
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
            {errors.required && <p color="error" className='text-sm'>{errors.required}</p>}
            {errors.minLength && <p color="error" className='text-sm'>{errors.minLength}</p>}
            {errors.format && <p color="error" className='text-sm'>{errors.format}</p>}
        </>
    );
};

