import React from 'react';
import { Button, Image, StyleSheet, SafeAreaView, View } from 'react-native';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';

function ViewImageScreen(props) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
        <View style={styles.closeIcon}>
        </View>
        <SafeAreaView>
            <Button
            title='back'
            onPress={() =>navigation.goBack()}/>
        </SafeAreaView>
        <View style={styles.deleteIcon}></View>
        <Image 
        resizeMode='contain'
        style={styles.image}
        source={require("../assets/download.jpg")}></Image>
        </View>
        
    );
}

const styles = StyleSheet.create({
    closeIcon: {
        width: 50,
        height: 50,
        backgroundColor: colors.primary,
        position: "absolute",
        top: 120,
        left: 30,
    },
    deleteIcon: {
        width: 50,
        height: 50,
        backgroundColor: colors.secondary,
        position: "absolute",
        top: 120,
        right: 30,
    },
    container: {
        backgroundColor: colors.black,
        flex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
    }
})

export default ViewImageScreen;