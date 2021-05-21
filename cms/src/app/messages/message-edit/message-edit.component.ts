import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef; 
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender:string ='13';
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage(){
    const msgSubject: string = this.subject.nativeElement.value;
    const msgText: string = this.msgText.nativeElement.value;
    const id: string = "1";
    let msg: Message = new Message(id, msgSubject, msgText, this.currentSender);
    this.messageService.addMessage(msg);
  }

  onClear(){
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = ''
  }
}
