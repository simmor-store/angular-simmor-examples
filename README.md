Simmor is a simple immutable boilerplate-free framework-agnostic store. 

[https://github.com/simmor-store/simmor](https://github.com/simmor-store/simmor)

This repository is an example of how to use it with Angular.

# Install
```
npm install simmor
```
Simmor uses `rxjs` internally so it doesn't require additional packages and can be used with `async` pipe.

# Store example
Assume, we have this simple service
```ts
@Injectable({providedIn: 'root'})
export class CounterService {
  getValue() {
    return of(123).pipe(delay(300));
  }
}
```
And we want to create a store with state like this
```ts
export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0
}
```

We can define a store class. State can be modified throw `draft` field. Simmor uses [immer](https://github.com/immerjs/immer) that can update immutable state by mutating it.

```ts
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

```

Now we can use our store in a component like this

```ts
@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {

  constructor(private store: CounterStore) { }

  ngOnInit() { }

}

```
```html
<div *ngIf="store.state$ | async as state" class="counter">
  <span>{{state.value}}</span>
  <button (click)="store.increase()">+</button>
  <button (click)="store.decrease()">-</button>
  <button (click)="store.setValue(0)">Reset</button>
  <button (click)="store.setValueAsync()">Set value async</button>
</div>
```
# Middlewares
Simmor supports middlewares. Here an example of middleware that saves state to localStorage.
```ts
export function createLocalStorageMiddleware(key: string): Middleware {
  return next => action => {
    const newState = next(action)
    if (action.methodName === "constructor") {
      const savedState = localStorage.getItem(key)
      if (savedState) {
        return JSON.parse(savedState)
      }
    }
    localStorage.setItem(key, JSON.stringify(newState))
    return newState
  }
}

```

We can pass middlewares in the constructor of the store and our component can now save its state between sessions.

```ts
@Injectable({providedIn: 'root'})
export class CounterStore extends ReducerStore<CounterState> {
  constructor(private counterService: CounterService) {
    super(initialState, {
      middlewares: [createLocalStorageMiddleware('counter')]
    });
  }
}
```
