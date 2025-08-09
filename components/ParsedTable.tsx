import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { WorkoutStep } from '../utils/types';

type Props = { steps: WorkoutStep[] };

const COLORS = {
  border: '#E5E7EB',
  text: '#111827',
  headerBg: '#F9FAFB',
  exercise: '#FFFFFF',
  rest: '#D6F5E3',
  time: '#FFF9C4',
};

const columns = ['Move', 'Sets', 'Reps', 'Weight', 'Time', 'Distance', 'Type'] as const;

export default function ParsedTable({ steps }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          {columns.map(col => (
            <View key={col} style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>{col}</Text>
            </View>
          ))}
        </View>
        {/* Body */}
        {steps.map((s, idx) => {
          const bg = s.type === 'rest' ? COLORS.rest : s.type === 'time' ? COLORS.time : COLORS.exercise;
          return (
            <View key={idx} style={[styles.row, { backgroundColor: bg }]}>
              <View style={styles.cell}><Text style={styles.text}>{s.exercise ?? s.raw}</Text></View>
              <View style={styles.cell}><Text style={styles.text}>{typeof s.sets === 'number' ? String(s.sets) : ''}</Text></View>
              <View style={styles.cell}><Text style={styles.text}>{s.reps && s.reps.length ? s.reps.join(', ') : ''}</Text></View>
              <View style={styles.cell}><Text style={styles.text}>{s.weight ?? ''}</Text></View>
              <View style={styles.cell}><Text style={styles.text}>{s.duration ?? ''}</Text></View>
              <View style={styles.cell}><Text style={styles.text}>{s.distance ?? ''}</Text></View>
              <View style={styles.cell}><Text style={styles.text}>{s.type}</Text></View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 700,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: {
    backgroundColor: COLORS.headerBg,
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  headerCell: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  headerText: {
    fontWeight: '700',
    color: COLORS.text,
  },
  text: {
    color: COLORS.text,
  },
});


