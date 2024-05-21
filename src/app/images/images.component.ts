import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, filter, map, startWith, switchMap } from 'rxjs';
import { readFile } from './utils/read-file';

const imageCss = `
img {
  position: absolute;
}

.slide-in-from-top {
  animation: slide-top 5s linear infinite;
}

.slide-in-from-bottom {
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

const containerClass = 'container';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./images.component.css'],
  styles: [imageCss],
})
export class ImagesComponent {
  @ViewChild('img') imageElement!: ElementRef<HTMLElement>;
  public animations = ['slide-in-from-top', 'slide-in-from-bottom'] as const;
  public file$ = new BehaviorSubject<File | null>(null);
  public image$ = this.file$.pipe(
    filter((file): file is File => file !== null),
    switchMap((file) => readFile(file))
  );
  public form = inject(FormBuilder).group({
    image: [''],
    animation: [''],
    container: [false],
    containerHeight: [0],
    containerWidth: [0],
    imageX: [0],
    imageY: [0],
  });
  public animation$ = this.form
    .get('animation')
    ?.valueChanges.pipe(startWith(''));
  public imageCoordinates$ = this.form.valueChanges.pipe(
    map(({ imageX, imageY }) => ({ imageX, imageY })),
    startWith({ imageX: 0, imageY: 0 })
  );

  private constructContainerStyles(): string {
    const { containerHeight, containerWidth } = this.form.value;

    return `
    .${containerClass} {
    height: ${containerHeight}px;
    width: ${containerWidth}px;
    position: relative;
    }
    `;
  }

  public download(): void {
    const { container } = this.form.value;
    let element = this.imageElement.nativeElement;
    const styles = (...styles: string[]) => {
      return `<style>${styles.join(' ')}</style>`;
    };

    if (container) {
      const container = document.createElement('div');
      container.className = containerClass;
      container.appendChild(element);

      element = container;
    }

    const htmlString = styles(
      imageCss,
      container ? this.constructContainerStyles() : ''
    ).concat(element.outerHTML);
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
