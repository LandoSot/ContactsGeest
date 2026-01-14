import React, { useCallback } from 'react'
import { Dimensions, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useValue } from '@legendapp/state/react';
import { legendStore } from '../legend/Store';
import { Contact } from '../types/Types';
import { FlashList } from "@shopify/flash-list";
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Surface, Text } from 'react-native-paper';
import ActionButtons from '../components/ActionButtons';
const wWidth = Dimensions.get('window').width;

const Home = () => {
  const totalContacts = useValue(legendStore.totalContacts);
  const filteredContactsCount = useValue(legendStore.filteredContactsCount);
  const isLoading = useValue(legendStore.isLoading);

  React.useEffect(() => {
    legendStore.loadContacts();
  }, []);

  const contactRender = useCallback(
    ({ item: contact }: { item: Contact }) => {
      return (
        <View style={styles.contactCard}>
          <View style={{ flex: 1 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{contact.name}</Text>
              <Text style={{ fontSize: 16 }}>{contact.email}</Text>
            </View>
            {contact.phone && <Text style={{ fontSize: 16 }}>Tel: {contact.phone}</Text>}
            {contact.department && <Text style={{ fontSize: 16 }}>Dept: {contact.department}</Text>}
          </View>

          <TouchableOpacity
            style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}
            onLongPress={() => legendStore.removeContact(contact.id)}
          >
            <Ionicons name="trash-outline" size={24} color="black" />
            <Text style={{ fontWeight: 'bold' }}>Hold</Text>
          </TouchableOpacity>
        </View>
      )
    }, []
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'top']}>
        {Array.from({ length: 8 }).map((_, index) =>
          <Surface key={index} style={styles.surfaceSkeleton}>
            <View></View>
          </Surface>
        )}
      </SafeAreaView>
    )
  }

  if (totalContacts === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'top']}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => legendStore.loadContacts()}
            />
          }
        >
          <View style={styles.noContactsContainer}>
            <Feather name="users" size={50} color="black" />
            <Text>No contacts found</Text>
          </View>

          <ActionButtons />
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'top']}>
      <FlashList
        data={legendStore.filteredContacts.get()}
        keyExtractor={(contact) => contact.id}
        renderItem={contactRender}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => legendStore.loadContacts()}
          />
        }

        ListHeaderComponent={legendStore.hasActiveFilters.get() ? (
          <Text style={styles.filteringInfoText}>
            {filteredContactsCount} de {totalContacts} contactos filtrados
          </Text>
        ) : null}
      />

      <ActionButtons />
    </SafeAreaView>
  )
}

export default Home;

const styles = StyleSheet.create({
  surfaceSkeleton: {
    width: (wWidth * 0.90),
    height: 80,
    marginBottom: 12,
    borderRadius: 6,
    elevation: 5
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filteringInfoText: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  contactCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row'
  }
})
