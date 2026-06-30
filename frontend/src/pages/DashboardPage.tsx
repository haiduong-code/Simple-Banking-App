import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { meApi } from '../api/auth';
import { useAuthStore } from '../store/auth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Goi route bao ve de xac nhan JWT con hieu luc
  const { data: me, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: meApi,
  });

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">Simple Banking</h1>
          <button
            onClick={onLogout}
            className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg px-4 py-2 transition"
          >
            Dang xuat
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Thong tin tai khoan</h2>

          {isLoading && <p className="text-slate-500">Dang tai...</p>}
          {isError && <p className="text-red-600">Khong tai duoc thong tin nguoi dung.</p>}

          {user && (
            <dl className="grid grid-cols-3 gap-y-3 text-sm">
              <dt className="text-slate-500">Ho ten</dt>
              <dd className="col-span-2 font-medium text-slate-800">{user.fullName}</dd>

              <dt className="text-slate-500">Email</dt>
              <dd className="col-span-2 font-medium text-slate-800">{user.email}</dd>

              <dt className="text-slate-500">Vai tro</dt>
              <dd className="col-span-2 font-medium text-slate-800">{user.role}</dd>

              <dt className="text-slate-500">Trang thai</dt>
              <dd className="col-span-2 font-medium text-slate-800">{user.status}</dd>
            </dl>
          )}

          {me && (
            <p className="mt-4 text-xs text-emerald-600">
              JWT hop le — xac thuc qua /auth/me thanh cong.
            </p>
          )}
        </div>

        <p className="text-sm text-slate-400">
          So du &amp; chuyen khoan se duoc bo sung o Giai doan 3 va 4.
        </p>
      </main>
    </div>
  );
}
