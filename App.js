import React, { useState } from 'react';
import { View, Button, Text, Platform, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoalTimer from './components/GoalTimer';  // 타이머 컴포넌트 임포트

const App = () => {
  const [activity, setActivity] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [goals, setGoals] = useState([]);

  // 목표 추가 함수
  const addGoal = () => {
    if (activity.length === 0 || targetTime.length === 0) {
      Alert.alert("활동명과 목표 시간을 입력해주세요");
      return;
    }

    const newGoal = {
      id: Math.random().toString(),
      activity: activity,
      targetTime: parseInt(targetTime),
      timeSpent: 0,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
    };
    setGoals((currentGoals) => [...currentGoals, newGoal]);
    setActivity('');
    setTargetTime('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const updateGoalTime = (id, newTime) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === id ? { ...goal, timeSpent: newTime } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="활동명 입력"
        style={styles.input}
        value={activity}
        onChangeText={setActivity}
      />
      <TextInput
        placeholder="목표 시간(시간 단위)"
        style={styles.input}
        value={targetTime}
        onChangeText={setTargetTime}
        keyboardType="numeric"
      />

      <Button title="시작 날짜 선택" onPress={() => setShowStartDatePicker(true)} />
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      <Text>시작 날짜: {startDate.toLocaleDateString()}</Text>

      <Button title="종료 날짜 선택" onPress={() => setShowEndDatePicker(true)} />
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
      <Text>종료 날짜: {endDate.toLocaleDateString()}</Text>

      <Button title="목표 추가" onPress={addGoal} color="#841584"/>

      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <GoalTimer
            key={item.id}
            goal={item}
            onTimeUpdate={updateGoalTime}
            onDelete={deleteGoal} 
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    marginVertical: 10,
    padding: 10,
    fontSize: 18,
  },
});

export default App;
