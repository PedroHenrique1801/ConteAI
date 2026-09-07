import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Brand } from '../../shared/brand/brand';
import { TransactionApi } from '../../core/services/transaction-api';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-assistant',
  imports: [FormsModule, RouterLink, Brand],
  templateUrl: './assistant.html',
  styleUrl: './assistant.scss',
})
export class Assistant {
  private readonly transactionApi = inject(TransactionApi);

  question = '';

  readonly isSending = signal(false);

  readonly suggestions = [
    'Quanto gastei com alimentação este mês?',
    'Onde posso economizar este mês?',
  ];

  readonly messages = signal<ChatMessage[]>([
  {
    role: 'assistant',
    text: 'Olá, Maria! Posso analisar seus gastos, comparar categorias e ajudar você a entender seu orçamento.',
  },
]);

  async sendSuggestion(suggestion: string): Promise<void> {
    if (this.isSending()) {
      return;
    }

    this.question = suggestion;
    await this.sendQuestion();
  }

  async sendQuestion(): Promise<void> {
    const submittedQuestion = this.question.trim();

    if (!submittedQuestion || this.isSending()) {
      return;
    }

    this.messages.update((messages) => [
      ...messages,
      {
        role: 'user',
        text: submittedQuestion,
      },
    ]);

    this.question = '';
    this.isSending.set(true);

    try {
      const response = await firstValueFrom(
        this.transactionApi.askAdvisor(submittedQuestion),
      );

      this.messages.update((messages) => [
        ...messages,
        {
          role: 'assistant',
          text: response.advice,
        },
      ]);
    } catch (error) {
      console.error(
        'Erro ao consultar o assistente:',
        error,
      );

      this.messages.update((messages) => [
        ...messages,
        {
          role: 'assistant',
          text: 'O assistente está temporariamente indisponível. Tente novamente.',
        },
      ]);
    } finally {
      this.isSending.set(false);
    }
  }
}