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
  TransactionApi,
  TransactionCategory,
} from '../../core/services/transaction-api';

interface ExpenseCategory {
  category: TransactionCategory;
  name: string;
  percentage: number;
  amount: number;
  color: string;
  dashLength: number;
  dashOffset: number;
}

@Component({
  selector: 'app-analysis',
  imports: [RouterLink, Brand],
  templateUrl: './analysis.html',
  styleUrl: './analysis.scss',
})
export class Analysis implements OnInit {
  private readonly transactionApi = inject(TransactionApi);

  readonly totalSpent = signal(0);
  readonly categories = signal<ExpenseCategory[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal('');

  async ngOnInit(): Promise<void> {
    try {
      const [food, transport, pharmacy] = await Promise.all([
        firstValueFrom(
          this.transactionApi.getCategorySum('GROCERIES'),
        ),
        firstValueFrom(
          this.transactionApi.getCategorySum('AUTO'),
        ),
        firstValueFrom(
          this.transactionApi.getCategorySum('PHARMA'),
        ),
      ]);

      const totals: Record<TransactionCategory, number> = {
        GROCERIES: food.totalAmount,
        AUTO: transport.totalAmount,
        PHARMA: pharmacy.totalAmount,
      };

      const total =
        totals.GROCERIES +
        totals.AUTO +
        totals.PHARMA;

      this.totalSpent.set(total);
      this.categories.set(
        this.buildCategories(totals, total),
      );
    } catch (error) {
      console.error(
        'Erro ao carregar a análise:',
        error,
      );

      this.loadError.set(
        'Não foi possível carregar a análise dos gastos.',
      );
    } finally {
      this.loading.set(false);
    }
  }


  formatCurrency(amountInCents: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amountInCents / 100);
  }

  private buildCategories(
    totals: Record<TransactionCategory, number>,
    total: number,
  ): ExpenseCategory[] {
    const configurations = [
      {
        category: 'GROCERIES' as const,
        name: 'Alimentação',
        color: '#E87972',
      },
      {
        category: 'AUTO' as const,
        name: 'Transporte',
        color: '#D9A441',
      },
      {
        category: 'PHARMA' as const,
        name: 'Farmácia',
        color: '#554466',
      },
    ];

    const layoutOrder: TransactionCategory[] = [
      'PHARMA',
      'GROCERIES',
      'AUTO',
    ];

    const positions = new Map<
      TransactionCategory,
      {
        dashLength: number;
        dashOffset: number;
      }
    >();

    let accumulatedPercentage = 0;

    for (const category of layoutOrder) {
      const exactPercentage =
        total > 0
          ? (totals[category] / total) * 100
          : 0;

      const gap =
  exactPercentage > 0
    ? Math.min(6.5, exactPercentage)
    : 0;

      positions.set(category, {
        dashLength: Math.max(exactPercentage - gap, 0),
        dashOffset: -(accumulatedPercentage + gap / 2),
      });

      accumulatedPercentage += exactPercentage;
    }

    return configurations.map((configuration) => {
      const amount = totals[configuration.category];
      const position = positions.get(
        configuration.category,
      )!;

      return {
        ...configuration,
        amount,
        percentage:
          total > 0
            ? Math.round((amount / total) * 100)
            : 0,
        ...position,
      };
    });
  }
}