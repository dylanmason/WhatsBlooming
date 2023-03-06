import React, { useState } from "react";
import { storeAuthToken, getAuthToken } from "./asyncStorage";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import {
    Center,
    Text,
    Heading,
    VStack,
    Box,
    Button,
    useToast,
    HStack,
    Input,
    FormControl,
    Icon,
    Pressable,
    Link,
    KeyboardAvoidingView,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import config from '../config.json';

export default function SignIn({navigation}: {navigation: any}) {
    const toast = useToast();
    const toastIdRef = React.useRef();

    const [show, setShow] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const emptyUserName = userName === '';
    const emptyPassword = password === '';

    const pressed = async () => {
        if (!emptyUserName && !emptyPassword) {
            const credentials = await fetch(`${config.USERAUTHENTICATION_HEROKU_API}?userName=${userName}&password=${password}`);
            // const credentials = await fetch(`${config.USERAUTHENTICATION_LOCAL_API}?userName=${userName}&password=${password}`);
            const response = await credentials.json();
            // console.log(response);
            if (response.found === "true") {
                await storeAuthToken(userName);
                toast.show({
                    render : () => {
                        return (
                            <Button p={2} 
                            w="300px" 
                            bg="white" 
                            pl={2} 
                            pr={2} 
                            borderRadius="md" 
                            shadow="5" 
                            justifyContent='center' 
                            flex={1} 
                            _pressed={{
                                bg: "white",
                                    opacity: "30"
                            }}
                            onPress={() => {
                                toast.closeAll();
                            }}>
                            <HStack space={3} justifyContent='center' flex={1}>
                            <Box>
                            <AntDesign name="checkcircle" size={24} color="green" />
                            </Box>
                            <Box>
                            <Text fontSize='md'>Welcome!</Text>
                            </Box>
                            </HStack>
                            </Button>
                        )
                    },
                    placement: "top",
                });
                navigation.navigate('Home', {userName: userName});
            }
            else if (response.found === "null"){
                toast.show({
                    render : () => {
                        return (
                            <Button p={2} 
                            w="300px" 
                            bg="white" 
                            pl={2} 
                            pr={2} 
                            borderRadius="md" 
                            shadow="5" 
                            justifyContent='center' 
                            flex={1} 
                            _pressed={{
                                bg: "white",
                                    opacity: "30"
                            }}
                            onPress={() => {
                                toast.closeAll();
                            }}>
                            <HStack space={3} justifyContent='center' flex={1}>
                            <Box>
                            <AntDesign name="closecircle" size={24} color="red" />
                            </Box>
                            <Box>
                            <Text fontSize='md'>User not found</Text>
                            </Box>
                            </HStack>
                            </Button>
                        )
                    },
                    placement: "top",
                });
            }
        }
    }

    const handleUserName = (text: string) => setUserName(text);
    const handlePassword = (text: string) => setPassword(text);

    const handlePress = () => {
        Keyboard.dismiss();
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
        <Box justifyContent='center' alignItems='center' flex={1} backgroundColor='emerald.800'>
        <Box justifyContent='center' alignItems='center' w='75%' h='60%' opacity={60} backgroundColor='muted.500' borderRadius='xl' zIndex={1} position='absolute' shadow="5">
        </Box>
        <VStack zIndex={2} mb="25%" space={10}>
        <Center>
        <Heading color="muted.50">What's Blooming</Heading>
        </Center>
        <Center>
        <FormControl isRequired>
        <Input selectionColor="white" variant="rounded" InputLeftElement={<Icon as={<Ionicons name="ios-person-circle-outline" />} 
            size={5} 
            ml="2" 
            color="muted.400" />} 
        placeholder="Username"
        color="white"
        onChangeText={handleUserName}/>
        </FormControl>
        </Center>
        <Center>
        <FormControl isRequired>
        <Input selectionColor="white" variant="rounded" InputLeftElement={<Icon as={<Ionicons name="key" />} size={5} ml="2" color="muted.400"/>} type={show ? "text" : "password"} 
        InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <Icon as={<Ionicons name={show ? "eye" : "eye-off"} />} size={5} mr="2" color="muted.400" />
            </Pressable>} 
        placeholder="Password" 
        color= "white"
        onChangeText={handlePassword}/>
        </FormControl>
        </Center>
        <Center mt={8}>
        <Link onPress={() => navigation.navigate('NewUser')}><Text underline color='muted.50'>New User?</Text></Link>
        </Center>
        <Center>
        <Button 
        _pressed={{
            bg: "amber.500",
                opacity: "30"
        }} 
        bg="amber.500"
        shadow="5"
        borderRadius={30}
        onPress={pressed}>
        <Text pt={2.5} pb={2.5} pl={12} pr={12}>
        Sign in
        </Text>
        </Button>
        </Center>
        </VStack>
        </Box>
        </TouchableWithoutFeedback>
    )
}
