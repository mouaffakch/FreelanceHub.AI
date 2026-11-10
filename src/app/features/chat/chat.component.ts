import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MessageService, Message } from '../../core/services/message.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  otherUserId!: number;
  otherUser: User | null = null;
  currentUserId!: number;
  currentUserName = '';
  currentUserRole = '';

  messages: Message[] = [];
  newMessage = '';

  loading = true;
  sending = false;
  error = '';
  autoRefresh: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      this.currentUserId = user.userId;
      this.currentUserName = user.fullName || 'Moi';
      this.currentUserRole = user.roleName || '';
    } else {
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe(params => {
      this.otherUserId = +params['userId'];
      if (this.otherUserId) {
        this.loadOtherUser();
        this.loadConversation();

        this.autoRefresh = setInterval(() => {
          this.loadConversation(false);
        }, 4000);
      }
    });
  }

  ngOnDestroy() {
    if (this.autoRefresh) {
      clearInterval(this.autoRefresh);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadOtherUser() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.otherUser = users.find(u => u.id === this.otherUserId) || null;
      },
      error: () => {
        this.otherUser = {
          id: this.otherUserId,
          firstname: 'Utilisateur',
          lastname: `#${this.otherUserId}`,
          email: '',
          roleName: 'USER'
        };
      }
    });
  }

  loadConversation(showLoading = true) {
    if (showLoading) this.loading = true;

    this.messageService.getConversation(this.otherUserId).subscribe({
      next: (msgs) => {
        this.messages = msgs || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  sendMessage() {
    const content = this.newMessage.trim();
    if (!content || this.sending) return;

    this.sending = true;
    this.error = '';
    this.newMessage = '';

    this.messageService.sendMessage({
      content,
      receiverId: this.otherUserId
    }).subscribe({
      next: (msg) => {
        this.messages.push({
          ...msg,
          senderId: this.currentUserId,
          senderName: this.currentUserName,
          content,
          createdAt: new Date().toISOString()
        });
        this.sending = false;
        this.scrollToBottom();
      },
      error: (err) => {
        this.sending = false;
        this.error = err?.error?.message || 'Impossible d\'envoyer le message.';
        this.newMessage = content;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isMine(msg: Message): boolean {
    return msg.senderId === this.currentUserId;
  }

  getOtherName(): string {
    if (!this.otherUser) return 'Contact';
    return `${this.otherUser.firstname || ''} ${this.otherUser.lastname || ''}`.trim() || `User #${this.otherUserId}`;
  }

  getOtherInitial(): string {
    return this.otherUser?.firstname?.charAt(0)?.toUpperCase() || 'U';
  }

  getRoleLabel(role?: string): string {
    if (!role) return 'Membre';
    return role.replace('ROLE_', '');
  }

  goBack() {
    if (this.currentUserRole.includes('CLIENT')) {
      this.router.navigate(['/dashboard/client']);
    } else if (this.currentUserRole.includes('FREELANCE')) {
      this.router.navigate(['/dashboard/freelance']);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  private scrollToBottom() {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }
}
