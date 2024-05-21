import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileToImage',
})
export class FileToImagePipe implements PipeTransform {
  private reader = new FileReader();

  constructor() {}

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
