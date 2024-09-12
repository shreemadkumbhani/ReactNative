import React from 'react';
import { ImageBackground, View, Image, StyleSheet, Text, Button } from 'react-native';
import ViewImageScreen from './ViewImageScreen';
import { useNavigation } from '@react-navigation/native';

function WelcomeScreen(props) {
    const navigation = useNavigation();
    return (
        <ImageBackground 
        style={styles.background}
            source={require('../assets/2.jpg')}
        >
        <View style={styles.logocontainer}>
            <Image
            style= {styles.logo}
            source={require("../assets/5.png")}/>
            <Text>Cyro Tech Geolocation Attendence System</Text>
        </View>
        <Button 
        style={styles.loginButton} 
        title='press me'
        onPress={() =>navigation.navigate("View")}
        ></Button>
        <View style={styles.registerButton}></View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    loginButton: {
        width: "100%",
        height: 70,
        backgroundColor: '#fc5c65'
    },
    logo: {
        width: 100,
        height: 100,
        
    },
    logocontainer:{
        position: "absolute",
        top: 120,
        alignItems: "center",
    },
    registerButton: {
        width: "100%",
        height: 70,
        backgroundColor: '#4ecdc4'
    }
})

export default WelcomeScreen;