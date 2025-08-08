// components/WorkoutCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkoutStep } from '../utils/types';

type Props = { step: WorkoutStep };

const COLORS = {
  border: '#E5E7EB',
  text: '#111827',
  // backgrounds
  exercise: '#FFFFFF',
  rest: '#D6F5E3',   // calming mint
  time: '#FFF9C4',   // soft yellow
  meta: '#6B7280',
  chipBg: '#F3F4F6',
};

const ICONS: Record<WorkoutStep['type'], string> = {
  exercise: '💪',
  rest: '🧘',
  time: '⏱️',
};

export default function WorkoutCard({ step }: Props) {
  const bg =
    step.type === 'rest' ? COLORS.rest :
    step.type === 'time' ? COLORS.time :
    COLORS.exercise;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{ICONS[step.type]}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {step.exercise ?? step.raw}
          </Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            {step.type === 'exercise' && typeof step.sets === 'number' && (
              <View style={styles.chip}><Text style={styles.chipText}>{step.sets} sets</Text></View>
            )}
            {step.type === 'exercise' && step.reps?.length ? (
              <View style={styles.chip}><Text style={styles.chipText}>{step.reps.join(', ')} reps</Text></View>
            ) : null}
            {(step.type === 'rest' || step.type === 'time') && step.duration && (
              <View style={styles.chip}><Text style={styles.chipText}>{step.duration}</Text></View>
            )}
            {/* Fallback chip to show raw when we couldn't parse everything */}
            {!step.exercise && (
              <View style={styles.chip}><Text style={styles.chipText}>unparsed</Text></View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', gap: 8 },
  icon: { fontSize: 20, marginRight: 8 },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: {
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, color: COLORS.meta },
});
