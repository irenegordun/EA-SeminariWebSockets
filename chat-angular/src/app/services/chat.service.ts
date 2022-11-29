import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { ChatComponent } from '../component/chat/chat.component';

@Injectable({
  providedIn: 'root'
})


export class ChatService {

  chats: { text: string; messageType: number; }[] = [];


  constructor(private socket:SocketService) {
    this.onReceiveMessage();
  }

  sendMessage(messageInfo: { text: string; messageType: number; }){
    this.chats.push(messageInfo);
    this.socket.io.emit("sendMessage",messageInfo);
  }

  onReceiveMessage(){
    this.socket.io.on("receiveMessage", (messageInfo: { text: string; messageType: number; })=>{
      messageInfo.messageType=2;
      this.chats.push(messageInfo);
    }) 
  }
}
