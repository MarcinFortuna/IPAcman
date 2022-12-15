import React from 'react';
import {PhoneticSymbol} from "../types/types";
import {Link, Text, Tooltip} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {RootState} from "../ReduxStore/store";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {AiOutlineSound} from 'react-icons/ai';
import {calculateLabel} from "../helperFunctions";

interface GenerateLinkProps {
    phoneticSymbol: PhoneticSymbol
}

export default function GenerateLink(props: GenerateLinkProps) {

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);

    const {phoneticSymbol} = props;

    const characterToDisplay = useIpa
        ? ('ipa' in phoneticSymbol ? phoneticSymbol.ipa : (phoneticSymbol.ipa_diacritic || phoneticSymbol.ipa_letter))
        : phoneticSymbol.sampa

    const label: string = calculateLabel(phoneticSymbol) as string;

    return(
        <Tooltip placement="left" label={label}>
            <div>
            {'url' in phoneticSymbol
            ? <Link href={phoneticSymbol.url as string} target="_blank">
                    {characterToDisplay}
                    <ExternalLinkIcon sx={{
                        margin: "0 5px 4px 2px"
                    }}/>
            </Link>
            : <Text>{characterToDisplay} </Text>}
            {'audio' in phoneticSymbol
                ? <Link href={phoneticSymbol.audio as string} target="_blank" sx={{
                    "display": "inline-block",
                    "marginBottom": "-1px"
                }}><AiOutlineSound/></Link>
                : null
            }
            </div>
        </Tooltip>
    );

}