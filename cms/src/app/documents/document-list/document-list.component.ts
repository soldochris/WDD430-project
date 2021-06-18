import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  subscription: Subscription;


  constructor(private documentService: DocumentService) { }

  ngOnInit(){
    this.documentService.documentChangedEvent.subscribe((documents: Document[]) => {
      this.documents = documents.slice();
    });

    this.subscription = this.documentService.documentListChangedEvent.subscribe((documents: Document[]) => {
      this.documents = documents;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
