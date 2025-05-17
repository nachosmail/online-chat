import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  socket: any;
  username = '';
  recipient = '';
  message = '';
  chat: { from: string, message: string }[] = [];

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');

    this.socket.on('private message', (data: { from: string, message: string }) => {
      this.chat.push(data);
    });
  }

  register() {
    this.socket.emit('register', this.username);
  }

  sendMessage() {
    if (this.message.trim() && this.recipient.trim()) {
      this.socket.emit('private message', {
        to: this.recipient,
        message: this.message
      });

      this.chat.push({ from: 'Yo', message: this.message });
      this.message = '';
    }
  }
}
