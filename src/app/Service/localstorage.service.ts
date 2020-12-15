import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {

    constructor() { }

    get(key: string) {
        return JSON.parse(localStorage.getItem(key) || '{}') || {};
    }

    set(key: string, value: any): boolean {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    getsingel(key: string) {
        return localStorage.getItem(key);
    }

    setsingel(key: string, value: any): boolean {
        localStorage.setItem(key, value);
        return true;
    }

    removesingel(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}