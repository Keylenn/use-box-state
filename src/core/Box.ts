type Listener = (...args: any) => void

class Box<T> {
  constructor(initialData: T) {
    this.data = initialData
  }

  data: T
  listeners = new Set<Listener>()

  get() {
    return this.data
  }

  set(nextData: T) {
    this.data = nextData
  }

  notify(...args: any[]): void {
    for (const listener of this.listeners) {
      listener(...args)
    }
  }

  add(listener: () => void) {
    this.listeners.add(listener)
  }

  remove(listener: () => void) {
    this.listeners.delete(listener)
  }
}
export default Box
