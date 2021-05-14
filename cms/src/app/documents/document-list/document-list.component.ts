import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1,'document 1','The first document','https://static1.squarespace.com/static/5019271be4b0807297e8f404/t/5df9306ec60881645ea57ced/1576611956760/CSharp+Book+2019+Refresh.pdf',null),
    new Document(2,'document 2','The second document','https://static1.squarespace.com/static/5019271be4b0807297e8f404/t/5df9306ec60881645ea57ced/1576611956760/CSharp+Book+2019+Refresh.pdf',null),
    new Document(3,'document 3','The third document','https://static1.squarespace.com/static/5019271be4b0807297e8f404/t/5df9306ec60881645ea57ced/1576611956760/CSharp+Book+2019+Refresh.pdf',null),
    new Document(4,'document 4','The fourth document','https://static1.squarespace.com/static/5019271be4b0807297e8f404/t/5df9306ec60881645ea57ced/1576611956760/CSharp+Book+2019+Refresh.pdf',null),
    new Document(5,'document 5','The fifth document','https://static1.squarespace.com/static/5019271be4b0807297e8f404/t/5df9306ec60881645ea57ced/1576611956760/CSharp+Book+2019+Refresh.pdf',null)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
