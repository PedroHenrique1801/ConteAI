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
  selector: 'app-expense-success',
  imports: [RouterLink, Brand],
  templateUrl: './expense-success.html',
  styleUrl: './expense-success.scss',
})
export class ExpenseSuccess implements OnInit {
  private readonly transactionApi = inject(TransactionApi);

  readonly transaction = signal<Transaction | null>(null);
  readonly monthlyTotal = signal(0);
  readonly loading = signal(true);
  readonly loadError = signal('');

  async ngOnInit(): Promise<void> {
    try {
      const [transaction, monthlyTotal] = await Promise.all([
        firstValueFrom(this.transactionApi.getLatest()),
        firstValueFrom(this.transactionApi.getMonthlyTotal()),
      ]);

      this.transaction.set(transaction);
      this.monthlyTotal.set(monthlyTotal);
    } catch (error) {
      console.error(
        'Erro ao carregar a despesa registrada:',
        error,
      );

      this.loadError.set(
        'Não foi possível carregar os dados da despesa.',
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
}