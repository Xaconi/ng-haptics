import { Component, OnInit, ViewChild, ElementRef, input, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  template: `
    <div class="flex flex-col items-center gap-3">
      <canvas #canvas class="rounded-xl" [style.width.px]="size()" [style.height.px]="size()"></canvas>
      <p class="text-xs text-zinc-500 text-center max-w-[160px]">
        Open on mobile to test haptics
      </p>
    </div>
  `,
})
export class QrCodeComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly url = input<string>('');
  readonly size = input<number>(160);

  private readonly platformId = inject(PLATFORM_ID);

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const targetUrl = this.url() || window.location.href;

    try {
      const QRCode = await import('qrcode');
      await QRCode.toCanvas(this.canvasRef.nativeElement, targetUrl, {
        width: this.size(),
        margin: 2,
        color: {
          dark: '#f4f4f5',
          light: '#09090b',
        },
      });
    } catch (e) {
      console.error('[ng-haptics demo] QR generation failed', e);
    }
  }
}
