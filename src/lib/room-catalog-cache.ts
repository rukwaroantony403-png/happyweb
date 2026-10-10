"use client";

import { useSyncExternalStore } from "react";
import type { PublishedRoom } from "@/lib/booking-system";

const storageKey = "happyland.public-rooms.v1";
const cacheTtlMs = 30_000;

let snapshot: PublishedRoom[] | null = null;
let expiresAt = 0;
let storageRead = false;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function readStorage() {
  if (storageRead || typeof window === "undefined") return;
  storageRead = true;
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(storageKey) || "null") as { expiresAt?: unknown; rooms?: unknown } | null;
    if (saved && typeof saved.expiresAt === "number" && saved.expiresAt > Date.now() &&
        Array.isArray(saved.rooms) && saved.rooms.every((room) => room && typeof room.slug === "string" && typeof room.name === "string")) {
      snapshot = saved.rooms as PublishedRoom[];
      expiresAt = saved.expiresAt;
    }
  } catch {
    snapshot = null;
  }
}

export function getRoomCatalogSnapshot() {
  readStorage();
  if (expiresAt <= Date.now()) {
    snapshot = null;
    expiresAt = 0;
  }
  return snapshot;
}

export function hasFreshRoomCatalog() {
  return getRoomCatalogSnapshot() !== null;
}

export function publishRoomCatalog(rooms: PublishedRoom[]) {
  snapshot = rooms;
  expiresAt = Date.now() + cacheTtlMs;
  storageRead = true;
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify({ expiresAt, rooms }));
  } catch {
    // Keep the in-memory catalog available when browser storage is disabled.
  }
  notify();
}

export function useRoomCatalog() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getRoomCatalogSnapshot,
    () => null,
  );
}
