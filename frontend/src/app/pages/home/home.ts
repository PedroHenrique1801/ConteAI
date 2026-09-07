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
  selector: 'app-home',
  imports: [RouterLink, Brand],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly transactionApi = inject(TransactionApi);

  private readonly monthlyBudget = 150000;

  readonly monthlyTotal = signal(0);
  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal('');

  async ngOnInit(): Promise<void> {
  try {
    const [
      monthlyTotal,
      transactions,
      latestTransaction,
    ] = await Promise.all([
      firstValueFrom(
        this.transactionApi.getMonthlyTotal(),
      ),
      firstValueFrom(
        this.transactionApi.getAllTransactions(),
      ),
      firstValueFrom(
        this.transactionApi.getLatest(),
      ),
    ]);

    const previewTransactions = [
      latestTransaction,
      ...transactions.filter(
        (transaction) =>
          transaction.id !== latestTransaction.id,
      ),
    ].slice(0, 3);

    this.monthlyTotal.set(monthlyTotal);
    this.transactions.set(previewTransactions);
  } catch (error) {
    console.error(
      'Erro ao carregar a página inicial:',
      error,
    );

    this.loadError.set(
      'Não foi possível carregar seus gastos.',
    );
  } finally {
    this.loading.set(false);
  }
}

  get remainingBudget(): number {
    return this.monthlyBudget - this.monthlyTotal();
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

    formatDate(createdAt: string): string {
    const transactionDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (this.isSameDay(transactionDate, today)) {
      return 'Hoje';
    }

    if (this.isSameDay(transactionDate, yesterday)) {
      return 'Ontem';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
      .format(transactionDate)
      .replace('.', '');
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

  formatCurrency(amountInCents: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amountInCents / 100);
  }
}