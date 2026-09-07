import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { forkJoin, map } from 'rxjs';

export type TransactionCategory =
  | 'AUTO'
  | 'GROCERIES'
  | 'PHARMA';

export interface Transaction {
  id: string;
  category: TransactionCategory;
  description: string;
  amount: number;
  createdAt: string;
}

interface CategorySumResponse {
  category: TransactionCategory;
  totalAmount: number;
}

@Service()
export class TransactionApi {
  private readonly http = inject(HttpClient);

  private readonly categories: TransactionCategory[] = [
    'AUTO',
    'GROCERIES',
    'PHARMA',
  ];

  registerFromAudio(audio: Blob) {
    const formData = new FormData();

    let extension = 'webm';

    if (audio.type.includes('ogg')) {
      extension = 'ogg';
    } else if (audio.type.includes('mp4')) {
      extension = 'm4a';
    }

    formData.append('file', audio, `gravacao.${extension}`);

    return this.http.post('/transactions/ai', formData, {
      responseType: 'blob',
    });
  }

  getLatest() {
    return this.http.get<Transaction>(
      '/transactions/latest',
    );
  }

  getCategorySum(category: TransactionCategory) {
    return this.http.get<CategorySumResponse>(
      `/transactions/sum/${category}`,
    );
  }

  getMonthlyTotal() {
    const requests = this.categories.map((category) =>
      this.getCategorySum(category),
    );

    return forkJoin(requests).pipe(
      map((responses) =>
        responses.reduce(
          (total, response) => total + response.totalAmount,
          0,
        ),
      ),
    );
  }
    getTransactions(category: TransactionCategory) {
    return this.http.get<Transaction[]>(
      `/transactions/${category}`,
    );
  }

    getAllTransactions() {
    return this.http.get<Transaction[]>(
      '/transactions',
    );
  }

    askAdvisor(question: string) {
    return this.http.post<{ advice: string }>(
      '/transactions/advisor',
      { question },
    );
  }
}