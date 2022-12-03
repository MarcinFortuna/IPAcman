import * as React from "react";
import {Heading, Image} from "@chakra-ui/react";

const IpacmanHeading = () => {
    return (<Heading as="h2" noOfLines={1}
                     sx={{
                         backgroundColor: '#181819',
                         color: 'yellow',
                         textAlign: 'center',
                         fontFamily: 'Courier New, Courier, monospace',
                         alignItems: 'center',
                         paddingTop: '5px',
                         borderRadius: '22px',
                         width: '195px'
                     }}
    >
        <Image src={require("../../assets/ipacman_logo.png")} alt="IPAcman" borderRadius='5px' boxSize='30px'
               display="inline-block"/>
        IPAcman
    </Heading>);
}

export default IpacmanHeading;

