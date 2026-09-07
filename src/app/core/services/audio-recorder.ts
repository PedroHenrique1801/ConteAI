import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioRecorder {
  private mediaRecorder?: MediaRecorder;
  private mediaStream?: MediaStream;
  private audioChunks: Blob[] = [];

  async start(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Este navegador não permite acessar o microfone.');
    }

    if (!('MediaRecorder' in window)) {
      throw new Error('Este navegador não permite gravar áudio.');
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mimeType = this.findSupportedMimeType();

    this.mediaRecorder = mimeType
      ? new MediaRecorder(this.mediaStream, { mimeType })
      : new MediaRecorder(this.mediaStream);

    this.audioChunks = [];

    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    });

    this.mediaRecorder.start();
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const recorder = this.mediaRecorder;

      if (!recorder || recorder.state !== 'recording') {
        reject(new Error('Não existe uma gravação em andamento.'));
        return;
      }

      recorder.addEventListener(
        'stop',
        () => {
          const audioBlob = new Blob(this.audioChunks, {
            type: recorder.mimeType || 'audio/webm',
          });

          this.releaseResources();
          resolve(audioBlob);
        },
        { once: true },
      );

      recorder.addEventListener(
        'error',
        () => {
          this.releaseResources();
          reject(new Error('Ocorreu um erro durante a gravação.'));
        },
        { once: true },
      );

      recorder.stop();
    });
  }

  cancel(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
    }

    this.releaseResources();
  }

  private findSupportedMimeType(): string | undefined {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    return types.find((type) => MediaRecorder.isTypeSupported(type));
  }

  private releaseResources(): void {
    this.mediaStream?.getTracks().forEach((track) => track.stop());

    this.mediaStream = undefined;
    this.mediaRecorder = undefined;
    this.audioChunks = [];
  }
}