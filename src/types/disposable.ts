export interface Disposable<T = void> {
  dispose: () => T
}
