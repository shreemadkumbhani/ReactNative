import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GeolocationAttendanceScreen = ({ route, navigation }) => {
  const { employeeIndex, employee } = route.params;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentClock, setCurrentClock] = useState(new Date());
  const [workDuration, setWorkDuration] = useState(0); // Work duration in seconds
  const [breakDuration, setBreakDuration] = useState(0); // Break duration in seconds
  const [isWorking, setIsWorking] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [clockInterval, setClockInterval] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null); // Track break start time

  useEffect(() => {
    // Ask for location permissions
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  useEffect(() => {
    if (isWorking) {
      // Start the clock when working
      const interval = setInterval(() => {
        setCurrentClock(new Date());
        setWorkDuration((prevDuration) => prevDuration + 1); // Increment work duration
      }, 1000);
      setClockInterval(interval);
    } else if (clockInterval) {
      clearInterval(clockInterval); // Stop the interval when not working
      setClockInterval(null);
    }

    return () => {
      if (clockInterval) {
        clearInterval(clockInterval); // Cleanup interval on unmount
      }
    };
  }, [isWorking]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const saveAttendance = async (type) => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    const time = new Date().toISOString();
    const newRecord = {
      type,
      time,
      location: currentLocation.coords,
    };

    employee.attendance.push(newRecord);
    const employees = JSON.parse(await AsyncStorage.getItem("employees"));
    employees[employeeIndex] = employee;
    await AsyncStorage.setItem("employees", JSON.stringify(employees));

    Alert.alert(
      "Success",
      `${
        type === "clock-in"
          ? "Clocked In"
          : type === "clock-out"
          ? "Clocked Out"
          : type === "break-start"
          ? "Started Break"
          : "Ended Break"
      } successfully.`
    );
  };

  const handleClockInOut = () => {
    if (isWorking) {
      // Calculate total worked time excluding break time
      const totalWorkedTime = workDuration - breakDuration;
      saveAttendance("clock-out");
      setIsWorking(false);

      // Pass back total worked time and break time to ProfileScreen
      navigation.navigate("Profile", {
        totalWorkedTime,
        totalBreakTime: breakDuration,
      });

      // Reset timers
      setWorkDuration(0);
      setBreakDuration(0);
    } else {
      saveAttendance("clock-in");
      setIsWorking(true);
    }
  };

  const handleBreakToggle = () => {
    if (onBreak) {
      const breakEndTime = new Date();
      // Calculate break duration
      const breakDurationTime = Math.floor(
        (breakEndTime - breakStartTime) / 1000
      );
      setBreakDuration((prevDuration) => prevDuration + breakDurationTime); // Add break duration to total break time
      saveAttendance("break-end");
      setOnBreak(false);
    } else {
      setBreakStartTime(new Date()); // Set break start time
      saveAttendance("break-start");
      setOnBreak(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geolocation Attendance</Text>
      <Text style={styles.subtitle}>
        {errorMsg
          ? errorMsg
          : location
          ? `Location: ${location.coords.latitude}, ${location.coords.longitude}`
          : "Fetching location..."}
      </Text>

      {/* Real-time clock */}
      <View style={styles.clockContainer}>
        <Text style={styles.clockText}>
          Current Time: {currentClock.toLocaleTimeString()}
        </Text>
        <Text style={styles.clockText}>
          Work Timer: {formatTime(workDuration)}
        </Text>
        <Text style={styles.clockText}>
          Break Timer: {formatTime(breakDuration)}
        </Text>
      </View>

      {/* Clock In/Out button */}
      <TouchableOpacity style={styles.button} onPress={handleClockInOut}>
        <Text style={styles.buttonText}>
          {isWorking ? "Clock Out" : "Clock In"}
        </Text>
      </TouchableOpacity>

      {/* Start/End Break button */}
      {isWorking && (
        <TouchableOpacity style={styles.button} onPress={handleBreakToggle}>
          <Text style={styles.buttonText}>
            {onBreak ? "End Break" : "Start Break"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  clockContainer: {
    marginBottom: 30,
  },
  clockText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default GeolocationAttendanceScreen;
