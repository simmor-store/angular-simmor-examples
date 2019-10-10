import {Middleware} from "simmor"

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
