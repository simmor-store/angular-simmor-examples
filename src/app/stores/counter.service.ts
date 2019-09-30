import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CounterService {
  getValue() {
    return of(123).pipe(delay(300));
  }
}
