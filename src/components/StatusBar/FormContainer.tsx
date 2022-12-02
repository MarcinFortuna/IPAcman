import * as React from "react";
import {useState} from "react";
import Form from "./Form";
import {Box, Tabs, TabList, Tab} from "@chakra-ui/react";

export const FormContainer = () => {

    const [option, setOption] = useState<number>(1);

    return (
        <>
            <header className="chakra-modal__header"
                style={{
                    textAlign: 'left',
                    fontWeight: '700',
                    margin: '0 auto 60px auto',
                    position: 'relative',
                    overflow: 'hidden',
                    paddingLeft: "0",
                    paddingTop: "8px",
                    height: "37px"
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    transition: "all 0.4s cubic-bezier(1, 0.135, 0.15, 0.86)",
                    '& span:not(:last-child)': {
                        marginBottom: '5px'
                    },
                    transform: option === 1 ? 'translateY(0)' : option === 2 ? 'translateY(-29px)' : 'translateY(-58px)'
                }}>
                    <span>Sign in to your account</span>
                    <span>Create an account</span>
                    <span>Reset your password</span>
                </Box>
            </header>
            <Tabs isFitted variant='enclosed' onChange={(index: number) => setOption(index+1)}
                sx={{
                    marginTop: "-42px",
                    cursor: "pointer",
                    '& [aria-selected=true]': {
                        color: 'black',
                        fontWeight: "bold"
                    }
                }}
            >
              <TabList mb='1em'>
                <Tab>Sign In</Tab>
                <Tab>Sign up</Tab>
                <Tab>Forgot</Tab>
              </TabList>
            </Tabs>
            <Box sx={{
                textAlign: "center",
                height: "320px"
            }}>
                <Form option={option}/>
            </Box>
        </>
    )
}