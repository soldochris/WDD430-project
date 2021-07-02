import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[]=[];
  messagesChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();
  maxMessageId: number;
  
  constructor(private http: HttpClient) {
    this.initMessages();
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  initMessages(): void {
    this
    .http
    .get<{message: string, messages: Message[]}>('http://localhost:3000/messages')
    .subscribe((response: any) => {
      this.messages = response.messages;
      this.maxMessageId = this.getMaxId();
      this.messages.sort(
        (lhs: Message, rhs: Message)=>{
          if (lhs.id < rhs.id) {
            return -1;
          } else if (lhs.id === rhs.id) {
            return 0;
          } else {
            return 1;
          }
        }
      );
      this.messagesChangedEvent.next(this.messages.slice());
    }, (err: any) => {
      console.error(err);
    });
  }
  
  getMessage(id: string): Message {
    if (!this.messages) {
      return null;
    }

    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }

    return null;
  }

  addMessage(message: Message): void {
    if (!message) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    message.id = '';

    this.http
    .post<{message: string, newMessage: Message}>('http://localhost:3000/messages', message, {headers: headers})
    .subscribe((response: any) => {
      this.messages.push(response.newMessage);
      this.messages.sort(
        (lhs: Message, rhs: Message)=>{
          if (lhs.id < rhs.id) {
            return -1;
          } else if (lhs.id === rhs.id) {
            return 0;
          } else {
            return 1;
          }
        }
      );
      this.messagesChangedEvent.next(this.messages.slice());
    });
  }

  getMaxId(): number {
    let maxID = 0;
    for (let message of this.messages) {
      let currentID = +message.id;
      if (currentID > maxID) {
        maxID = currentID;
      }
    }
    return maxID;
  }

  storeMessages(): void {
    let json = JSON.stringify(this.messages);
    let header = new HttpHeaders();
    header.set('Content-Type', 'application/json');
    this
    .http
    .put<{message: string}>('http://localhost:3000/messages', json, {
      headers: header
    }).subscribe(() => {
      this.messagesChangedEvent.next(this.messages.slice());
    });
  }

}
