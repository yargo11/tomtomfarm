import { validateEmail } from "@/utils";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";

interface EmailInputProps {
    value: string;
    onChange: (value: string) => void;
    listEmails: string[],
    isEmailInvalid: boolean,
    setIsEmailInvalid: (value:boolean) => void
}

export default function EmailInput({ value, onChange, listEmails, isEmailInvalid, setIsEmailInvalid }: EmailInputProps) {

    // const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false)
    const [touchedEmail, setTouchedEmail] = useState<boolean>(false)

    useEffect(() => {
        if (!touchedEmail) return
        const delay = setTimeout(() => {
            if (listEmails?.includes(value)) {
                setIsEmailInvalid(true)
            } else {
                setIsEmailInvalid(validateEmail(value))
            }
        }, 500)

        return () => clearTimeout(delay)
    }, [value, touchedEmail, listEmails, setIsEmailInvalid])

    function handleChangeEmail(value: string) {
        onChange(value)
        setTouchedEmail(true)
    }

    return (
        <Input
            label=" Email"
            type="email"
            errorMessage="Invalid email or email already exists"
            isInvalid={isEmailInvalid}
            onChange={(e) => handleChangeEmail(e.target.value)}
            variant="bordered"
        />
    )
}