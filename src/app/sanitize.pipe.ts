import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitize',
  pure: true,
})
export class SanitizePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
