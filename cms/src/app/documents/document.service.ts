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

  getDocuments(): void {
    this
    .http
    .get<{message: string, documents: Document[]}>('http://localhost:3000/documents')
    .subscribe((response: any) => {
      this.documents = response.documents;
      this.maxDocumentId = this.getMaxId();
      this.documents.sort(
        (lhs: Document, rhs: Document)=>{
          if (lhs.id < rhs.id) {
            return -1;
          } else if (lhs.id === rhs.id) {
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

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }

    const index = this.documents.indexOf(document);
    if (index < 0) {
      return;
    }

    this.http.delete<{message: String}>(`http://localhost:3000/documents/${document.id}`)
    .subscribe((response: any) => {
      this.getDocuments();
    })
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


  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.documents.sort(
            (lhs: Document, rhs: Document)=>{
              if (lhs.id < rhs.id) {
                return -1;
              } else if (lhs.id === rhs.id) {
                return 0;
              } else {
                return 1;
              }
            }
          );
      this.documentChangedEvent.next(this.documents.slice());
        }
      );
  }

  
  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }

    let index = this.documents.indexOf(originalDocument);
    if (index < 0) {
      return;
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const strDocument = JSON.stringify(newDocument);

    this.http
    .put<{message: string}>(`http://localhost:3000/documents/${originalDocument.id}`, strDocument, {headers: headers})
    .subscribe((response: any) => {
      this.getDocuments();
    });
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
