import { writable } from "svelte/store";
import type { User } from "./interfaces";

export const users = writable<User[]>([])

export const allUsersReady = writable<boolean>(false)