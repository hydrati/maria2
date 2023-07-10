export type MaybePromise<T> = T | PromiseLike<T>

export interface Disposable<T = void> {
  dispose(): T
}

export type TrimStart<T, U extends string> = T extends `${U}${infer P}` ? P : T
