import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import * as React from "react";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {AnyAction} from 'redux';

interface ModalProps {
    buttonText: string | React.ReactNode
    modalTitle?: string
    hideCloseButton?: boolean
    children: React.ReactNode,
    callback?: (arg?) => AnyAction
}

export const ModalInstance = (props: ModalProps) => {

    const {buttonText, modalTitle, children, hideCloseButton, callback} = props;
    const {isOpen, onOpen, onClose} = useDisclosure();

    const dispatch = useDispatch();

    useEffect(() => {
        if (callback && isOpen) {
            dispatch(callback(true));
            return () => {
                dispatch(callback(false));
            }
        }
    }, [isOpen]);

    return (
        <>
            <Button variant="outline" onClick={onOpen}>
                {buttonText}
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
                <ModalOverlay/>
                <ModalContent sx={{
                    backgroundColor: "var(--chakra-colors-mainYellow)",
                    margin: "auto"
                }}
                >
                    {modalTitle ? <ModalHeader>{modalTitle}</ModalHeader> : null}
                    <ModalCloseButton/>
                    <ModalBody>
                        {children}
                    </ModalBody>
                    {hideCloseButton ? null : <ModalFooter>
                        <Button colorScheme='yellow' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>}
                </ModalContent>
            </Modal>
        </>
    )
}