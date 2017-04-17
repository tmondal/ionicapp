import { Injectable, Pipe } from '@angular/core';




@Pipe({
  name: 'feedpipe'
})
@Injectable()
export class Feedpipe {
  /*
    Takes a value and makes it lowercase.
   */
   transform(value: any, args: any[] = null): any {
      return Object.keys(value);
   }
}
