import * as React from 'react';
import Popup from "reactjs-popup";
import {useState} from "react";
import IpaSampa from "./IpaSampa";
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {toggleUseIpa} from '../../ReduxStore/reducers/IpacmanReducer';
import PaceSelector from "./PaceSelector";
import {Box} from "@chakra-ui/react";

export const Settings = () => {

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);

    return <>
        <IpaSampa setAlphabet={toggleUseIpa}/>
        <PaceSelector />
    </>
}