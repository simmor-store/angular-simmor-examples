import {ReducerStore} from 'simmor';
import {CounterService} from './counter.service';
import {Injectable} from '@angular/core';
import {createLocalStorageMiddleware} from './localStorageMiddleware';

export interface CounterState {
  value: number;
}
const initialState: CounterState = {
  value: 0
}

@Injectable({providedIn: 'root'})
export class CounterStore extends ReducerStore<CounterState> {

  constructor(private counterService: CounterService) {
    super(initialState, {
      middlewares: [createLocalStorageMiddleware('counter')]
    });
  }

  increase() {
    this.draft.value += 1;
  }

  decrease() {
    const newValue = this.draft.value - 1
    if (newValue >= 0) {
      this.draft.value = newValue;
    }
  }

  setValue(value: number) {
    this.draft.value = value;
  }

  setValueAsync() {
    this.counterService.getValue().subscribe(value => {
      this.setValue(value);
    });
  }
}

