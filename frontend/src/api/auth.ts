import api from '../lib/api';
import type {
  AuthResult,
  LoginPayload,
  MeResult,
  RegisterPayload,
} from '../types/auth';

export async function registerApi(payload: RegisterPayload): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>('/auth/register', payload);
  return data;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>('/auth/login', payload);
  return data;
}

export async function meApi(): Promise<MeResult> {
  const { data } = await api.get<MeResult>('/auth/me');
  return data;
}
