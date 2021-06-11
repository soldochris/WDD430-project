import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.editMode = false;
      let id = params['id'];
      if (id === null || id === undefined) {
        return;
      }

      let document = this.documentService.getDocument(id);
      if (!document) {
        return;
      }

      this.originalDocument = document;
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(document));
    });
  }

  onSubmit(form: NgForm) {
    let document = new Document('', form.value.name, form.value.description, form.value.url, null);
    if (this.editMode === true) {
      this.documentService.updateDocument(this.originalDocument, document);
    } else {
      this.documentService.addDocument(document);
    }

    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

}
