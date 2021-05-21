import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent: EventEmitter<Contact> = new EventEmitter<Contact>();
  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id: string) {
    if (!this.contacts) {
      return null;
    }

    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }

    return null;
  }
}
