import api from '../lib/api';
import type { Account } from '../types/accounts';

export async function getMyAccount(): Promise<Account> {
    const { data } = await api.get<Account>('/accounts/me');
    return data;
}