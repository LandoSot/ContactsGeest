import * as yup from 'yup'
import { DepartmentType } from '../types/Types';


export const DEPARTMENTS = [
  { label: "Ventas", value: "Ventas" },
  { label: "Desarrollo", value: "Desarrollo" },
  { label: "Marketing", value: "Marketing" },
  { label: "Soporte", value: "Soporte" },
];

export const contactSchema = yup.object({
  id: yup.string().required(),
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "Ingresa al menos 3 caracteres"),
  email: yup
    .string()
    .required("El email es obligatorio")
    .email("El email no es válido"),
  // phone: yup.string().optional(),
  department: yup
    .mixed<DepartmentType>()
    .oneOf(["Ventas", "Desarrollo", "Marketing", "Soporte"])
    .required("El departamento es obligatorio"),
});

export const defaultFormValues = {
  name: "",
  email: "",
  phone: "",
  department: undefined,
}

export const skeletonLayout = [
  { key: '1', flex: 1, height: 80, marginBottom: 12 },
  { key: '2', flex: 1, height: 80, marginBottom: 12 },
  { key: '3', flex: 1, height: 80, marginBottom: 12 },
]
