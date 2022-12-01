import {useRadioGroup, HStack} from '@chakra-ui/react';
import * as React from 'react';
import RadioCard from "../RadioCard";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {setPace} from "../../ReduxStore/reducers/IpacmanReducer";
import {paceMapping} from "../../helperFunctions";

const PaceSelector = () => {

    const gameOn: boolean = useSelector((state: RootState) => state.ipacmanData.gameOn);

    const dispatch = useDispatch();

    const options = ['still', 'slow', 'medium', 'fast'];

    const selectPace = (paceString: string) => {
        dispatch(setPace(paceMapping[paceString]));
    }

    const {getRootProps, getRadioProps} = useRadioGroup({
        name: 'pace',
        defaultValue: 'still',
        onChange: selectPace
    });

    const group = getRootProps()

    return (
        <HStack {...group}>
            {options.map((value) => {
                const radio = getRadioProps({value})
                return (
                    <RadioCard key={value} {...radio} isDisabled={gameOn}>
                        {value}
                    </RadioCard>
                )
            })}
        </HStack>
    )
}

export default PaceSelector;