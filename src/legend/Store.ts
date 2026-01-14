import { computed, observable } from "@legendapp/state";
import { Contact, ContactFilters, DepartmentType, LegendStoreType } from "../types/Types";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";

export const legendStore = observable<LegendStoreType>({
  contacts: [],
  totalContacts: computed((): number => legendStore.contacts.length),
  filters: {
    name: "",
    email: "",
    phone: "",
    department: undefined as DepartmentType | undefined,
  },
  hasActiveFilters: computed<boolean>(() => {
    const filters: ContactFilters = legendStore.filters.get();

    return Object.values(filters).some((value) => {
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      return value != null;
    });
  }),

  filteredContactsCount: computed<number>((): number => {
    return legendStore.filteredContacts.length;
  }),

  addContact: (contact) => {
    legendStore.contacts.push(contact);
  },
  removeContact: (id: string) => {
    legendStore.contacts.set((prev: Contact[]) =>
      prev.filter((c) => c.id !== id)
    );
  },

  setFilters: (filters: Partial<ContactFilters>) => {
    console.log('>> Setting filters:', filters);
    legendStore.filters.assign(filters);
  },
  clearFilters: () => {
    console.log('>> Clearing filters');
    legendStore.filters.set({
      name: "",
      email: "",
      phone: "",
      department: undefined,
    });
  },

  filteredContacts: computed<Contact[]>(() => {
    const contacts: Contact[] = legendStore.contacts.get();
    const { name, email, phone, department } = legendStore.filters.get();

    return contacts.filter((contact: Contact) => {
      if (name && !contact.name.toLowerCase().includes(name.toLowerCase()))
        return false;

      if (email && !contact.email.toLowerCase().includes(email.toLowerCase()))
        return false;

      if (phone && !contact.phone?.toLowerCase().includes(phone.toLowerCase()))
        return false;

      if (department && contact.department !== department)
        return false;

      return true;
    });
  }),

  isLoading: false,
  loadContacts: async () => {
    legendStore.isLoading.set(true);

    // Timeout para simular el tiempo de carga del backend
    await new Promise(resolve => setTimeout(resolve, 800));

    legendStore.isLoading.set(false);
  },
});

syncObservable(legendStore, {
  persist: {
    name: "contacts",
    plugin: ObservablePersistMMKV,
  },
});
