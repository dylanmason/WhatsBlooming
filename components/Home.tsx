import React, { useEffect, useState, useMemo } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import {
    Box,
    Text,
    IconButton,
    Icon,
    Spinner,
    Modal,
    Fab,
    Actionsheet,
    useDisclose,
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Coordinates } from "./Types";
import Map from './Map';
import PostList from './PostList';
import {getAuthToken} from "./asyncStorage";
    
export default function Home({ route, navigation }: any) {
    const [userName, setUserName] = useState<any>("");
    const [longitude, setLongitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();

    useEffect(() => {
        (async () => {
            let token = await getAuthToken();
            if (token === null) {
                navigation.navigate('SignIn');
            }
            else {
                setUserName(token);
            }

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
        })();
    }, []);

    const Loading = () => {
        return (
            <Box justifyContent='center' alignItems='center' flex={1}>
            <Spinner color="emerald.800" size="lg"/> 
            </Box>
        );
    }



    return (
        <Box>
        {
            !(longitude && latitude) ? (
                <Box mt="100%">
                <Loading />
                </Box>
            ) : (
                <Box>
                <Map longitude={longitude} latitude={latitude} />
                <Fab 
                renderInPortal={false}
                shadow="5" 
                _pressed={{bg: "amber.500"}}
                icon={<Icon as={Ionicons} name="add" color="black" size="2xl"/>} 
                w="100px" 
                h="100px" 
                bottom={20} 
                right={30} 
                borderRadius={50} 
                bg="amber.500" 
                onPress={() => {
                    console.log("username is now", userName);
                    navigation.navigate('Post', {
                        postUserName: userName,
                        latitude: latitude,
                        longitude: longitude,
                    });
                }}
                />
                <Fab 
                renderInPortal={false}
                shadow="5"
                _pressed={{bg: "amber.500"}}
                icon={<Icon as={Feather} name="settings" color="black" size="lg"/>}
                w="50px"
                h="50px"
                top={20}
                right={30}
                borderRadius={50}
                bg="amber.500" 
                onPress={() => navigation.navigate('Settings', {userName: userName})}/>
                <Fab 
                renderInPortal={false}
                shadow="5"
                _pressed={{bg: "amber.500"}}
                icon={<Icon as={Feather} name="menu" color="black" size="lg"/>}
                w="50px"
                h="50px"
                top={20}
                left={30}
                borderRadius={50}
                bg="amber.500" 
                onPress={onOpen}/>
                </Box>
            )
        }
        <PostList isOpen={isOpen} onClose={onClose} navigation={[navigation]}/>
        </Box>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});

