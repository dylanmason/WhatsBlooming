import React, { useEffect, useState, useMemo } from "react";
import { LogBox } from "react-native";
import {
    Box,
    Text,
    IconButton,
    Icon,
    Actionsheet,
    ScrollView,
    VStack,
    Image,
    HStack,
    Link,
} from "native-base";
import UserProfile from "./UserProfile";
import config from '../config.json';

export default function PostList(props:any) {
    LogBox.ignoreAllLogs();
    const navigation = props.navigation[0];
    // console.log(navigation);
    const [userProfileVisible, setUserProfileVisible] = useState<boolean>(false);
    const [userAvatar, setUserAvatar] = useState<string>("");
    const [posts, setPosts] = useState<string>("");
    const [data, setData] = useState<any>();
    const [userName, setUserName] = useState<string>("");
   
    useEffect(() => {
        (async () => {
            // const response = await fetch(`${config.GATHERPOSTS_HEROKU_API}`);
            const response = await fetch(`${config.GATHERPOSTS_LOCAL_API}`);
            let list: any = await response.json();
            list = list.reverse();
            // console.log(list);
            setData(list);
        })();
    }, []);

    const getUserData = async (userName: string) => {
            const userInfoRes = await fetch(`${config.USERINFO_LOCAL_API}?userName=${userName}`);
            // const userInfoRes = await fetch(`${config.USERINFO_HEROKU_API}?userName=${userName}`);
            const userInfo = await userInfoRes.json();
            setUserAvatar(userInfo.profilePicture);
            const userPostsRes = await fetch(`${config.USERPOSTDATA_LOCAL_API}?userName=${userName}`);
            // const userPostsRes = await fetch(`${config.USERPOSTDATA_HEROKU_API}?userName=${userName}`);
            const userPosts = await userPostsRes.json();
            setPosts(userPosts);
    }
    
    const Data = () => {
        return (
            <VStack space={5} justifyContent='left'>
            {data?.map((item:any, index:any) => {
                return (
                    <>
                    <Box key={index} justifyContent='center' borderColor="muted.200" borderStyle='solid' borderWidth={1}></Box>
                    <Link onPress={() => {
                        setUserName(item.userName);
                        setPosts("");
                        setUserAvatar("");
                        getUserData(item.userName);
                        setUserProfileVisible(true);
                    }}>
                    <HStack space={5} w="100%">
                    <Box pl={10} w="75%">
                    <Text><Text bold>User:</Text> {item.userName}</Text>
                    <Text><Text bold>Flower:</Text> {item.flowerName}</Text>
                    <Text><Text bold>Latitude:</Text> {item.latitude}</Text>
                    <Text><Text bold>Longitude:</Text> {item.longitude}</Text>
                    <Text><Text bold>Date Found:</Text> {item.date}</Text>
                    </Box>
                    <Box justifyContent='center' >
                    <Image source={{uri: item.images[0]}} alt="Flower picture" size={75} borderRadius={75}></Image>
                    </Box>
                    </HStack>
                    </Link>
                    </>
                )
            })}
            </VStack>
        )
    }
    
    return (
        <Box justifyContent='center' alignItems='center'>
        <Actionsheet isOpen={props.isOpen} onClose={props.onClose}>
        <Actionsheet.Content>
        <ScrollView w="100%" h="350" showsVerticalScrollIndicator={false}>
        <Data />
        </ScrollView>
        </Actionsheet.Content>
        </Actionsheet>
        <UserProfile userProfileVisible={userProfileVisible} setUserProfileVisible={setUserProfileVisible} userName={userName} userAvatar={userAvatar} posts={posts}/>
        </Box>
    );
}
