import {Middleware} from 'simmor';

export function createLocalStorageMiddleware(name: string): Middleware {
  return next => action => {
    const result = next(action)
    if (action.methodName === 'constructor') {
      const savedState = localStorage.getItem(name)
      if (savedState) {
        action.context.rxState.setState(JSON.parse(savedState));
      }
    }
    localStorage.setItem(name, JSON.stringify(action.context.rxState.state))
    return result;
  };
}
