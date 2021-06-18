import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent: EventEmitter<Document> = new EventEmitter<Document>();
  documentChangedEvent: EventEmitter<Document[]> = new EventEmitter<Document[]>();
  documentListChangedEvent: Subject<Document[]> = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getDocuments(){
    this
    .http
    .get('https://cms-ng-default-rtdb.firebaseio.com/documents.json')
    .subscribe((documents: any) => {
      this.documents = documents;
      this.maxDocumentId = this.getMaxId();
      this.documents.sort(
        (l: Document, r: Document)=> {
          if (l.id < r.id) {
            return -1;
          } else if (l.id === r.id) {
            return 0;
          } else {
            return 1;
          }
        }
      );
      this.documentListChangedEvent.next(this.documents.slice());
    }, (err: any) => {
      console.error(err);
    });
  }

  getDocument(id: string): Document {
    if (!this.documents) {
      return null;
    }

    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }

    return null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  
  getMaxId(): number {
    let maxID = 0;
    for (let document of this.documents) {
      let currentID = +document.id;
      if (currentID > maxID) {
        maxID = currentID;
      }
    }
    return maxID;
  }

  addDocument(newDocument: Document){
    if(!newDocument){
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  
updateDocument(originalDocument: Document, newDocument: Document) {
  if (!originalDocument || !newDocument) {
    return;
  }

  let pos = this.documents.indexOf(originalDocument);
  if (pos < 0){ 
    return;
  }

  newDocument.id = originalDocument.id;
  this.documents[pos] = newDocument;
  this.storeDocuments();
}

storeDocuments() {
  let json = JSON.stringify(this.documents);
  let header = new HttpHeaders();
  header.set('Content-Type', 'application/json');
  this
  .http
  .put<{message: string}>('https://cms-ng-default-rtdb.firebaseio.com/documents.json', json, {
    headers: header
  }).subscribe(() => {
    this.documentListChangedEvent.next(this.documents.slice());
  });
}
}
