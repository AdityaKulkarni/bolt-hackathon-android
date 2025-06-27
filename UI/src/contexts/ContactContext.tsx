import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  lastSeen?: string;
  location?: string;
  notes?: string;
  contact?: string;
}

interface ContactContextType {
  contacts: Contact[];
  recentContacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  recordSighting: (contactId: string, location?: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Samantha R.',
    relationship: 'Wife',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastSeen: '6pm • Golden Gate',
    location: 'Golden Gate'
  },
  {
    id: '2',
    name: 'Sarah J',
    relationship: 'Daughter',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastSeen: '5pm • Peet\'s Cafe',
    location: 'Peet\'s Cafe'
  },
  {
    id: '3',
    name: 'Liam Torres',
    relationship: 'Grandson',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastSeen: '4pm • Home',
    location: 'Home'
  },
  {
    id: '4',
    name: 'Brianna Lee',
    relationship: 'Neice',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastSeen: '11am • 3 Jun 2025',
    location: 'Park'
  }
];

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Load contacts from localStorage or use mock data
    const storedContacts = localStorage.getItem('memwar_contacts');
    if (storedContacts) {
      const parsed = JSON.parse(storedContacts);
      setContacts(parsed);
      setRecentContacts(parsed.slice(0, 4));
    } else {
      setContacts(mockContacts);
      setRecentContacts(mockContacts);
      localStorage.setItem('memwar_contacts', JSON.stringify(mockContacts));
    }
  }, []);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString()
    };
    
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    localStorage.setItem('memwar_contacts', JSON.stringify(updatedContacts));
  };

  const updateContact = (id: string, contactUpdate: Partial<Contact>) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === id ? { ...contact, ...contactUpdate } : contact
    );
    setContacts(updatedContacts);
    localStorage.setItem('memwar_contacts', JSON.stringify(updatedContacts));
  };

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    setRecentContacts(updatedContacts.slice(0, 4));
    localStorage.setItem('memwar_contacts', JSON.stringify(updatedContacts));
  };

  const recordSighting = (contactId: string, location?: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const lastSeen = location ? `${timeString} • ${location}` : timeString;
    
    updateContact(contactId, { lastSeen, location });
    
    // Move to recent contacts
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      const updatedRecent = [contact, ...recentContacts.filter(c => c.id !== contactId)].slice(0, 4);
      setRecentContacts(updatedRecent);
    }
  };

  return (
    <ContactContext.Provider value={{
      contacts,
      recentContacts,
      addContact,
      updateContact,
      deleteContact,
      recordSighting
    }}>
      {children}
    </ContactContext.Provider>
  );
};