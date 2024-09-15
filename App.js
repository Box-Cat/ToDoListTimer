import React, { useState, useEffect } from 'react';
import { View, Button, Text, Platform, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoalTimer from './components/GoalTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [activity, setActivity] = useState('');
  const [targetTimeHour, setTargetTimeHour] = useState(0);
  const [targetTimeMin, setTargetTimeMin] = useState(0);
  const [targetTimeSec, setTargetTimeSec] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [goals, setGoals] = useState([]);

  // 목표 추가 함수
  const addGoal = async () => {
    if (activity.length === 0 || targetTimeHour.length === 0 || targetTimeMin.length === 0 || targetTimeSec.length === 0) {
      Alert.alert('활동명과 목표 시간을 입력해주세요');
      return;
    }

    const newGoal = {
      id: Math.random().toString(),
      activity: activity,
      targetTimeHour: parseInt(targetTimeHour),
      targetTimeMin: parseInt(targetTimeMin),
      targetTimeSec: parseInt(targetTimeSec),
      timeSpent: 0,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);

    try {
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.log('목표 저장 중 오류:', error);
    }

    setActivity('');
    setTargetTimeHour(0);
    setTargetTimeMin(0);
    setTargetTimeSec(0);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  // 목표 시간 업데이트
  const updateGoalTime = async (id, newTime) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, timeSpent: newTime } : goal
    );
    setGoals(updatedGoals);

    try {
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals)); 
    } catch (error) {
      console.log('시간 업데이트 중 오류:', error);
    }
  };

  // 목표 삭제
  const deleteGoal = async (id) => {
    const filteredGoals = goals.filter((goal) => goal.id !== id);
    setGoals(filteredGoals);

    try {
      await AsyncStorage.setItem('goals', JSON.stringify(filteredGoals)); // 업데이트된 목표 저장
    } catch (error) {
      console.log('목표 삭제 중 오류:', error);
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  // (1)분,초의 0~59 맞추기(max가 59) (2)016=>16으로 바꾸기
  const checkTimeRange = (value, max) => {
    const numberValue = parseInt(value, 10);
    if (isNaN(numberValue) || numberValue < 0) return 0;
    return max ? (numberValue > max ? max : numberValue) : numberValue;
  };

  // 앱을 실행할 때 목표 불러오기
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const storedGoals = await AsyncStorage.getItem('goals');
        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        }
      } catch (error) {
        console.log('목표 로드 중 오류:', error);
      }
    };

    loadGoals();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="활동명 입력"
        style={styles.input}
        value={activity}
        onChangeText={setActivity}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="0"
          style={styles.inputField}
          value={targetTimeHour.toString()}
          onChangeText={(hour) => setTargetTimeHour(checkTimeRange(hour))}
          keyboardType="numeric"
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          placeholder="0"
          style={styles.inputField}
          value={targetTimeMin.toString()}
          onChangeText={(min) => setTargetTimeMin(checkTimeRange(min, 59))}
          keyboardType="numeric"
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          placeholder="0"
          style={styles.inputField}
          value={targetTimeSec.toString()}
          onChangeText={(sec) => setTargetTimeSec(checkTimeRange(sec, 59))}
          keyboardType="numeric"
        />
      </View>

      <Button title="시작 날짜 선택" onPress={() => setShowStartDatePicker(true)} />
      {showStartDatePicker && (
        <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />
      )}
      <Text>시작 날짜: {startDate.toLocaleDateString()}</Text>

      <Button title="종료 날짜 선택" onPress={() => setShowEndDatePicker(true)} />
      {showEndDatePicker && (
        <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />
      )}
      <Text>종료 날짜: {endDate.toLocaleDateString()}</Text>

      <Button title="목표 추가" onPress={addGoal} color="#841584" />

      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <GoalTimer
            key={item.id}
            goal={item}
            updateGoalTime={updateGoalTime}
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
    paddingTop: 10,
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000', 
  },
  inputField: {
    width: 50,
    textAlign: 'center',
    fontSize: 18,
  },
  colon: {
    fontSize: 18,
    marginHorizontal: 5,
  },
});

export default App;
