import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from "@angular/forms";
import {Address, addressTypeValues, Phone, phoneTypeValues} from "../contacts/contact.model";
import {ContactsService} from "../contacts/contacts.service";
import {restrictedWordsValidator} from "../validators/restricted-words.validator";

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  public phoneTypes = phoneTypeValues;
  public addressTypes = addressTypeValues;

  public contactForm = this.fb.nonNullable.group({
    id: "",
    personal: false,
    firstName: ["", [Validators.required, Validators.minLength(3)]],
    lastName: "",
    dateOfBirth: '',
    favoritesRanking: <number | null>null,
    phone: this.fb.nonNullable.group({
      phoneNumber: "",
      phoneType: "",
    }),
    address: this.fb.nonNullable.group({
      streetAddress: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      postalCode: ["", Validators.required],
      addressType: "",
    }),
    notes: ['', restrictedWordsValidator(['foo', 'bar'])]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private contactsService: ContactsService,
    private router: Router
  ) { }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;

    this.contactsService.getContact(contactId).subscribe(contact => {
      if (!contact) return;

      this.contactForm.setValue(contact);
    });
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  saveContact() {
    this.contactsService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts']),
    })
  }
}
