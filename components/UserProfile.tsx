import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    Image,
    VStack,
    HStack,
    Modal,
    ScrollView,
    Spinner,
} from "native-base"

export default function UserProfile(props:any) {
    const { userName, userAvatar, posts, userProfileVisible, setUserProfileVisible } = props;

    const UserData = () => {
        return (
            <Modal isOpen={userProfileVisible} onClose={setUserProfileVisible} shadow="5" h="100%" w="100%">
            {
                (posts === "") ? (
                    <Modal.Content justifyContent='center' alignItems='center' h="100%" w="100%">
                    <Modal.CloseButton />
                    <Box justifyContent='center' alignItems='center'>
                    <Spinner color="emerald.800" size="lg" />
                    </Box>
                    </Modal.Content>
                ) : (
                    <Modal.Content h="100%" w="100%" p="5%">
                    <Modal.CloseButton />
                    <VStack space={5} w="100%" p="8%" alignItems='center'>
                    <Box><Image source={{uri: userAvatar}} alt="Profile picture" size={100} borderRadius={100}></Image></Box>
                    <Box><Text bold fontSize="xl">{userName}</Text></Box>
                    </VStack>
                    <Box h="72.5%" justifyContent='center' alignItems='center'>
                    <ScrollView w="100%" showsVerticalScrollIndicator={false}>
                    {
                        posts?.map((item:any, index:any) => {
                            return (
                                <>
                                <Box key={index} justifyContent='center' borderColor="muted.200" borderStyle='solid' borderWidth={1}></Box>
                                <HStack space={5} w="100%" p="5%" pr="12%">
                                <Box w="75%">
                                <Text><Text bold>User:</Text> {item.userName}</Text>
                                <Text><Text bold>Flower:</Text> {item.flowerName}</Text>
                                <Text><Text bold>Latitude:</Text> {item.latitude}</Text>
                                <Text><Text bold>Longitude:</Text> {item.longitude}</Text>
                                <Text><Text bold>Date Found:</Text> {item.date}</Text>
                                </Box>
                                <Box justifyContent='center'>
                                <Image source={{uri: item.images[0]}} alt="Flower picture" size={75} borderRadius={75}></Image>
                                </Box>
                                </HStack>
                                </>
                            )
                        })
                    }
                    </ScrollView>
                    </Box> 
                    </Modal.Content>

                )
            }
            </Modal>
        )
    }

    return (
        <Box>
        <UserData />
        </Box>
    )
}
