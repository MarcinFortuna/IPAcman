import * as React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../ReduxStore/store";
import {Mistakes} from "./Panel/Mistakes";
import {
    Button,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";

interface GameOverModalProps {
    isOpen: boolean
    onClose: () => void
}

const GameOverModal = (props: GameOverModalProps) => {

    const {isOpen, onClose} = props;

    const score = useSelector((state: RootState) => state.ipacmanData.score);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
            <ModalOverlay/>
            <ModalContent sx={{
                backgroundColor: "var(--chakra-colors-mainYellow)",
                margin: "auto"
            }}>
                <ModalHeader>GAME OVER</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Heading size="md">Your score: {score}</Heading>
                    <Mistakes/>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='yellow' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
}

export default GameOverModal;