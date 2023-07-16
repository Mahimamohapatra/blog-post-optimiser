import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Message {
  sender: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Message[] = [];
  blogTitle = '';

  constructor(private http: HttpClient) { }

  generateBlogPost(): void {
    if (this.blogTitle.trim() !== '') {
      this.messages.push({ sender: 'User', content: this.blogTitle });
      this.http.post<any>('http://localhost:3000/api/generate-blog', { title: this.blogTitle }).subscribe(response => {
        const chatBotResponse: Message = {
          sender: 'ChatBot',
          content: `
            <b>Keywords:</b> ${response.keywords.join(', ')}<br><br>
            <b>Content Analysis:-</b> <br>
            <b>Keyword Density</b> = ${response.contentAnalysis.keywordDensity} <br>
            <b>Readability</b> = ${response.contentAnalysis.readability} <br>
            <b>Word Count</b> = ${response.contentAnalysis.wordCount} <br><br>
            <b>Recommendation for Optimized Content:</b> ${response.optimizedContent.join(', ')}
          `
        };
        this.messages.push(chatBotResponse);
      }, error => {
        console.error('Error generating the blog post:', error);
      });
      this.blogTitle = '';
    }
  }
}
