import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get("window").height)
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 1,
        bounciness: 15,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={["#2c3e50", "#4ca1af", "#2c3e50"]}
      style={styles.container}
    >
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        👋 Welcome Back!
      </Animated.Text>

      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.buttonBackground}
          >
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Go to Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("TotalAttendance")}
        >
          <LinearGradient
            colors={["#fc4a1a", "#f7b733"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.buttonBackground}
          >
            <Ionicons
              name="calendar-outline"
              size={28}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>View Total Attendance</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("GeolocationAttendance")}
        >
          <LinearGradient
            colors={["#56ab2f", "#a8e063"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.buttonBackground}
          >
            <Ionicons
              name="location-outline"
              size={28}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Track Geolocation Attendance</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.footerTextContainer, { opacity: fadeAnim }]}
      >
        <Text style={styles.footerText}>
          Stay on top of your attendance. Seamless and easy. 🚀
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 50,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginVertical: 15,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonBackground: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  icon: {
    marginRight: 15,
  },
  footerTextContainer: {
    marginTop: 60,
  },
  footerText: {
    fontSize: 14,
    color: "#ffffff",
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
