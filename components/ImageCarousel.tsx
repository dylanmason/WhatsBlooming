import Carousel from 'react-native-reanimated-carousel';
import {
    Image,
    Box,
    Text,
} from "native-base";
import {useEffect} from 'react';
export default function ImageCarousel(props:any) {
    
    return (
        <Box justifyContent='center' alignItems='center'>
        <Carousel 
        loop
        width={300}
        height={175}
        data={props.images}
        scrollAnimationDuration={2000}
        autoPlay={true}
        renderItem={({ item }: any) => (
            <Box justifyContent='center' alignItems='center' shadow="5" mt="5%">
            <Image source={{uri: item}} alt="Carousel" size={150} borderRadius={150}/>
            </Box>
        )}
        />
        </Box>
    ) 
}
