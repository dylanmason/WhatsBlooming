import React, { useEffect, useState } from "react";
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Box,
} from "native-base";
import SignIn from './components/SignIn';
import Home from './components/Home';
import Post from './components/Post';
import Settings from './components/Settings';
import NewUser from './components/NewUser';
import PostList from "./components/PostList";
import UserProfile from "./components/UserProfile";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuthToken } from "./components/asyncStorage";

const Stack = createNativeStackNavigator();

export default function App() {

    let token;

    useEffect(() => {
        (async () => {
            let token = await getAuthToken();
            console.log("token in app.tsx is", token);
        })();
    }, []);

    return (
        <NativeBaseProvider>
        <NavigationContainer>
        <Stack.Navigator
        initialRouteName={token !== null ? "Home" : "SignIn"}
        screenOptions={{
            headerShown: false,
        }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="NewUser" component={NewUser} />
        <Stack.Screen name="PostList" component={PostList} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
        </NavigationContainer> 
        </NativeBaseProvider>
  );
}
