import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent: EventEmitter<Contact> = new EventEmitter<Contact>();
  contactChangedEvent: EventEmitter<Contact[]> = new EventEmitter<Contact[]>();
  contactListChangedEvent: Subject<Contact[]> = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactID: number;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getContacts() {
    this
    .http
    .get('https://cms-ng-default-rtdb.firebaseio.com/contacts.json')
    .subscribe((contacts: any) => {
      this.contacts = contacts;
      this.maxContactID = this.getMaxId();
      this.contacts.sort(
        (l: Contact, r: Contact)=> {
          if (l.id < r.id) {
            return -1;
          } else if (l.id === r.id) {
            return 0;
          } else {
            return 1;
          }
        }
      );
      this.contactListChangedEvent.next(this.contacts.slice());
    }, (err: any) => {
      console.error(err);
    });
  }

  getContact(id: string): Contact {
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

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactID++;
    newContact.id = this.maxContactID.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
  
    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0){ 
      return;
    }
  
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  getMaxId(): number {
    let maxID = 0;
    for (let contact of this.contacts) {
      let currentID = +contact.id;
      if (currentID > maxID) {
        maxID = currentID;
      }
    }

    return maxID;
  }

  storeContacts() {
    let json = JSON.stringify(this.contacts);
    let header = new HttpHeaders();
    header.set('Content-Type', 'application/json');
    this
    .http
    .put<{message: string}>('https://cms-ng-default-rtdb.firebaseio.com/contacts.json', json, {
      headers: header
    }).subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }
}
