import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';


@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef; 
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender:string ='christian';
  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage(){
    this.addMessageEvent.emit(
      new Message(1,this.subject.nativeElement.value,this.msgText.nativeElement.value,this.currentSender));
  }

  onClear(){
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = ''
  }
}
