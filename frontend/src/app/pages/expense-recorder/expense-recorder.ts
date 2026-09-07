import {
  Component,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AudioRecorder } from '../../core/services/audio-recorder';
import { TransactionApi } from '../../core/services/transaction-api';

type RecorderState =
  | 'ready'
  | 'requesting'
  | 'recording'
  | 'processing'
  | 'error';

@Component({
  selector: 'app-expense-recorder',
  imports: [RouterLink],
  templateUrl: './expense-recorder.html',
  styleUrl: './expense-recorder.scss',
})
export class ExpenseRecorder implements OnDestroy {
  private readonly router = inject(Router);
  private readonly audioRecorder = inject(AudioRecorder);
  private readonly transactionApi = inject(TransactionApi);

  readonly state = signal<RecorderState>('ready');
  readonly errorMessage = signal('');

  async handleRecordAction(): Promise<void> {
    if (
      this.state() === 'requesting' ||
      this.state() === 'processing'
    ) {
      return;
    }

    if (this.state() === 'error') {
      this.state.set('ready');
      this.errorMessage.set('');
    }

    if (this.state() === 'ready') {
      await this.startRecording();
      return;
    }

    if (this.state() === 'recording') {
      await this.finishRecording();
    }
  }

  private async startRecording(): Promise<void> {
    this.state.set('requesting');
    this.errorMessage.set('');

    try {
      await this.audioRecorder.start();
      this.state.set('recording');
    } catch (error) {
      this.handleRecordingError(error);
    }
  }

  private async finishRecording(): Promise<void> {
    this.state.set('processing');
    this.errorMessage.set('');

    try {
      const audioBlob = await this.audioRecorder.stop();

      console.info('Enviando áudio para a API:', {
        type: audioBlob.type,
        size: audioBlob.size,
      });

      await firstValueFrom(
        this.transactionApi.registerFromAudio(audioBlob),
      );

      await this.router.navigate(['/despesa-registrada']);
    } catch (error) {
      console.error('Erro ao registrar despesa:', error);

      this.state.set('error');
      this.errorMessage.set(
        'Não foi possível registrar a despesa. Verifique se a API está funcionando.',
      );
    }
  }

  private handleRecordingError(error: unknown): void {
    this.state.set('error');

    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
        case 'SecurityError':
          this.errorMessage.set(
            'A permissão para usar o microfone foi negada.',
          );
          return;

        case 'NotFoundError':
          this.errorMessage.set(
            'Nenhum microfone foi encontrado neste dispositivo.',
          );
          return;

        case 'NotReadableError':
          this.errorMessage.set(
            'O microfone está sendo utilizado por outro aplicativo.',
          );
          return;
      }
    }

    this.errorMessage.set(
      error instanceof Error
        ? error.message
        : 'Não foi possível iniciar a gravação.',
    );
  }

  get statusTitle(): string {
    switch (this.state()) {
      case 'requesting':
        return 'Aguardando permissão...';

      case 'recording':
        return 'Gravando áudio...';

      case 'processing':
        return 'Processando...';

      case 'error':
        return 'Não foi possível gravar';

      default:
        return 'Iniciar gravação';
    }
  }

  get statusDescription(): string {
    switch (this.state()) {
      case 'requesting':
        return 'Autorize o uso do microfone no navegador.';

      case 'processing':
        return 'Processando seu áudio, aguarde...';

      case 'error':
        return this.errorMessage();

      default:
        return 'Exemplo: “Gastei R$ 100 no mercado hoje.”';
    }
  }

  get recordButtonLabel(): string {
    switch (this.state()) {
      case 'requesting':
        return 'Aguardando autorização do microfone';

      case 'recording':
        return 'Encerrar gravação';

      case 'processing':
        return 'Áudio em processamento';

      case 'error':
        return 'Tentar gravar novamente';

      default:
        return 'Iniciar gravação';
    }
  }

  ngOnDestroy(): void {
    this.audioRecorder.cancel();
  }
}