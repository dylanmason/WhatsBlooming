import React, { useState } from "react";
import {
    Box,
    Link,
    Image,
} from "native-base";
import * as ImagePicker from 'expo-image-picker';

export default function FlowerPictureSelection(props: any) {
    const [image, setImage] = useState<string>("https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814055_960_720.png");

    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            props.imageData(image);
        }
    };

    const Selection = () => {
        return (
            <Box>
            <Link onPress={pickImage}>
            <Box shadow="5">
            <Image source={{uri: image}} alt="Flower picture" size={150} mb="5%" borderRadius={100}/>
            </Box>
            </Link>
            {image}
            </Box>
        )
    }
    
    return (
        <Box>
        <Selection />
        </Box>
    )
}
