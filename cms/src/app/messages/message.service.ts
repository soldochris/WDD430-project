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

  initMessages(){
    this
    .http
    .get('https://cms-ng-default-rtdb.firebaseio.com/messages.json')
    .subscribe((response: any) => {
      this.messages = response;
      this.maxMessageId = this.getMaxId();
      this.messages.sort(
        (l: Message, r: Message)=> {
          if (l.id < r.id) {
            return -1;
          } else if (l.id === r.id) {
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
  
  getMessage(id: string){
    this.messages.forEach((message) => {
      if(message.id == id){
        return message;
      }
    });
    return null;
  }

  addMessage(message: Message){
    this.messages.push(message);
    this.storeMessages();
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

  storeMessages(){
    let json = JSON.stringify(this.messages);
    let header = new HttpHeaders();
    header.set('Content-Type', 'application/json');
    this
    .http
    .put<{message: string}>('https://cms-ng-default-rtdb.firebaseio.com/messages.json', json, {
      headers: header
    }).subscribe(() => {
      this.messagesChangedEvent.next(this.messages.slice());
    });
  }
}
