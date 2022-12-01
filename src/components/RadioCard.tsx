import {Box, useRadio, UseRadioProps} from "@chakra-ui/react";
import * as React from "react";

interface RadioCardProps extends UseRadioProps {
    children: React.ReactNode
}

const RadioCard = (props: RadioCardProps) => {

    const {getInputProps, getCheckboxProps} = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                borderRadius='md'
                boxShadow='md'
                _checked={{
                    bg: 'yellow.400',
                    color: 'black',
                    borderColor: 'yellow.600',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                _disabled={{
                    bg: 'gray.200',
                    color: 'gray.400',
                    fontStyle: 'italic'
                }}
                px={5}
                py={3}
            >
                {props.children}
            </Box>
        </Box>
    )
}

export default RadioCard;