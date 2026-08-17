import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  getItem<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
