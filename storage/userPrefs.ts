import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeEquip } from '../utils/equipment';

const EQUIP_KEY = 'SPOTTER_USER_EQUIPMENT_V1';
const TYPES_KEY = 'SPOTTER_USER_TYPES_V1';
const FLAGS_KEY = 'SPOTTER_FLAGS_V1';

export async function getUserEquipmentList(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(EQUIP_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addUserEquipment(term: string): Promise<void> {
  const list = await getUserEquipmentList();
  const norm = normalizeEquip(term);
  if (!norm) return;
  const set = new Set(list.map(normalizeEquip));
  set.add(norm);
  await AsyncStorage.setItem(EQUIP_KEY, JSON.stringify(Array.from(set)));
}

export async function getUserWorkoutTypes(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(TYPES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addUserWorkoutType(term: string): Promise<void> {
  const list = await getUserWorkoutTypes();
  const norm = (term || '').toLowerCase().trim();
  if (!norm) return;
  const set = new Set(list.map(t => t.toLowerCase().trim()));
  set.add(norm);
  await AsyncStorage.setItem(TYPES_KEY, JSON.stringify(Array.from(set)));
}

export async function getFlags(): Promise<{ backendEnabled: boolean }> {
  const raw = await AsyncStorage.getItem(FLAGS_KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  return { backendEnabled: Boolean(parsed.backendEnabled) };
}


