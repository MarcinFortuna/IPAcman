import {Box, Checkbox, Heading, HStack, Stack, useRadioGroup} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {setSymbolScope} from "../../ReduxStore/reducers/IpacmanReducer";
import RadioCard from "../RadioCard";

export default function SymbolScopeSelector() {

    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);

    const symbolScope = useSelector((state: RootState) => state.ipacmanData.symbolScope);
    const dispatch = useDispatch();

    const [currentSet, setCurrentSet] = useState<"rp"|"fullIpa">(symbolScope.selected);

    const radioOptions = ['Conservative RP', 'Full IPA'];

    const {getRootProps, getRadioProps} = useRadioGroup({
        name: 'symbolSet',
        defaultValue: symbolScope.selected === 'rp' ? 'Conservative RP' : 'Full IPA',
        onChange: ((value: string) => setCurrentSet(value === "Conservative RP" ? "rp" : "fullIpa"))
    });

    const group = getRootProps();

    const [checkedItemsRP, setCheckedItemsRP] = useState([
        symbolScope.rp.consonants,
        symbolScope.rp.vowels,
    ]);

    const allCheckedRP = checkedItemsRP.every(Boolean);
    const isIndeterminateRP = checkedItemsRP.some(Boolean) && !allCheckedRP;

    const [checkedItemsFull, setCheckedItemsFull] = useState([
        symbolScope.fullIpa.full_consonants_pulmonic,
        symbolScope.fullIpa.full_consonants_non_pulmonic,
        symbolScope.fullIpa.full_other_symbols,
        symbolScope.fullIpa.full_vowels,
        symbolScope.fullIpa.full_diacritics,
        symbolScope.fullIpa.full_suprasegmentals,
        symbolScope.fullIpa.full_tones_and_word_accents
    ]);

    const allCheckedFull = checkedItemsFull.every(Boolean);
    const isIndeterminateFull = checkedItemsFull.some(Boolean) && !allCheckedFull;

    useEffect(() => {
        const currentSymbolScope = {
            selected: currentSet,
            rp: {
                consonants: checkedItemsRP[0],
                vowels: checkedItemsRP[1]
            },
            fullIpa: {
                full_consonants_pulmonic: checkedItemsFull[0],
                full_consonants_non_pulmonic: checkedItemsFull[1],
                full_other_symbols: checkedItemsFull[2],
                full_vowels: checkedItemsFull[3],
                full_diacritics: checkedItemsFull[4],
                full_suprasegmentals: checkedItemsFull[5],
                full_tones_and_word_accents: checkedItemsFull[6]
            }
        }
        dispatch(setSymbolScope(currentSymbolScope));
    }, [checkedItemsRP, checkedItemsFull, currentSet]);

    return (<>
        <Heading size="md">Scope: </Heading>
        <HStack {...group}>
            {radioOptions.map((value: string) => {
                const radio = getRadioProps({value});
                return (
                    <RadioCard key={value} {...radio} isDisabled={gameOn}>
                        {value}
                    </RadioCard>
                )
            })}
        </HStack>
        <Box sx={{display: currentSet === 'rp' ? 'block' : 'none', transition: "0.5s"}}>
            <Checkbox isDisabled={gameOn}
                isChecked={allCheckedRP}
                isIndeterminate={isIndeterminateRP}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsRP([e.target.checked, e.target.checked])}
            >
                All Conservative RP phonemes
            </Checkbox>
            <Stack pl={6} mt={1} spacing={1}>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsRP[0]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsRP([e.target.checked, checkedItemsRP[1]])}
                >
                    Consonants
                </Checkbox>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsRP[1]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsRP([checkedItemsRP[0], e.target.checked])}
                >
                    Vowels
                </Checkbox>
            </Stack>
        </Box>
        <Box sx={{display: currentSet === 'rp' ? 'none' : 'block'}}>
            <Checkbox isDisabled={gameOn}
                isChecked={allCheckedFull}
                isIndeterminate={isIndeterminateFull}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull(
                    [e.target.checked, e.target.checked, e.target.checked, e.target.checked, e.target.checked, e.target.checked, e.target.checked]
                )}
            >
                All IPA/X-SAMPA Symbols
            </Checkbox>
            <Stack pl={6} mt={1} spacing={1}>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsFull[0]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull([e.target.checked, checkedItemsFull[1], checkedItemsFull[2], checkedItemsFull[3], checkedItemsFull[4], checkedItemsFull[5], checkedItemsFull[6]])}
                >
                    Consonants (pulmonic)
                </Checkbox>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsFull[1]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull([checkedItemsFull[0], e.target.checked, checkedItemsFull[2], checkedItemsFull[3], checkedItemsFull[4], checkedItemsFull[5], checkedItemsFull[6]])}
                >
                    Consonants (non-pulmonic)
                </Checkbox>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsFull[2]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull([checkedItemsFull[0], checkedItemsFull[1], e.target.checked, checkedItemsFull[3], checkedItemsFull[4], checkedItemsFull[5], checkedItemsFull[6]])}
                >
                    Other symbols
                </Checkbox>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsFull[3]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull([checkedItemsFull[0], checkedItemsFull[1], checkedItemsFull[2], e.target.checked, checkedItemsFull[4], checkedItemsFull[5], checkedItemsFull[6]])}
                >
                    Vowels
                </Checkbox>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsFull[4]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull([checkedItemsFull[0], checkedItemsFull[1], checkedItemsFull[2], checkedItemsFull[3], e.target.checked, checkedItemsFull[5], checkedItemsFull[6]])}
                >
                    Diacritics
                </Checkbox>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsFull[5]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull([checkedItemsFull[0], checkedItemsFull[1], checkedItemsFull[2], checkedItemsFull[3], checkedItemsFull[4], e.target.checked, checkedItemsFull[6]])}
                >
                    Suprasegmentals
                </Checkbox>
                <Checkbox isDisabled={gameOn}
                    isChecked={checkedItemsFull[6]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckedItemsFull([checkedItemsFull[0], checkedItemsFull[1], checkedItemsFull[2], checkedItemsFull[3], checkedItemsFull[4], checkedItemsFull[5], e.target.checked])}
                >
                    Tones and Word Accents
                </Checkbox>
            </Stack>
        </Box>
    </>);
}