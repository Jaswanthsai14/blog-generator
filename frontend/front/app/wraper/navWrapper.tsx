"use client"

import { usePathname } from "next/navigation"
import Navbar from "../navbar/page"

export default function NavbarWrapper() {
  const pathname = usePathname()

  const hideNavbar = pathname === "/logiin" || pathname === "/signin"

  if (hideNavbar) return null

  return <Navbar />
}
