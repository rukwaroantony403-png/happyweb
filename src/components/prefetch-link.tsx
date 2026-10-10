"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrefetchLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);
  return <Link href={href} className={className} onPointerEnter={prefetch} onFocus={prefetch}>{children}</Link>;
}
