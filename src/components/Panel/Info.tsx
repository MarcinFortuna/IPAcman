import * as React from 'react';
import {Heading, UnorderedList, ListItem} from "@chakra-ui/react";
import { Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const Info = () => {
    return (
        <>
            <Heading size={"md"}>IPAcman was built with:</Heading>
            <UnorderedList>
                <ListItem>
                    <Link href={'https://reactjs.org/'} isExternal>React <ExternalLinkIcon/></Link>
                </ListItem>
                <ListItem>
                    <Link href={'https://www.typescriptlang.org/'} isExternal>TypeScript <ExternalLinkIcon/></Link>
                </ListItem>
                <ListItem>
                    <Link href={'https://redux-toolkit.js.org/'} isExternal>Redux Toolkit <ExternalLinkIcon/></Link>
                </ListItem>
                <ListItem>
                    <Link href={'https://chakra-ui.com/'} isExternal>Chakra UI <ExternalLinkIcon/></Link>
                </ListItem>
                <ListItem>
                    <Link href={'https://firebase.google.com/'} isExternal>Firebase <ExternalLinkIcon/></Link>
                </ListItem>
            </UnorderedList>
        </>
    );
}

export default Info;