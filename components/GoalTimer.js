import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const GoalTimer = ({ goal, onTimeUpdate }) => {
  const [timerRunning, setTimerRunning] = useState(false);  // 타이머 동작 여부 상태
  const [timeSpent, setTimeSpent] = useState(goal.timeSpent);  // 기록된 시간 상태

  useEffect(() => {
    let interval = null;

    // 타이머 동작 중이면 1초마다 시간 증가
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);  // 1초마다 실행 (원하는 시간 단위로 조정 가능)
    } else if (!timerRunning && timeSpent !== 0) {
      clearInterval(interval);  // 타이머 일시정지
    }

    return () => clearInterval(interval);  // 컴포넌트가 언마운트되면 타이머 정리
  }, [timerRunning]);

  // 시간이 변경될 때마다 App.js에 업데이트
  useEffect(() => {
    onTimeUpdate(goal.id, timeSpent);
  }, [timeSpent]);

  return (
    <View style={styles.goalContainer}>
      <Text style={styles.goalText}>{goal.activity} - 목표: {goal.targetTime}시간</Text>
      <Text style={styles.timeText}>기록된 시간: {Math.floor(timeSpent / 3600)}시간 {Math.floor((timeSpent % 3600) / 60)}분</Text>
      <Button
        title={timerRunning ? "일시정지" : "타이머 시작"}
        onPress={() => setTimerRunning(!timerRunning)}
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
});

export default GoalTimer;
