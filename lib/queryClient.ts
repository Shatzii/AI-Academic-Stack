import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any
) {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`${response.status}: ${errorText}`)
  }

  return response
}

export function getQueryFn(options: { on401?: "returnNull" } = {}) {
  return async ({ queryKey }: { queryKey: readonly unknown[] }) => {
    try {
      const response = await apiRequest("GET", queryKey[0] as string)
      return response.json()
    } catch (error: any) {
      if (error.message.includes("401") && options.on401 === "returnNull") {
        return null
      }
      throw error
    }
  }
}