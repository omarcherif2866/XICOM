import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countChecked',
  pure: false
})
export class CountCheckedPipe implements PipeTransform {
  transform(details: { title: string; checked: boolean }[]): number {
    return details?.filter(d => d.checked).length || 0;
  }
}