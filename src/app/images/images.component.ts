import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { readFile } from './utils/read-file';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent {
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

  public download() {}

  public handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement | null)?.files?.[0];

    this.file$.next(file ?? null);
  }
}
