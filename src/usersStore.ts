import { writable } from "svelte/store";
import type { User } from "./interfaces";

export const users = writable<User[]>([])

type GameState = "joining" | 'waiting' | 'answering' | 'voting' | 'finished';
export const gameState = writable<GameState>('joining')