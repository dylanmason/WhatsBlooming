import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import {
    Text,
    Modal,
    Box,
    Center,
    Image,
} from "native-base";
import config from '../config.json';

export default function Map(props: any) {
    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const [coordinateData, setCoordinateData] = useState<any>();
    const [longitude, setLongitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const [selectedUserName, setSelectedUserName] = useState<string>("");
    const [dateFound, setDateFound] = useState<string>("");
    const [flowerName, setFlowerName] = useState<string>("");
    const [flowerImages, setFlowerImages] = useState<string>(["https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814055_960_720.png"]);
    
    const emojis = ['🐝', '🌻', '🌷', '💐', '🌹'];
    interface Props {
        latitude: number;
        longitude: number;
    }
    
    useEffect(() => {
        (async () => {
            const response = await fetch(`${config.GATHERPOSTS_HEROKU_API}`);
            // const response = await fetch(`${config.GATHERPOSTS_LOCAL_API}`);
            const list: any = await response.json();
            // console.log(list);
            setCoordinateData(list);
        })();
    }, []);

    const PrintData = () => {
        return (
            <Modal isOpen={modalOpened} onClose={setModalOpened} size="lg" shadow="5">
            <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Blooming Data</Modal.Header>
            <Center padding={5}>
            <Image source={{uri: flowerImages[0]}} alt="Flower picture" size={150} borderRadius={100}></Image>
            </Center>
            <Box pl={5} pr={5} pb={5}>
            <Text><Text bold>User:</Text> {selectedUserName}</Text>
            <Text><Text bold>Flower:</Text> {flowerName}</Text>
            <Text><Text bold>Latitude:</Text> {latitude}</Text>
            <Text><Text bold>Longitude:</Text> {longitude}</Text>
            <Text><Text bold>Date Found:</Text> {dateFound}</Text>
            </Box>
            </Modal.Content>
            </Modal>
        );
    }

    const Markers = () => {
        return (
            coordinateData?.map((item: any, index: any) => {
                return (
                    <Marker 
                    key={index}
                    stopPropagation
                    coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                    onPress={() => {
                        setLongitude(item.longitude);
                        setLatitude(item.latitude);
                        setSelectedUserName(item.userName);
                        setFlowerName(item.flowerName);
                        setDateFound(item.date);
                        let base64Conversion = [];
                        item?.images.map((item: any) => {
                            base64Conversion.push(item)
                        });
                        console.log(base64Conversion.length);
                        setFlowerImages(base64Conversion);
                        setModalOpened(true)}
                    }
                    >
                    <Text fontSize="xl">{item.icon}</Text>
                    </Marker>
                )
            })
        )
    }

    return (
        <Box>
        <MapView 
        initialRegion={{
            latitude: props.latitude,
                longitude: props.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0842,
        }}
        style={styles.map}>
        <Markers />
        <Marker
        key="userLocation"
        stopPropagation
        coordinate={{ latitude: props.latitude, longitude: props.longitude }}>
        <Text fontSize="xl">📱</Text>
        </Marker>
        </MapView>
        <PrintData />
        </Box>
    );
}
    
const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
