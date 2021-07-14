import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatContent'
})
export class FormatContentPipe implements PipeTransform {

  transform(value: string, start : number, end: number): unknown {
    return value.substr(start, end) + '...';
  }

}
