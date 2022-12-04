import * as React from 'react';
import {Switch, FormLabel, FormControl, Heading} from '@chakra-ui/react'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {toggleUseIpa} from "../../ReduxStore/reducers/IpacmanReducer";

const IpaSampa = () => {

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);
    const dispatch = useDispatch();

    return (
        <>
            <Heading size="md">Alphabet: </Heading>
            <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='ipaSampa' mb='0'>IPA</FormLabel>
                <Switch id='ipaSampa' size="lg"
                        isChecked={!useIpa}
                        onChange={() => dispatch(toggleUseIpa())}
                        sx={{
                            '& .chakra-switch__track': {
                                backgroundColor: 'var(--chakra-colors-yellow-500)'
                            }
                        }}
                />
                <FormLabel htmlFor='ipaSampa' mb='0' sx={{marginLeft: "12px"}}>X-SAMPA</FormLabel>
            </FormControl>
        </>
    );
}

export default IpaSampa;