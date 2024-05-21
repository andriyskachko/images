import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, filter, startWith, switchMap } from 'rxjs';
import { readFile } from './utils/read-file';

const css = `
.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.slide-in-from-top {
  position: absolute;
  animation: slide-top 5s linear infinite;
}

.slide-in-from-bottom {
  position: absolute;
  animation: slide-bottom 5s linear infinite;
}

@keyframes slide-top {
  0% {
    bottom: 100%;
  }
  100% {
    bottom: 0;
  }
}

@keyframes slide-bottom {
  0% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}
`;

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [css],
})
export class ImagesComponent {
  @ViewChild('img') imageElement!: ElementRef<HTMLImageElement>;
  public animations = ['slide-in-from-top', 'slide-in-from-bottom'] as const;
  public file$ = new BehaviorSubject<File | null>(null);
  public image$ = this.file$.pipe(
    filter((file): file is File => file !== null),
    switchMap((file) => readFile(file))
  );
  public form = inject(FormBuilder).group({
    image: [''],
    animation: [''],
  });
  public animation$ = this.form
    .get('animation')
    ?.valueChanges.pipe(startWith(''));

  public download(): void {
    const htmlString = `
    <style>${css}</style>
    ${this.imageElement.nativeElement.outerHTML}
    `;
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'element.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement | null)?.files?.[0];

    this.file$.next(file ?? null);
  }
}
