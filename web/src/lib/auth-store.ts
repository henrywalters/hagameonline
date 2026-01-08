import { atom } from 'nanostores';
import type { User } from 'firebase/auth';

export const userStore = atom<User | null>(null);
export const loadingStore = atom<boolean>(true);