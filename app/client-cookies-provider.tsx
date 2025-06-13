"use client"

import type React from "react"

import { CookiesProvider } from "next-client-cookies"

export function ClientCookiesProvider({ children }: { children: React.ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>
}
