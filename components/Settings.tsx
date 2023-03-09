import React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useState } from "react";
import {
    Box,
    Input,
    Center,
    Text,
    VStack,
    FormControl,
    Icon,
    Pressable,
    useToast,
    Button,
    HStack,
    Link,
    Image,
    KeyboardAvoidingView,
} from "native-base"
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import {getAuthToken, removeAuthToken} from "./asyncStorage";
import config from '../config.json';

export default function Settings({ route, navigation }: any) {
    
    const [show, setShow] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [image, setImage] = useState<string>("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_960_720.png");
    const oldUserName = route.params.userName;

    const toast = useToast();
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        console.log(result);

        if (!result.canceled) {
            setImage('data:image/png;base64,' + result.assets[0].base64);
        }
    };
    
    const accountUpdated = async() => {
        const data = {
            oldUserName: oldUserName,
            newUserName: userName,
            password: password,
            profilePicture: image,
        }
        const response = await fetch(`${config.UPDATEACCOUNT_HEROKU_API}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        // const response = await fetch(`${config.UPDATEACCOUNT_LOCAL_API}`, {
        //     method: 'post',
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(data)
        // });
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
                    <Text fontSize='md'>Account successfully updated!</Text>
                    </Box>
                    </HStack>
                    </Button>
                )
            },
            placement: "top",
        });
       navigation.navigate('SignIn', {userName: userName}); 
    }

    const handlePress = () => {
        Keyboard.dismiss();
    }

    const logOut = async () => {
        await removeAuthToken();
        navigation.navigate('SignIn');
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
        <KeyboardAvoidingView justifyContent='center' alignItems='center' flex={1} behavior="padding">
        <Box justifyContent='center' alignItems='center' flex={1}>
        <VStack space={4} justifyContent='center' alignItems='center' flex={1} mb="10%">
        <Box>
        <Link onPress={pickImage}>
        <Box shadow="5">
        <Image source={{uri: image}} alt="Profile picture" size={150} mb="5%" borderRadius={100}/>
        </Box>
        </Link>
        </Box>
        <Box>
        <FormControl>
        <FormControl.Label alignSelf='center'>Username</FormControl.Label>
        <Input variant="rounded" w="50%"
        onChangeText={(text: string) => setUserName(text)}/>
        </FormControl>
        </Box>
        <Center>
        <FormControl>
        <FormControl.Label alignSelf='center'>Password</FormControl.Label>
        <Input variant="rounded" type={show ? "text" : "password"} 
        InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <Icon as={<Ionicons name={show ? "eye" : "eye-off"} />} size={5} mr="2" color="muted.400" />
            </Pressable>} 
        w="50%"
        onChangeText={(text: string) => setPassword(text)}/>
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
        onPress={accountUpdated}>
        <Text pt={2.5} pb={2.5} pl={12} pr={12}>Update</Text>
        </Button>
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
        onPress={logOut}>
        <Text pt={2.5} pb={2.5} pl={12} pr={12}>Log Out</Text>
        </Button>
        </Center>
        </VStack>
        </Box>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
