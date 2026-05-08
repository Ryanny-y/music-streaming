const MOCK_DELAY_MS = 120

export async function mockResolve<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(data)), MOCK_DELAY_MS)
  })
}

export async function mockMutate<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), MOCK_DELAY_MS)
  })
}
