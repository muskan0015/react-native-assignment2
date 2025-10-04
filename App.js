import 'react-native-reanimated'; 
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, Platform, FlatList, RefreshControl, Alert, StatusBar, Image, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; 

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './theme/styles';

const STORAGE_KEY = '@users_list';

const mapUser = (u) => ({
  id: u.login?.uuid ?? `${Date.now()}-${Math.random()}`,
  first: u.name?.first ?? 'First',
  last: u.name?.last ?? 'Last',
  avatar: u.picture?.thumbnail ?? undefined,
});

async function fetchUsers(count = 10) {
  const url = `https://randomuser.me/api/?results=${count}&inc=login,name,picture&noinfo`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).map(mapUser);
}

// Simple Avatar (no UI kit)
function SimpleAvatar({ uri, title }) {
  return (
    <View style={styles.avatarCircle}>
      {uri ? (
        <Image source={{ uri }} style={styles.avatarImage} />
      ) : (
        <Text style={styles.avatarInitial}>{title?.toUpperCase?.() || '?'}</Text>
      )}
    </View>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [booted, setBooted] = useState(false);

  // initial load: from storage, else fetch 10
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUsers(JSON.parse(raw));
        } else {
          const initial = await fetchUsers(10);
          setUsers(initial);
        }
      } catch (e) {
        console.warn('Init error:', e);
        const initial = await fetchUsers(10);
        setUsers(initial);
      } finally {
        setBooted(true);
      }
    })();
  }, []);

  // persist whenever users change (after boot)
  useEffect(() => {
    if (!booted) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users)).catch((e) =>
      console.warn('Storage save error:', e)
    );
  }, [users, booted]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const fresh = await fetchUsers(10);
      setUsers(fresh);
    } catch (e) {
      Alert.alert('Error', 'Failed to refresh users.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const addOne = useCallback(async () => {
    try {
      const [one] = await fetchUsers(1);
      setUsers((prev) => [one, ...prev]); // add to TOP
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch a new user.');
    }
  }, []);

  const removeById = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const renderRightActions = useCallback(
    (itemId) => () => (
      <View style={styles.rightActionWrap}>
        <Text
          onPress={() => removeById(itemId)}
          style={styles.rightActionText}
          accessibilityRole="button"
          accessible
          accessibilityLabel="Delete user"
        >
          DELETE
        </Text>
      </View>
    ),
    [removeById]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(({ item }) => {
    // avatar right on iOS, left on Android
    const rowStyle = Platform.OS === 'ios' ? styles.rowReverse : styles.row;

    return (
      <Swipeable renderRightActions={renderRightActions(item.id)}>
        <View style={rowStyle}>
          <SimpleAvatar uri={item.avatar} title={item.first?.[0]} />
          <View style={styles.nameWrap}>
            <Text style={styles.firstName}>{item.first}</Text>
            <Text style={styles.lastName}>{item.last}</Text>
          </View>
        </View>
        <View style={styles.separator} />
      </Swipeable>
    );
  }, [renderRightActions]);

  const listContent = useMemo(() => styles.listContent, []);

  return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={styles.screen}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}> 
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>Welcome to the User List</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Platform.OS === 'ios' ? '#000' : undefined}
          />
        }
      />

      
      <Pressable style={styles.fab} onPress={addOne} accessibilityLabel="Add one user">
        <Text style={styles.fabPlus}>＋</Text>
      </Pressable>
      </SafeAreaView>
    </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}



