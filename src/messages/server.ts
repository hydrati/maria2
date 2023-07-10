export interface Aria2ServerVersion {
  /**
   * List of enabled features. Each feature is given as a string.
   * @public
   */
  enabledFeatures: string[]

  /**
   * Version number of aria2 as a string.
   * @public
   */
  version: string
}
