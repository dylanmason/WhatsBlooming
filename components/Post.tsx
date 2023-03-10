import React, {useEffect} from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import {
    VStack,
    Box,
    Center,
    Text,
    FormControl,
    Input,
    IconButton,
    Button,
    Icon,
    Image,
    useToast,
    HStack,
    Link,
    KeyboardAvoidingView,
} from "native-base"
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import FlowerPictureSelection from "./FlowerPictureSelection";
import config from '../config.json';

export default function Post({ route, navigation }: any) {
    
    const userName = route.params.postUserName;
    const [flowerName, setFlowerName] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [dateFound, setDateFound] = useState<string>(new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'}));
    const [show, setShow] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<any>(route.params.latitude);
    const [longitude, setLongitude] = useState<any>(route.params.longitude);
    const [images, setImages] = useState<any>(["https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814055_960_720.png"]);
    const emojis = ['🐝', '🌻', '🌷', '💐', '🌹'];

    const toast = useToast();
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        // console.log(result);

        if (!result.canceled) {
            // console.log(result.assets[0].base64);
            let arr:any = [];
            const base64Conversion = result?.assets.map(uri => {
                arr.push('data:image/png;base64,' + uri.base64);
            })
            setImages(arr);
        }
    };

    const onChange = (selectedDate: Date) => {
        setDate(selectedDate);
        setDateFound(selectedDate.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})); 
        setShow(false);
    }

    useEffect(() => {
        // console.log(image);
    }, [images])
    
    const post = async() => {
        // console.log(image);
        const icon = emojis[Math.floor(Math.random() * 5)];
        const data = {
                latitude: latitude,
                longitude: longitude,
                date: dateFound,
                userName: userName,
                flowerName: flowerName,
                icon: icon,
                images: images,
        }
        console.log(data.latitude);
        // const response = await fetch(`${config.UPLOADPOST_HEROKU_API}`, {
        //     method: 'post',
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(data)
        // });
        const response = await fetch(`${config.UPLOADPOST_LOCAL_API}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
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
                    <Text fontSize='md'>Post successfully created!</Text>
                    </Box>
                    </HStack>
                    </Button>
                )
            },
            placement: "top",
        });
       navigation.navigate('Home'); 
    }
    
    const handleFlowerInput = (value: string) => setFlowerName(value); 
    const handleLatInput = (value: string) => setLatitude(Number(value));
    const handleLonInput = (value: string) => setLongitude(Number(value));

    const handlePress = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
        <KeyboardAvoidingView justifyContent='center' alignItems='center' flex={1} behavior='padding' keyboardVerticalOffset={-100}>
        <VStack justifyContent='center' alignItems='center' flex={1} space={3}>
        <Box>
        <FormControl isRequired>
        <FormControl.Label alignSelf='center'>Flower Name</FormControl.Label>
        <Input variant="rounded" placeholder="Name" w="50%" onChangeText={handleFlowerInput}/>
        </FormControl>
        </Box>
        <Box>
        <FormControl isRequired>
        <FormControl.Label alignSelf='center'>Latitude</FormControl.Label>
        <Input variant="rounded" w="50%" placeholder={latitude.toString()} onChangeText={handleLatInput}/>
        </FormControl>
        </Box>
        <Box>
        <FormControl isRequired>
        <FormControl.Label alignSelf='center'>Longitude</FormControl.Label>
        <Input variant="rounded" w="50%" placeholder={longitude.toString()} onChangeText={handleLonInput}/>
        </FormControl>
        </Box>
        <Box>
        <FormControl isRequired>
        <FormControl.Label alignSelf='center'>Date</FormControl.Label>
        <Button 
        variant="outline"
        mb={5}
        bg="hsl(0, 0%, 95%)"
        _pressed = {{
            bg: "hsl(0, 0%, 95%)",
        }}
        borderRadius={30}

        onPress={() => {
            setShow(true);
        }}
        >
        <Text color="dark.500" pl="15%" pr="15%" fontSize="xs">
        {dateFound} 
        </Text>
        </Button>
        <Center>
        </Center>
        <Box>
        <DateTimePickerModal
        date={date}
        isVisible={show}
        mode="date"
        onConfirm={onChange}
        onCancel={() => setShow(false)}
        confirmTextIOS={"I fucking love bees"}
        /> 
        </Box>
        </FormControl>
        </Box>
        <Box>
        <FormControl>
        <Center>
        <Link onPress={pickImage}>
        <Box shadow="5">
        <Image source={{uri: images[0]}} alt="Flower picture" size={150} mb="5%" borderRadius={100}/>
        </Box>
        </Link>
        </Center>
        </FormControl>
        </Box>
        <Box mt="10%">
        <Button 
        bg="amber.500" 
        _pressed = {{
            bg: "amber.500",
                opacity: "30"
        }}
        shadow="5"
        borderRadius={30}
        onPress={post}
    ><Text pt={3} pb={3} pl={20} pr={20}>Post</Text></Button>
        </Box>
        </VStack>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
