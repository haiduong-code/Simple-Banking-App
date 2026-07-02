import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { getMyAccount } from '../api/accounts';

function formatMoney(value: string): string {
  const [whole, decimal = ''] = value.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const significantDecimal = decimal.replace(/0+$/, '');
  return significantDecimal ? `${grouped},${significantDecimal}` : grouped;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Gọi API lấy dữ liệu thẻ ngân hàng (Số dư)
  const {
    data: account,
    isLoading: accountLoading,
    isError: accountError,
  } = useQuery({
    queryKey: ['my-account'],
    queryFn: getMyAccount,
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
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* --- KHU VỰC THẺ NGÂN HÀNG (MỚI) --- */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-sm font-semibold opacity-80 mb-6">THẺ GIAO DỊCH</h2>

          {accountLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-white/30 rounded w-1/4"></div>
            </div>
          ) : accountError ? (
            <p className="text-red-200 text-sm">Không tải được thông tin tài khoản.</p>
          ) : account ? (
            <div>
              <div className="text-3xl font-bold tracking-widest mb-2 font-mono">
                {account.accountNumber.replace(/(.{4})/g, '$1 ').trim()}
              </div>
              <div className="mt-8 flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-70 mb-1">SỐ DƯ KHẢ DỤNG</div>
                  <div className="text-2xl font-bold">
                    {formatMoney(account.balance)}{' '}
                    <span className="text-lg">{account.currency}</span>
                  </div>
                </div>
                <div className="uppercase opacity-90 font-medium tracking-wider">
                  {user?.fullName}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {/* --------------------------------- */}

        {/* Khu vực thông tin cá nhân cũ */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Thông tin hồ sơ</h2>

          {user && (
            <dl className="grid grid-cols-3 gap-y-3 text-sm">
              <dt className="text-slate-500">Họ tên</dt>
              <dd className="col-span-2 font-medium text-slate-800">{user.fullName}</dd>

              <dt className="text-slate-500">Email</dt>
              <dd className="col-span-2 font-medium text-slate-800">{user.email}</dd>

              <dt className="text-slate-500">Vai trò</dt>
              <dd className="col-span-2 font-medium text-slate-800">{user.role}</dd>
            </dl>
          )}
        </div>
      </main>
    </div>
  );
}
