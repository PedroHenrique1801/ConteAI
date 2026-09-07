import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Brand } from '../../shared/brand/brand';
import {
  Transaction,
  TransactionApi,
  TransactionCategory,
} from '../../core/services/transaction-api';

@Component({
  selector: 'app-history',
  imports: [RouterLink, Brand],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit {
  private readonly transactionApi = inject(TransactionApi);

  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal('');

  async ngOnInit(): Promise<void> {
    try {
      const transactions = await firstValueFrom(
        this.transactionApi.getAllTransactions(),
      );

      this.transactions.set(
  [...transactions].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  ),
);
    } catch (error) {
      console.error(
        'Erro ao carregar o histórico:',
        error,
      );

      this.loadError.set(
        'Não foi possível carregar seu histórico.',
      );
    } finally {
      this.loading.set(false);
    }
  }

  categoryLabel(category: TransactionCategory): string {
    switch (category) {
      case 'AUTO':
        return 'Transporte';

      case 'GROCERIES':
        return 'Alimentação';

      case 'PHARMA':
        return 'Farmácia';
    }
  }

  formatCurrency(amountInCents: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amountInCents / 100);
  }

  formatDate(createdAt: string): string {
    const transactionDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const time = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(transactionDate);

    if (this.isSameDay(transactionDate, today)) {
      return `Hoje, ${time}`;
    }

    if (this.isSameDay(transactionDate, yesterday)) {
      return `Ontem, ${time}`;
    }

    const date = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
      .format(transactionDate)
      .replace('.', '');

    return `${date}, ${time}`;
  }

  private isSameDay(
    firstDate: Date,
    secondDate: Date,
  ): boolean {
    return (
      firstDate.getDate() === secondDate.getDate() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getFullYear() === secondDate.getFullYear()
    );
  }
}