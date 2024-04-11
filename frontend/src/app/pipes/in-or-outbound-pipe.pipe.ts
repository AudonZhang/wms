import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inOrOutboundPipe',
})
export class InOrOutboundPipePipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'Inbound') {
      return '入库';
    } else if (value === 'Outbound') {
      return '出库';
    } else {
      return value;
    }
  }
}
