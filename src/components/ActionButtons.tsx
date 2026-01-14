import React from 'react';
import { legendStore } from '../legend/Store';
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import ContactFormModal from './ContactFormModal';

const ActionButtons = () => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [actionsVisible, setActionsVisible] = React.useState<'add' | 'filter'>('add');

  return (
    <>
      {legendStore.hasActiveFilters.get() && (
        <Button
          mode='outlined'
          buttonColor='#408000'
          textColor='white'
          style={{ borderRadius: 5, marginVertical: 5 }}
          onPress={() => legendStore.clearFilters()}
        >
          Limpiar Filtros
        </Button>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          mode='contained'
          buttonColor='#0067b0'
          style={{ width: '49%', borderRadius: 5 }}
          onPress={() => {
            setModalVisible(true)
            setActionsVisible('filter')
          }}
        >
          Filtrar
        </Button>
        <Button
          mode='contained'
          buttonColor='#0067b0'
          style={{ width: '48%', borderRadius: 5 }}
          onPress={() => {
            setModalVisible(true)
            setActionsVisible('add')
          }}
        >
          Nuevo Contacto
        </Button>
        <ContactFormModal visible={modalVisible} setVisible={setModalVisible} action={actionsVisible} />
      </View>
    </>
  )
}

export default ActionButtons;
