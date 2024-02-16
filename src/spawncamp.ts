type Selector = Parameters<typeof window.document.querySelector>[0]
type Resolver<T = Element> = (element: T) => void

const awaitedElements = new Map<Selector, Resolver>()
const onArrival = new Map<Selector, Resolver>()

const observer = new MutationObserver((mutations) => {
  let lastArrived: Element | undefined

  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node instanceof HTMLElement) {
        for (const [selector, resolve] of awaitedElements) {
          const element = node.querySelector(selector)

          if (element) {
            resolve(element)
            awaitedElements.delete(selector)
          }
        }

        for (const [selector, resolve] of onArrival) {
          const element = node.querySelector(selector)
          const isSame = lastArrived && element?.isEqualNode(lastArrived)

          if (element && !isSame) {
            lastArrived = element
            resolve(element)
          }
        }
      }
    }
  }
})

export const awaitElement = <T = Element>(selector: Selector) => {
  if (awaitedElements.has(selector)) {
    return Promise.resolve(awaitedElements.get(selector) as T)
  }

  const element = document.querySelector(selector)
  if (element) return Promise.resolve(element as T)

  const promise = new Promise<T>((resolve) => {
    awaitedElements.set(selector, resolve as Resolver<Element>)
  })

  return promise
}

export const onElementArrival = <T extends Element>(
  selector: Selector,
  callback: Resolver<T>
) => {
  onArrival.set(selector, callback as Resolver<Element>)

  return () => onArrival.delete(selector)
}

observer.observe(document, {
  childList: true,
  subtree: true,
})
