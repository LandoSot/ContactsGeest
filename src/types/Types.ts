export type DepartmentType = "Ventas" | "Desarrollo" | "Marketing" | "Soporte";

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: DepartmentType;
};

export type ContactFilters = {
  name?: string;
  email?: string;
  phone?: string;
  department?: DepartmentType;
};

export interface LegendStoreType {
  contacts: Contact[];
  totalContacts: number;
  filters: ContactFilters;
  filteredContactsCount: number;
  hasActiveFilters: boolean;
  isLoading: boolean;
  setFilters: (filters: Partial<ContactFilters>) => void;
  clearFilters: () => void;
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  filteredContacts: Contact[];
  loadContacts: () => Promise<void>;
};

export interface FormPropsType {
  visible: boolean;
  setVisible: (value: boolean) => void;
  action: "add" | "filter";
}

export type ContactFormData = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: DepartmentType;
};
