import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoalTimer = ({ goal, onTimeUpdate, onDelete }) => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(goal.timeSpent || 0); // 저장된 시간이 없으면 기본값 0

  // 타이머 가동
  useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000); // 1초마다 시간 증가
    } else if (!timerRunning && timeSpent !== 0) {
      clearInterval(interval); // 타이머 일시정지
    }

    return () => clearInterval(interval); // 컴포넌트가 언마운트되면 타이머 정리
  }, [timerRunning]);

  // 시간이 변경될 때 저장 및 업데이트
  useEffect(() => {
    if (goal.timeSpent !== timeSpent) {
      onTimeUpdate(goal.id, timeSpent); // App.js에 시간 업데이트
    }

    if (timeSpent >= goal.targetTime * 3600) {
      Alert.alert('축하합니다!', `${goal.activity} 목표를 달성했습니다!`);
      setTimerRunning(false); // 타이머 중지
    }
  }, [timeSpent]);

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;

  return (
    <View style={styles.goalContainer}>
      <Text style={styles.goalText}>{goal.activity} - 목표: {goal.targetTime}시간</Text>
      <Text style={styles.timeText}>
        기록된 시간: {hours}시간 {minutes}분 {seconds}초
      </Text>
      <Text style={styles.dateText}>시작일: {goal.startDate}</Text>
      <Text style={styles.dateText}>종료일: {goal.endDate}</Text>

      <Button
        title={timerRunning ? '일시정지' : '타이머 시작'}
        onPress={() => setTimerRunning(!timerRunning)}
      />

      <Button
        title="삭제"
        color="red"
        onPress={() => onDelete(goal.id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  goalContainer: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default GoalTimer;
