import React from 'react'
import { Button, Chip, HelperText, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper'
import { ContactFormData, FormPropsType } from '../types/Types'
import { StyleSheet, TextInput as RNTextInput, Keyboard, View } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import { Dropdown } from 'react-native-element-dropdown'
import { contactSchema, defaultFormValues, DEPARTMENTS } from '../definitions/Constants'
import { legendStore } from '../legend/Store'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'

const ContactFormModal = ({ visible, setVisible, action }: FormPropsType) => {
  const { colors } = useTheme()
  const inputsRef = React.useRef<RNTextInput[] | null[]>([]);
  const currentValues = action === "add" ? { ...defaultFormValues, id: uuidv4() } : legendStore.filters.get();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset
  } = useForm<ContactFormData>({
    resolver: action === "add" ? yupResolver(contactSchema) : undefined,
    mode: "onChange",
    defaultValues: currentValues,
  })

  const handleClose = () => {
    reset()
    setVisible(false)
  }

  const onSubmit = (data: ContactFormData) => {
    if (action === "add") {
      legendStore.addContact(data)
      reset()
    } else {
      legendStore.setFilters(data)
    }

    setVisible(false)
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.modalContainer}
        onDismiss={handleClose}
      >
        <Text variant='headlineSmall' style={{ textAlign: 'center' }}>
          {action === "add" ? "Nuevo Contacto" : "Filtrar Contactos"}
        </Text>

        <Text>
          Nombre {action == "add" && <Text style={{ color: colors.error }}>*</Text>}
        </Text>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <>
              <TextInput
                ref={(input: RNTextInput | null) => { inputsRef.current[0] = input }}
                mode='outlined'
                placeholder='Nombre'
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                error={!!errors.name}
                onSubmitEditing={() => inputsRef.current[1]?.focus()}
                returnKeyType={'next'}
                submitBehavior={'submit'}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name?.message}
              </HelperText>
            </>
          )}
        />

        <Text>
          Correo Electrónico {action == "add" && <Text style={{ color: colors.error }}>*</Text>}
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <>
              <TextInput
                ref={(input: RNTextInput | null) => { inputsRef.current[1] = input }}
                mode='outlined'
                placeholder='Correo Electrónico'
                onBlur={field.onBlur}
                value={field.value}
                onChangeText={field.onChange}
                error={!!errors.email}
                onSubmitEditing={() => inputsRef.current[2]?.focus()}
                returnKeyType={'next'}
                submitBehavior={'submit'}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email?.message}
              </HelperText>
            </>
          )}
        />

        <Text>Teléfono</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextInput
              ref={(input: RNTextInput | null) => { inputsRef.current[2] = input }}
              mode='outlined'
              placeholder='Teléfono'
              onBlur={field.onBlur}
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.phone}
              onSubmitEditing={() => Keyboard.dismiss()}
              returnKeyType={'next'}
            />
          )}
        />

        <Text style={styles.textInputs}>
          Departamento {action == "add" && <Text style={{ color: colors.error }}>*</Text>}
        </Text>

        {action === "add" ?
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <>
                <Dropdown
                  style={[
                    styles.dropdown,
                    errors.department && styles.errorBorder,
                    { backgroundColor: colors.surface }
                  ]}
                  data={DEPARTMENTS}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecciona un departamento"
                  placeholderStyle={{ color: '#404040' }}
                  value={field.value}
                  onChange={(item) => field.onChange(item.value)}
                />

                <HelperText type="error" visible={!!errors.department}>
                  {errors.department?.message}
                </HelperText>
              </>
            )}
          />
          :
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {DEPARTMENTS.map((dep) => {
                  const selected = field.value === dep.value;

                  return (
                    <Chip
                      key={dep.value}
                      selected={selected}
                      onPress={() =>
                        field.onChange(selected ? undefined : dep.value)
                      }
                    >
                      {dep.label}
                    </Chip>
                  );
                })}
              </View>
            )}
          />
        }

        <Button
          mode='contained'
          buttonColor='#0067b0'
          style={{ borderRadius: 5, marginTop: 20 }}
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}

        >
          {action === "add" ? "Guardar Contacto" : "Filtrar Contactos"}
        </Button>
        <Button
          mode='outlined'
          textColor='black'
          style={{ borderRadius: 5, marginTop: 5, opacity: 0.8 }}
          onPress={handleClose}
        >
          Cancelar
        </Button>
      </Modal>
    </Portal>
  )
}

export default ContactFormModal

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 5
  },
  textInputs: {
    marginTop: 24,
  },
  dropdownContainer: {
    marginBottom: 12,
  },
  labelDropdown: {
    marginBottom: 4,
    fontSize: 14,
  },
  dropdown: {
    height: 56,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#999",
    paddingHorizontal: 12,
  },
  errorBorder: {
    borderColor: "#B00020",
  },
})
