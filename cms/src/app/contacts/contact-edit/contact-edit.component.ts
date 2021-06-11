import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.editMode = false;
      let id = params['id'];
      if (id === null || id === undefined) {
        this.editMode = false;
        return;
      }

      let originalContact = this.contactService.getContact(id)
      if (originalContact === null || originalContact === undefined) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(originalContact));

      if (this.contact.group) {
        this.groupContacts = this.contact.group.slice();
      }
    });
  }

  onSubmit(form: NgForm) {
    let contact = new Contact(
      form.value.id,
      form.value.name,
      form.value.email,
      form.value.phone,
      form.value.imageUrl,
      this.groupContacts
    );
    if (this.editMode === true) {
      this.contactService.updateContact(this.originalContact, contact);
    } else {
      this.contactService.addContact(contact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      // newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}
