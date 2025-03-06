import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWord'
})
export class TruncateWordPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!value) return '';
    if (value.length <= limit) return value;

    return value.substring(0, limit) + '...';
  }
}
