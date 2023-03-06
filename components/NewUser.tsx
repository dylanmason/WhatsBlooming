import React, { useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import {
    VStack,
    Box,
    Button,
    Link,
    Text,
    Image,
    FormControl,
    Input,
    Center,
    Pressable,
    Icon,
    Heading,
    useToast,
    HStack,
    KeyboardAvoidingView
} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import ProfilePictureSelection from './ProfilePictureSelection'
import { AntDesign } from '@expo/vector-icons'; 
import config from '../config.json';

export default function NewUser({navigation}: {navigation: any}) {
    const [show, setShow] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [image, setImage] = useState<any>("https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814055_960_720.png");

    const emptyUserName = userName === '';
    const emptyPassword = password === '';

    const toast = useToast();
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        // console.log(result);

        if (!result.canceled) {
            // console.log(result.assets[0].base64);
            setImage('data:image/png;base64,' + result.assets[0].base64);
        }
    };

    const pressed = async () => {
        const data = {
            userName: userName,
            password: password,
            profilePicture: image, 
        }

        if (!emptyUserName && !emptyPassword) {
            // const credentials = await fetch(`${config.USERSIGNUP_HEROKU_API}`, {
            //     method: 'post',
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(data)
            // });
            const credentials = await fetch(`${config.USERSIGNUP_LOCAL_API}`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const response = await credentials.json();
            console.log(response);
            if (response.found === "available") {
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
                            <Text fontSize='md'>Account Successfully Created!</Text>
                            </Box>
                            </HStack>
                            </Button>
                        )
                    },
                    placement: "top",
                });
                navigation.navigate('SignIn');
            }
        }
        else {
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
                        <Text fontSize='md'>Whoopsies!</Text>
                        </Box>
                        </HStack>
                        </Button>
                    )
                },
                placement: "top",
            });
        }
    }

    const handleUserName = (text: string) => setUserName(text);
    const handlePassword = (text: string) => setPassword(text);

    const handlePress = () => {
        Keyboard.dismiss();
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
        <KeyboardAvoidingView justifyContent='center' alignItems='center' w="100%" h="100%" behavior="padding" keyboardVerticalOffset={-90}>
        <Box justifyContent='center' alignItems='center' flex={1} bg="emerald.800" w="100%">
        <Box justifyContent='center' alignItems='center' flex={1}>
        <VStack space={5} justifyContent='center' alignItems='center' flex={1} mb="10%">
        <Box mb="10%">
        <Heading fontSize="4xl" fontWeight="normal" color="muted.50">Welcome!</Heading>
        </Box>
        <Box>
        <FormControl>
        <Center>
        <Link onPress={pickImage}>
        <Box shadow="5">
        <Image source={{uri: image}} alt="Flower picture" size={150} mb="5%" borderRadius={100}/>
        </Box>
        </Link>
        </Center>
        </FormControl>
        </Box>
        <Box>
        <FormControl>
        <FormControl.Label alignSelf='center'><Text color="muted.50">Username</Text></FormControl.Label>
        <Input variant="rounded" w="50%" selectionColor="muted.50" color="muted.50"
        value={userName}
        onChangeText={handleUserName}/>
        </FormControl>
        </Box>
        <Center>
        <FormControl>
        <FormControl.Label alignSelf='center'><Text color="muted.50">Password</Text></FormControl.Label>
        <Input variant="rounded" selectionColor="muted.50" color="muted.50" type={show ? "text" : "password"} 
        InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <Icon as={<Ionicons name={show ? "eye" : "eye-off"} />} size={5} mr="2" color="muted.400" />
            </Pressable>} 
        w="50%"
        value={password}
        onChangeText={handlePassword}/>
        </FormControl>
        </Center>
        <Center mt="15%">
        <Button 
        borderRadius={30}
        bg="amber.500"
        _pressed={{
            bg: "amber.500",
                opacity: "30"
        }}
        shadow="5"
        onPress={pressed}>
        <Text pt={2.5} pb={2.5} pl={12} pr={12}>Create Account</Text>
        </Button>
        </Center>
        </VStack>
        </Box>
        </Box>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
