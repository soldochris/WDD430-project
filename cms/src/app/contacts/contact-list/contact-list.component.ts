import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  term: string;
  contacts: Contact[] = [];
  subscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit(){
    this.contactService.contactChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts.slice();
    });
    this.subscription = this.contactService.contactListChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
  }

  onContactSelected(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }

  onKeyPress(value: string) {
    this.term = value;
  }
}
