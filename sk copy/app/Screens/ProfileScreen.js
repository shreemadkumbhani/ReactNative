import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const storedEmployees = await AsyncStorage.getItem("employees");
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const saveEmployees = async () => {
    try {
      await AsyncStorage.setItem("employees", JSON.stringify(employees));
    } catch (error) {
      console.error("Error saving employees:", error);
    }
  };

  const addEmployee = () => {
    if (
      name.trim() === "" ||
      jobTitle.trim() === "" ||
      department.trim() === ""
    ) {
      Alert.alert("Error", "Please enter valid employee details.");
      return;
    }

    const newEmployee = {
      name,
      jobTitle,
      department,
      attendance: [],
    };

    setEmployees([...employees, newEmployee]);
    setName("");
    setJobTitle("");
    setDepartment("");
    saveEmployees();
  };

  const handleClockInOutNavigation = (index) => {
    navigation.navigate("GeolocationAttendance", {
      employeeIndex: index,
      employee: employees[index],
    });
  };

  const renderAttendanceSummary = (attendance) => {
    if (attendance.length === 0) return "No attendance recorded yet";

    const totalHours = attendance.reduce((acc, curr, idx) => {
      if (
        curr.type === "clock-out" &&
        attendance[idx - 1]?.type === "clock-in"
      ) {
        const clockInTime = new Date(attendance[idx - 1].time).getTime();
        const clockOutTime = new Date(curr.time).getTime();
        return acc + (clockOutTime - clockInTime) / 1000 / 60 / 60;
      }
      return acc;
    }, 0);

    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    const seconds = Math.floor(((totalHours - hours) * 60 - minutes) * 60);

    return `Total Worked: ${hours}h ${minutes}m ${seconds}s`;
  };

  const renderBreakSummary = (attendance) => {
    const totalBreakTime = attendance.reduce((acc, curr, idx) => {
      if (
        curr.type === "break-end" &&
        attendance[idx - 1]?.type === "break-start"
      ) {
        const breakStartTime = new Date(attendance[idx - 1].time).getTime();
        const breakEndTime = new Date(curr.time).getTime();
        return acc + (breakEndTime - breakStartTime) / 1000 / 60 / 60;
      }
      return acc;
    }, 0);

    const breakHours = Math.floor(totalBreakTime);
    const breakMinutes = Math.floor((totalBreakTime - breakHours) * 60);
    const breakSeconds = Math.floor(
      ((totalBreakTime - breakHours) * 60 - breakMinutes) * 60
    );

    return `Total Break Time: ${breakHours}h ${breakMinutes}m ${breakSeconds}s`;
  };

  return (
    <LinearGradient colors={["#e1e8f0", "#d4dce7"]} style={styles.container}>
      <Text style={styles.title}>Employee Profiles</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Employee Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Job Title"
          value={jobTitle}
          onChangeText={(text) => setJobTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={(text) => setDepartment(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addEmployee}>
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={employees}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.employeeName}>{item.name}</Text>
              <Text style={styles.employeeDetails}>
                Job Title: {item.jobTitle}
              </Text>
              <Text style={styles.employeeDetails}>
                Department: {item.department}
              </Text>
              <Text style={styles.attendanceSummary}>
                {renderAttendanceSummary(item.attendance)}
              </Text>
              <Text style={styles.attendanceSummary}>
                {renderBreakSummary(item.attendance)}
              </Text>
              <TouchableOpacity
                style={styles.clockInOutButton}
                onPress={() => handleClockInOutNavigation(index)}
              >
                <Text style={styles.attendanceText}>Manage Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    alignItems: "center",
  },
  employeeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  employeeDetails: {
    fontSize: 16,
    marginBottom: 5,
  },
  attendanceSummary: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
  },
  clockInOutButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  attendanceText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProfileScreen;
