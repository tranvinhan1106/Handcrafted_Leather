import React, { useState, useEffect } from 'react';
// Sử dụng CDN esm.sh để trình duyệt có thể chạy Preview trực tiếp
import { 
    LayoutDashboard, PackageSearch, ShoppingCart, Users, Settings,
    Menu, X, Bell, Plus, ChevronLeft, Wrench, CreditCard, 
    Home, Palette, LogOut, Lock, User, Package, MapPin, Trash2, ArrowRight,
    Download, Upload, History, ClipboardList, AlertTriangle
} from 'lucide-react';

// ==========================================
// SUPABASE CONFIGURATION
// ==========================================
// BẠN HÃY ĐIỀN API KEY VÀ URL TỪ PROJECT SUPABASE CỦA BẠN VÀO ĐÂY:
const SUPABASE_URL = 'https://scbzrwkhsvzuxfasijwh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9_NH1e-N5xf9zmNplFpF-Q_3Rh8-JHV';

// ==========================================
// 1. COMPONENT: ADMIN DASHBOARD
// ==========================================
const AdminDashboard = ({ onLogout, currentUser, materials, transactions, orders, refreshData, supabaseClient, fetchError }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Tính toán thống kê từ dữ liệu thực tế
    const stats = {
        totalOrders: orders.length,
        revenue: orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0).toLocaleString('vi-VN') + ' đ',
        pendingOrders: orders.filter(o => o.status === 'pending').length
    };

    const [invTab, setInvTab] = useState('stock'); 
    
    // Trạng thái Modal Nhập/Xuất
    const [showTxModal, setShowTxModal] = useState(false);
    const [txType, setTxType] = useState('import'); 
    const [txMatId, setTxMatId] = useState('');
    const [txQty, setTxQty] = useState(1);
    const [txNote, setTxNote] = useState('');
    const [txError, setTxError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Auto select first material when modal opens
    useEffect(() => {
        if (materials.length > 0 && !txMatId) {
            setTxMatId(materials[0].id.toString());
        }
    }, [materials, txMatId]);

    const getStatusColor = (s) => {
        if(s === 'pending') return 'bg-amber-100 text-amber-700';
        if(s === 'making') return 'bg-blue-100 text-blue-700';
        return 'bg-green-100 text-green-800';
    };

    const getStatusLabel = (s) => {
        if(s === 'pending') return 'Chờ duyệt';
        if(s === 'making') return 'Đang làm';
        return 'Hoàn thành';
    };

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
        { id: 'orders', icon: ShoppingCart, label: 'Đơn hàng' },
        { id: 'inventory', icon: PackageSearch, label: 'Kho vật tư' },
    ];

    // Xử lý submit Nhập/Xuất lên Supabase
    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        if (!supabaseClient) return;
        setTxError('');
        setIsProcessing(true);

        if (txQty <= 0) {
            setTxError('Số lượng phải lớn hơn 0');
            setIsProcessing(false);
            return;
        }

        const mat = materials.find(m => m.id.toString() === txMatId);
        if (!mat) {
            setIsProcessing(false);
            return;
        }

        const currentStock = Number(mat.stock_qty || 0);

        if (txType === 'export' && txQty > currentStock) {
            setTxError(`Tồn kho không đủ! Hiện chỉ còn ${currentStock} ${mat.unit}`);
            setIsProcessing(false);
            return;
        }

        const newStock = txType === 'import' ? currentStock + Number(txQty) : currentStock - Number(txQty);

        try {
            // Update Material Stock
            const { error: matError } = await supabaseClient
                .from('materials')
                .update({ stock_qty: newStock })
                .eq('id', txMatId);

            if (matError) throw matError;

            // Create Transaction Record
            const { error: logError } = await supabaseClient
                .from('inventory_logs')
                .insert([{
                    material_id: txMatId,
                    staff_id: currentUser.id,
                    type: txType,
                    quantity: Number(txQty),
                    note: txNote || (txType === 'import' ? 'Nhập kho bổ sung' : 'Xuất kho sản xuất')
                }]);

            if (logError) throw logError;

            setShowTxModal(false);
            setTxQty(1);
            setTxNote('');
            refreshData(); 
        } catch (error) {
            setTxError('Lỗi cập nhật CSDL: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!supabaseClient) return;
        try {
            const { error } = await supabaseClient
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);
            if (error) throw error;
            refreshData();
        } catch (e) {
            console.error("Lỗi cập nhật đơn hàng", e);
        }
    };

    // --- RENDER VIEWS ---
    const renderDashboard = () => (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            {fetchError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm mb-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-red-500 w-5 h-5" />
                        <div>
                            <p className="text-sm font-bold text-red-800 tracking-tight">Lỗi kết nối Supabase</p>
                            <p className="text-xs text-red-600 mt-1">Vui lòng kiểm tra lại ANON_KEY hoặc cấu hình RLS của bảng.</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-slide-up">
                <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-stone-100">
                    <p className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest">Doanh thu</p>
                    <p className="text-lg md:text-2xl font-black text-stone-900 mt-1 md:mt-2 truncate">{stats.revenue}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-stone-100">
                    <p className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest">Đang xử lý</p>
                    <p className="text-lg md:text-2xl font-black text-stone-900 mt-1 md:mt-2">{stats.pendingOrders} <span className="text-xs md:text-sm font-bold text-stone-400">đơn</span></p>
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-100 p-4 md:p-8 shadow-sm animate-slide-up stagger-1">
                <h3 className="font-black text-stone-900 text-sm md:text-lg mb-4 md:mb-6 italic uppercase tracking-tighter">Đơn hàng gần đây</h3>
                <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0">
                    <table className="w-full text-left text-sm min-w-[600px]">
                        <thead>
                            <tr className="text-stone-400 uppercase text-[9px] md:text-[10px] font-black tracking-widest border-b border-stone-50">
                                <th className="pb-3 md:pb-4 px-2">Mã ĐH</th>
                                <th className="pb-3 md:pb-4 px-2">Khách hàng</th>
                                <th className="pb-3 md:pb-4 px-2 text-center">Trạng thái</th>
                                <th className="pb-3 md:pb-4 px-2 text-right">Tổng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {orders.slice(0, 5).map(o => (
                                <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="py-4 md:py-5 px-2 font-black text-stone-900 text-xs md:text-sm">#{o.id.toString().slice(0,8).toUpperCase()}</td>
                                    <td className="py-4 md:py-5 px-2 font-bold text-stone-600 text-xs md:text-sm">{o.profiles?.full_name || 'Khách lẻ'}</td>
                                    <td className="py-4 md:py-5 px-2 text-center">
                                        <select 
                                            value={o.status}
                                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                            className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer border border-transparent hover:border-stone-200 ${getStatusColor(o.status)}`}
                                        >
                                            <option value="pending">Chờ duyệt</option>
                                            <option value="making">Đang làm</option>
                                            <option value="completed">Hoàn thành</option>
                                        </select>
                                    </td>
                                    <td className="py-4 md:py-5 px-2 text-right font-black text-stone-900 text-xs md:text-sm">{(o.total_amount || 0).toLocaleString('vi-VN')} đ</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan="4" className="py-8 text-center text-stone-400 font-bold text-sm">Chưa có đơn hàng nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-100 p-4 md:p-8 shadow-sm animate-slide-up">
            <h3 className="font-black text-stone-900 text-sm md:text-lg mb-4 md:mb-6 italic uppercase tracking-tighter">Tất cả đơn hàng</h3>
            <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0">
                <table className="w-full text-left text-sm min-w-[700px]">
                    <thead>
                        <tr className="text-stone-400 uppercase text-[9px] md:text-[10px] font-black tracking-widest border-b border-stone-50">
                            <th className="pb-3 md:pb-4 px-2">Mã ĐH</th>
                            <th className="pb-3 md:pb-4 px-2">Ngày đặt</th>
                            <th className="pb-3 md:pb-4 px-2">Khách hàng</th>
                            <th className="pb-3 md:pb-4 px-2 text-center">Trạng thái</th>
                            <th className="pb-3 md:pb-4 px-2 text-right">Tổng</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-stone-50 transition-colors align-top">
                                <td className="py-4 md:py-5 px-2 font-black text-stone-900 text-xs md:text-sm">#{o.id.toString().slice(0,8).toUpperCase()}</td>
                                <td className="py-4 md:py-5 px-2 text-stone-500 text-[10px] md:text-xs font-bold">{new Date(o.created_at || Date.now()).toLocaleDateString('vi-VN')}</td>
                                <td className="py-4 md:py-5 px-2 font-bold text-stone-600 text-xs md:text-sm">{o.profiles?.full_name || 'Khách lẻ'}</td>
                                <td className="py-4 md:py-5 px-2 text-center">
                                    <select 
                                        value={o.status}
                                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                        className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer border border-transparent hover:border-stone-200 ${getStatusColor(o.status)}`}
                                    >
                                        <option value="pending">Chờ duyệt</option>
                                        <option value="making">Đang làm</option>
                                        <option value="completed">Hoàn thành</option>
                                    </select>
                                </td>
                                <td className="py-4 md:py-5 px-2 text-right font-black text-stone-900 text-xs md:text-sm">{(o.total_amount || 0).toLocaleString('vi-VN')} đ</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan="5" className="py-8 text-center text-stone-400 font-bold text-sm">Chưa có đơn hàng nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderInventory = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up">
                <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tighter uppercase italic">Kho Vật Tư</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={() => { setTxType('import'); setShowTxModal(true); }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
                    >
                        <Download size={16} /> Nhập kho
                    </button>
                    <button 
                        onClick={() => { setTxType('export'); setShowTxModal(true); }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-200 text-stone-900 px-4 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-stone-300 transition-colors"
                    >
                        <Upload size={16} /> Xuất kho
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-stone-100 animate-slide-up stagger-1">
                <button 
                    onClick={() => setInvTab('stock')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${invTab === 'stock' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-900'}`}
                >
                    <ClipboardList size={14} /> Tồn kho
                </button>
                <button 
                    onClick={() => setInvTab('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${invTab === 'history' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-900'}`}
                >
                    <History size={14} /> Lịch sử
                </button>
            </div>

            {/* Content Kho */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-100 p-4 md:p-8 shadow-sm animate-slide-up stagger-2">
                {invTab === 'stock' && (
                    <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0 animate-fade-in">
                        <table className="w-full text-left text-sm min-w-[600px]">
                            <thead>
                                <tr className="text-stone-400 uppercase text-[9px] md:text-[10px] font-black tracking-widest border-b border-stone-50">
                                    <th className="pb-3 md:pb-4 px-2">Tên Vật Tư</th>
                                    <th className="pb-3 md:pb-4 px-2">Phân Loại</th>
                                    <th className="pb-3 md:pb-4 px-2 text-right">Tồn Kho</th>
                                    <th className="pb-3 md:pb-4 px-2 text-center">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {materials.map(m => (
                                    <tr key={m.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="py-4 md:py-5 px-2">
                                            <div className="flex items-center gap-3">
                                                {/* Hiển thị hình ảnh thu nhỏ nếu có */}
                                                {m.image_url ? (
                                                    <img src={m.image_url} alt={m.name} className="w-10 h-10 rounded-xl object-cover border border-stone-200" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center">
                                                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: m.color_code || '#ccc' }}></div>
                                                    </div>
                                                )}
                                                <span className="font-bold text-stone-900 text-xs md:text-sm">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-5 px-2">
                                            <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-[9px] font-bold uppercase">{m.type || 'Chung'}</span>
                                        </td>
                                        <td className="py-4 md:py-5 px-2 text-right">
                                            <span className="font-black text-stone-900 text-sm md:text-base">{m.stock_qty}</span>
                                            <span className="text-[10px] font-bold text-stone-500 ml-1">{m.unit}</span>
                                        </td>
                                        <td className="py-4 md:py-5 px-2 text-center">
                                            {Number(m.stock_qty) < 5 ? (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Sắp hết</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Ổn định</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {invTab === 'history' && (
                    <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0 animate-fade-in">
                        <table className="w-full text-left text-sm min-w-[700px]">
                            <thead>
                                <tr className="text-stone-400 uppercase text-[9px] md:text-[10px] font-black tracking-widest border-b border-stone-50">
                                    <th className="pb-3 md:pb-4 px-2">Mã GD</th>
                                    <th className="pb-3 md:pb-4 px-2">Thời gian</th>
                                    <th className="pb-3 md:pb-4 px-2">Loại</th>
                                    <th className="pb-3 md:pb-4 px-2 text-right">Số lượng</th>
                                    <th className="pb-3 md:pb-4 px-2">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {transactions.map(t => (
                                    <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="py-3 md:py-4 px-2 font-black text-stone-500 text-[9px] md:text-[10px]">#{t.id}</td>
                                        <td className="py-3 md:py-4 px-2 text-stone-600 text-[10px] md:text-xs font-bold">{new Date(t.created_at || Date.now()).toLocaleDateString('vi-VN')}</td>
                                        <td className="py-3 md:py-4 px-2">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center w-fit gap-1 ${t.type === 'import' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-700'}`}>
                                                {t.type === 'import' ? <><Download size={10} /> Nhập</> : <><Upload size={10} /> Xuất</>}
                                            </span>
                                        </td>
                                        <td className={`py-3 md:py-4 px-2 text-right font-black text-sm ${t.type === 'import' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'import' ? '+' : '-'}{t.quantity}
                                        </td>
                                        <td className="py-3 md:py-4 px-2 text-stone-500 text-[10px] md:text-xs max-w-[150px] truncate" title={t.note}>{t.note}</td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr><td colSpan="5" className="py-8 text-center text-stone-400 font-bold text-sm">Chưa có giao dịch nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-stone-50 font-sans selection:bg-stone-200 relative overflow-hidden animate-fade-in">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 md:p-8 border-b border-stone-800 flex justify-between items-center shrink-0">
                    <span className="font-extrabold text-lg md:text-xl tracking-tight">H.MADE <span className="text-stone-400">ADMIN</span></span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 hover:bg-stone-800 rounded-lg"><X size={20} /></button>
                </div>
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button 
                                key={item.id}
                                onClick={() => { setCurrentView(item.id); setIsSidebarOpen(false); }} 
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${currentView === item.id ? 'bg-stone-100 text-stone-900 shadow-lg' : 'text-stone-400 hover:bg-stone-800'}`}
                            >
                                <Icon size={20} /> <span className="font-bold text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-stone-800 shrink-0">
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl text-stone-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} /> <span className="font-bold text-sm">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
                <header className="h-16 md:h-20 bg-white border-b border-stone-100 flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-stone-600 hover:bg-stone-100 rounded-lg"><Menu size={20} /></button>
                        <div className="font-extrabold text-stone-900 uppercase text-[10px] md:text-xs tracking-[0.2em] hidden sm:block">Hệ thống quản lý Artisan</div>
                        <div className="font-extrabold text-stone-900 uppercase text-[10px] tracking-[0.2em] sm:hidden">Admin</div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <button className="p-2 text-stone-400 hover:bg-stone-50 rounded-full relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] md:text-xs font-bold text-stone-600 hidden sm:block">Xin chào, {currentUser?.name}</span>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-stone-900 flex items-center justify-center text-white text-[10px] md:text-xs font-black italic shadow-md">AD</div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 w-full bg-stone-50">
                    <div className="max-w-6xl mx-auto">
                        {currentView === 'dashboard' && renderDashboard()}
                        {currentView === 'orders' && renderOrders()}
                        {currentView === 'inventory' && renderInventory()}
                    </div>
                </main>
            </div>

            {/* Modal Nhập/Xuất Kho */}
            {showTxModal && (
                <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-[2rem] p-6 md:p-8 shadow-2xl relative animate-zoom-in">
                        <button 
                            onClick={() => setShowTxModal(false)}
                            className="absolute top-6 right-6 p-2 bg-stone-100 text-stone-400 hover:text-stone-900 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6 flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${txType === 'import' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-800'}`}>
                                {txType === 'import' ? <Download size={24} /> : <Upload size={24} />}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-stone-900 uppercase">{txType === 'import' ? 'Nhập kho' : 'Xuất kho'}</h2>
                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tạo giao dịch mới</p>
                            </div>
                        </div>

                        <form onSubmit={handleTransactionSubmit} className="space-y-4">
                            {txError && (
                                <div className="p-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-xl text-center border border-red-100 animate-slide-up">
                                    ⚠️ {txError}
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-1.5 ml-1">Chọn vật tư</label>
                                <select 
                                    value={txMatId}
                                    onChange={(e) => setTxMatId(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm font-bold text-stone-700 transition-all"
                                >
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} (Tồn: {m.stock_qty} {m.unit})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-1.5 ml-1">Số lượng</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={txQty}
                                        onChange={(e) => setTxQty(e.target.value)}
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm font-black text-stone-900 transition-all"
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                                        {materials.find(m => m.id.toString() === txMatId)?.unit}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-1.5 ml-1">Ghi chú (Tùy chọn)</label>
                                <input 
                                    type="text" 
                                    value={txNote}
                                    onChange={(e) => setTxNote(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm font-medium transition-all"
                                    placeholder={txType === 'import' ? 'VD: Nhập thêm từ nhà cung cấp ABC' : 'VD: Xuất cho đơn hàng XYZ'}
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all mt-4 shadow-lg active:scale-95 ${txType === 'import' ? 'bg-stone-900 hover:bg-stone-800 text-white' : 'bg-red-600 hover:bg-red-700 text-white'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? 'ĐANG XỬ LÝ...' : `XÁC NHẬN ${txType === 'import' ? 'NHẬP' : 'XUẤT'}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 2. COMPONENT: CUSTOMER PORTAL
// ==========================================
const CustomerPortal = ({ onLoginClick, onLogout, currentUser, products, orders, materials, refreshData, supabaseClient }) => {
    const [currentView, setCurrentView] = useState('home'); 
    
    // Custom Room State
    const [customProduct, setCustomProduct] = useState(null);
    const [addKeychain, setAddKeychain] = useState(false);
    const [addNFC, setAddNFC] = useState(false);
    const [selectedLeather, setSelectedLeather] = useState(null);
    const [selectedThread, setSelectedThread] = useState(null);
    const [engraving, setEngraving] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');

    // Lọc Materials theo Type
    const leathers = materials.filter(m => m.type === 'leather');
    const threads = materials.filter(m => m.type === 'thread');

    // Cart State
    const [cart, setCart] = useState([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        if (leathers.length > 0 && !selectedLeather) setSelectedLeather(leathers[0]);
        if (threads.length > 0 && !selectedThread) setSelectedThread(threads[0]);
    }, [materials]);

    const keychainPrice = 150000;
    const nfcPrice = 80000;
    const basePrice = customProduct ? (Number(customProduct.base_price) || 0) : 0;
    const totalPrice = basePrice + (addKeychain ? keychainPrice : 0) + (addNFC ? nfcPrice : 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const categories = ['Tất cả', ...Array.from(new Set(products.map(p => p.category_id || p.category))).filter(Boolean)];

    const handleProtectedNavigation = (view) => {
        if (!currentUser) {
            onLoginClick();
        } else {
            setCurrentView(view);
        }
    };

    const handleAddToCart = () => {
        if (!currentUser) {
            onLoginClick();
            return;
        }
        
        const newItem = {
            id: Date.now(),
            product: customProduct || products[0],
            leather: selectedLeather || leathers[0],
            thread: selectedThread || threads[0],
            addons: [addKeychain ? 'Móc khóa' : null, addNFC ? 'Chip NFC' : null].filter(Boolean),
            engraving: engraving,
            price: totalPrice,
            qty: 1
        };
        
        setCart([...cart, newItem]);
        setCurrentView('cart');
    };

    const handleRemoveFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleCheckout = async () => {
        if (!currentUser || cart.length === 0 || !supabaseClient) return;
        setIsCheckingOut(true);

        try {
            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()}`;

            // 1. Tạo đơn hàng tổng
            const { data: orderResult, error: orderError } = await supabaseClient
                .from('orders')
                .insert([{
                    user_id: currentUser.id,
                    status: 'pending',
                    total_amount: cartTotal,
                    shipping_address: 'Địa chỉ mặc định khách hàng'
                }]).select();

            if (orderError) throw orderError;

            // 2. Tạo chi tiết đơn hàng (Order Items)
            const orderId = orderResult[0].id;
            const itemsToInsert = cart.map(item => ({
                order_id: orderId,
                product_id: item.product.id,
                leather_id: item.leather?.id,
                thread_id: item.thread?.id,
                engraving: item.engraving,
                quantity: item.qty,
                price: item.price
            }));

            const { error: itemsError } = await supabaseClient
                .from('order_items')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            setCart([]);
            refreshData(); 
            setCurrentView('profile');
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Lỗi khi tạo đơn hàng từ CSDL!");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const myOrders = orders.filter(o => o.user_id === currentUser?.id || o.customer_name === currentUser?.name);

    const renderStorefront = () => (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative bg-stone-900 text-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-20 overflow-hidden mb-10 md:mb-16 shadow-2xl flex flex-col md:flex-row items-center justify-between animate-slide-up">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px md:32px 32px' }}></div>
                </div>
                <div className="relative z-10 md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
                    <span className="inline-block bg-white/10 text-stone-300 text-[9px] md:text-[10px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full tracking-[0.2em] md:tracking-[0.3em] uppercase backdrop-blur-md">Bộ sưu tập 2026</span>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter uppercase">
                        ĐỒ DA <br/> <span className="text-stone-400 italic">THỦ CÔNG.</span>
                    </h1>
                    <p className="text-stone-400 text-xs sm:text-sm md:text-lg max-w-[280px] sm:max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
                        Chúng tôi không bán sản phẩm đại trà. Chúng tôi chế tác câu chuyện của riêng bạn trên từng thớ da chọn lọc.
                    </p>
                    <button 
                        onClick={() => { setCustomProduct(products[0]); setCurrentView('custom'); }}
                        className="mt-6 md:mt-4 bg-white text-stone-900 hover:bg-stone-200 px-8 py-4 md:px-10 md:py-5 rounded-[1rem] md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl w-full sm:w-auto"
                    >
                        Vào Phòng Custom
                    </button>
                </div>
                <div className="relative z-10 mt-10 md:mt-0 md:w-1/2 flex justify-center w-full">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-stone-800/40 rounded-full border-[8px] md:border-[12px] border-stone-800/50 flex items-center justify-center backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.4)]">
                        <div className="text-stone-500 font-black tracking-[0.3em] md:tracking-[0.5em] text-[8px] md:text-[10px] uppercase text-center rotate-12">H.MADE <br/> ARTISAN</div>
                    </div>
                </div>
            </section>

            {/* Filter */}
            <div className="flex space-x-3 mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 animate-slide-up stagger-1">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)}
                        className={`shrink-0 px-5 py-3 md:px-8 md:py-4 rounded-[1rem] md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-stone-900 text-white shadow-lg md:shadow-xl' : 'bg-white text-stone-400 border border-stone-100 hover:bg-stone-50'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid Sản Phẩm Thực Tế */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10 animate-slide-up stagger-2">
                {products.filter(p => activeCategory === 'Tất cả' || p.category === activeCategory || p.category_id === activeCategory).map(product => (
                    <div key={product.id} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 border border-stone-50 shadow-sm hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 group flex flex-col">
                        <div className="bg-stone-50 rounded-[1rem] md:rounded-[2rem] aspect-[4/3] flex items-center justify-center mb-4 md:mb-6 relative overflow-hidden">
                            {(product.is_hot) && <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-amber-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-1 rounded-full z-10 shadow-sm">Hot</span>}
                            {/* Hiển thị hình ảnh từ image_url của Supabase, nếu không có thì hiển thị Preview */}
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="text-stone-300 font-black text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.5em] group-hover:scale-110 transition-transform duration-700 uppercase italic text-center px-2">[Preview]</div>
                            )}
                        </div>
                        <div className="space-y-1 flex-1 flex flex-col">
                            <p className="text-stone-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest truncate">{product.category_id || 'Mặc định'}</p>
                            <h3 className="text-sm md:text-xl font-black text-stone-900 leading-tight line-clamp-2 mb-2">{product.name}</h3>
                            <div className="flex items-end md:items-center justify-between pt-2 md:pt-4 mt-auto">
                                <span className="text-sm md:text-lg font-black text-stone-900">{(product.base_price || 0).toLocaleString('vi-VN')} đ</span>
                                <button 
                                    onClick={() => {
                                        setCustomProduct(product);
                                        setCurrentView('custom');
                                    }}
                                    className="bg-stone-900 text-white p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-amber-600 transition-colors shadow-md"
                                >
                                    <Plus size={16} className="md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col-span-2 md:col-span-3 text-center py-20 text-stone-400 font-bold uppercase tracking-widest text-[10px]">
                        Đang đồng bộ sản phẩm từ Database...
                    </div>
                )}
            </div>
        </div>
    );

    const renderCustomRoom = () => (
        <div className="animate-slide-left pb-10">
            <button onClick={() => setCurrentView('home')} className="mb-6 md:mb-10 flex items-center gap-2 md:gap-3 text-stone-400 hover:text-stone-900 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all">
                <ChevronLeft size={16} className="md:w-5 md:h-5" /> Quay lại cửa hàng
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
                {/* Preview Column */}
                <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl md:shadow-2xl aspect-square flex items-center justify-center p-6 md:p-10 border border-stone-50 group overflow-hidden animate-zoom-in stagger-1">
                    <div className="absolute top-4 left-4 md:top-10 md:left-10 bg-stone-50 text-stone-400 text-[8px] md:text-[9px] font-black px-3 md:px-5 py-1.5 md:py-2 rounded-full tracking-[0.1em] md:tracking-[0.2em] uppercase z-20">Live Preview</div>
                    
                    <div className="relative w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                        {/* Wallet Main Part */}
                        <div className={`absolute w-3/4 h-1/2 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center justify-center transition-all duration-700 z-10 overflow-hidden`}
                             style={{ backgroundColor: selectedLeather?.color_code || '#8B4513' }}>
                             {/* Nếu vật tư có ảnh texture, có thể render vào đây */}
                             {selectedLeather?.image_url && <img src={selectedLeather.image_url} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="" />}
                            <div className="relative z-10 text-white/40 font-black tracking-[0.3em] md:tracking-[0.6em] text-[10px] md:text-xs italic uppercase text-center px-4 mix-blend-difference drop-shadow-md">
                                {engraving || 'H.MADE STUDIO'}
                            </div>
                        </div>

                        {/* Thread detail simulation */}
                        {selectedThread && (
                            <div className="absolute w-[70%] h-[45%] rounded-[1.2rem] md:rounded-[1.7rem] border-[3px] border-dashed z-15 pointer-events-none opacity-50"
                                 style={{ borderColor: selectedThread.color_code }}>
                            </div>
                        )}

                        {/* Keychain Addon */}
                        <div className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 
                          ${addKeychain ? 'opacity-100 translate-x-[35%] md:translate-x-[45%] translate-y-[35%]' : 'opacity-0 translate-x-0 translate-y-0 pointer-events-none'}`}>
                            <div className={`w-10 h-24 md:w-14 md:h-32 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border-2 md:border-4 border-white/10 flex flex-col items-center justify-start pt-3 md:pt-4 transition-colors duration-700 overflow-hidden`}
                                 style={{ backgroundColor: selectedLeather?.color_code || '#8B4513' }}>
                                 {selectedLeather?.image_url && <img src={selectedLeather.image_url} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="" />}
                                 <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-[3px] md:border-4 border-amber-600/50 mb-2 relative z-10"></div>
                            </div>
                        </div>

                        {/* NFC Indicator */}
                        {addNFC && (
                            <div className="absolute w-3/4 h-1/2 rounded-[1.5rem] md:rounded-[2rem] z-20 pointer-events-none flex items-center justify-center">
                                <div className="absolute inset-0 border-2 md:border-4 border-amber-500/30 rounded-[1.5rem] md:rounded-[2rem] animate-ping"></div>
                                <span className="bg-amber-600 text-white text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1 rounded-full shadow-xl absolute -top-3 md:-top-4 tracking-widest whitespace-nowrap">NFC SMART CHIP</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Column */}
                <div className="space-y-8 md:space-y-12 animate-slide-up stagger-2">
                    <div className="space-y-2 md:space-y-4">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-stone-900 tracking-tighter uppercase">{customProduct?.name || 'Sản phẩm Custom'}</h1>
                        <p className="text-stone-500 leading-relaxed font-medium text-xs sm:text-sm md:text-base">Bản phối cá nhân hóa tối thượng. Dữ liệu vật liệu đang được tải trực tiếp từ kho.</p>
                    </div>

                    <div className="space-y-6 md:space-y-10">
                        <div className="space-y-4 md:space-y-5">
                            <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em] md:tracking-[0.3em]">1. Chọn loại Da</h3>
                            <div className="flex flex-wrap gap-3 md:gap-4">
                                {leathers.map(l => (
                                    <button 
                                        key={l.id} 
                                        onClick={() => setSelectedLeather(l)}
                                        title={l.name}
                                        className={`w-10 h-10 md:w-14 md:h-14 rounded-full transition-all duration-500 bg-cover bg-center ${selectedLeather?.id === l.id ? 'ring-2 md:ring-4 ring-offset-2 md:ring-offset-4 ring-stone-900 scale-110 shadow-lg md:shadow-xl' : 'hover:scale-105 shadow-md'}`}
                                        style={{ backgroundColor: l.color_code || '#ccc', backgroundImage: l.image_url ? `url(${l.image_url})` : 'none' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-5">
                            <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em] md:tracking-[0.3em]">2. Màu chỉ khâu</h3>
                            <div className="flex flex-wrap gap-3 md:gap-4">
                                {threads.map(t => (
                                    <button 
                                        key={t.id} 
                                        onClick={() => setSelectedThread(t)}
                                        title={t.name}
                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-500 bg-cover bg-center ${selectedThread?.id === t.id ? 'ring-2 md:ring-4 ring-offset-2 md:ring-offset-4 ring-stone-900 scale-110 shadow-lg md:shadow-xl' : 'hover:scale-105 shadow-md'}`}
                                        style={{ backgroundColor: t.color_code || '#ccc', backgroundImage: t.image_url ? `url(${t.image_url})` : 'none' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-5">
                            <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em] md:tracking-[0.3em]">3. Tùy chọn khắc tên</h3>
                            <input 
                                type="text" 
                                maxLength="15"
                                value={engraving}
                                onChange={(e) => setEngraving(e.target.value)}
                                className="w-full px-5 py-4 bg-stone-100 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm font-black text-stone-900 uppercase transition-all"
                                placeholder="TÊN KHẮC (TỐI ĐA 15 KÝ TỰ)"
                            />
                        </div>

                        <div className="space-y-4 md:space-y-5">
                            <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em] md:tracking-[0.3em]">4. Module Tiện ích</h3>
                            <div className="grid gap-3 md:gap-4">
                                <button 
                                    onClick={() => setAddKeychain(!addKeychain)}
                                    className={`flex items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border-2 transition-all ${addKeychain ? 'border-stone-900 bg-stone-900 text-white shadow-xl' : 'border-stone-100 bg-white hover:border-stone-300 text-stone-800'}`}
                                >
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                        <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl shrink-0 ${addKeychain ? 'bg-stone-800' : 'bg-stone-50'}`}><Wrench size={18} className="md:w-5 md:h-5" /></div>
                                        <div className="text-left min-w-0 pr-2">
                                            <p className="font-black text-xs md:text-sm uppercase truncate">Móc khóa đồng bộ</p>
                                            <p className={`text-[9px] md:text-[10px] uppercase font-bold tracking-wider truncate ${addKeychain ? 'text-stone-400' : 'text-stone-400'}`}>Da & Đồng Thau</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-xs shrink-0">+150K</span>
                                </button>

                                <button 
                                    onClick={() => setAddNFC(!addNFC)}
                                    className={`flex items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border-2 transition-all ${addNFC ? 'border-amber-600 bg-amber-600 text-white shadow-xl' : 'border-stone-100 bg-white hover:border-stone-300 text-stone-800'}`}
                                >
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                        <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl shrink-0 ${addNFC ? 'bg-amber-700' : 'bg-stone-50'}`}><CreditCard size={18} className="md:w-5 md:h-5" /></div>
                                        <div className="text-left min-w-0 pr-2">
                                            <p className="font-black text-xs md:text-sm uppercase truncate">Chip NFC 1-Chạm</p>
                                            <p className={`text-[9px] md:text-[10px] uppercase font-bold tracking-wider truncate ${addNFC ? 'text-amber-200' : 'text-stone-400'}`}>Danh thiếp số</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-xs shrink-0">+80K</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 md:pt-10 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-auto text-center sm:text-left">
                            <p className="text-stone-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1">Thanh toán dự kiến</p>
                            <p className="text-2xl md:text-3xl font-black text-stone-900">{totalPrice.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="w-full sm:w-auto bg-stone-900 text-white px-8 md:px-12 py-4 md:py-5 rounded-[1rem] md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl md:shadow-2xl hover:-translate-y-1 active:scale-95"
                        >
                            Thêm Giỏ Hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCart = () => (
        <div className="animate-slide-up pb-10 max-w-4xl mx-auto">
            <button onClick={() => setCurrentView('home')} className="mb-6 md:mb-10 flex items-center gap-2 md:gap-3 text-stone-400 hover:text-stone-900 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all">
                <ChevronLeft size={16} className="md:w-5 md:h-5" /> Tiếp tục mua sắm
            </button>

            <h2 className="text-2xl md:text-4xl font-black mb-8 text-stone-900 tracking-tighter uppercase">Giỏ hàng của bạn</h2>
            
            {cart.length === 0 ? (
                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-stone-100 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-6">
                        <ShoppingCart size={32} />
                    </div>
                    <p className="text-stone-500 font-bold mb-6">Giỏ hàng đang trống.</p>
                    <button 
                        onClick={() => setCurrentView('home')}
                        className="bg-stone-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl hover:-translate-y-1"
                    >
                        Khám phá sản phẩm
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-stone-100 stagger-1">
                        {cart.map((item, index) => (
                            <div key={item.id} className={`flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center py-4 md:py-6 ${index !== cart.length - 1 ? 'border-b border-stone-100' : ''}`}>
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-stone-50 rounded-[1rem] md:rounded-[1.5rem] flex items-center justify-center shrink-0 border border-stone-200 overflow-hidden" style={{ backgroundColor: item.leather?.color_code }}>
                                    {/* Ưu tiên hiển thị ảnh sản phẩm thật từ Supabase */}
                                    {item.product?.image_url ? (
                                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package size={24} className="text-white/50 mix-blend-overlay" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1 md:space-y-2">
                                    <h3 className="font-black text-base md:text-xl text-stone-900">{item.product?.name}</h3>
                                    <p className="text-xs md:text-sm font-bold text-stone-500">Da: <span className="text-stone-800">{item.leather?.name}</span> | Chỉ: <span className="text-stone-800">{item.thread?.name}</span></p>
                                    {item.engraving && <p className="text-xs font-bold text-amber-600 uppercase">Khắc: {item.engraving}</p>}
                                    {item.addons && item.addons.length > 0 && (
                                        <p className="text-xs md:text-sm font-bold text-amber-600">
                                            Thêm: {item.addons.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-2">
                                    <p className="font-black text-lg md:text-xl text-stone-900">{(item.price * item.qty).toLocaleString('vi-VN')}đ</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">SL: {item.qty}</span>
                                        <button onClick={() => handleRemoveFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors p-2 bg-stone-50 hover:bg-red-50 rounded-full">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-stone-900 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 stagger-2">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Tổng thanh toán</p>
                            <p className="text-3xl md:text-4xl font-black">{cartTotal.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className={`w-full md:w-auto bg-white text-stone-900 px-8 md:px-12 py-4 md:py-5 rounded-[1rem] md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500 hover:text-white shadow-xl'}`}
                        >
                            {isCheckingOut ? 'ĐANG XỬ LÝ...' : <>Thanh Toán <ArrowRight size={18} /></>}
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    const renderProfile = () => (
        <div className="animate-zoom-in pb-10 max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black mb-8 text-stone-900 tracking-tighter uppercase">Tài khoản cá nhân</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* User Info Card */}
                <div className="bg-stone-900 text-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl flex flex-col items-center text-center h-fit stagger-1">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-stone-800 rounded-full flex items-center justify-center mb-4 md:mb-6 border-4 border-stone-700">
                        <User size={32} className="text-stone-400" />
                    </div>
                    <h3 className="font-black text-xl md:text-2xl mb-1">{currentUser?.name}</h3>
                    <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-widest mb-6">Thành viên thân thiết</p>
                    
                    <div className="w-full space-y-4 text-left border-t border-stone-800 pt-6">
                        <div>
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Email</p>
                            <p className="text-sm font-bold text-stone-300">khachhang@hmade.vn</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Điện thoại</p>
                            <p className="text-sm font-bold text-stone-300">090 123 4567</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onLogout}
                        className="mt-8 w-full py-3 md:py-4 rounded-xl border border-stone-700 text-stone-400 font-black text-[10px] uppercase tracking-widest hover:bg-stone-800 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} /> Đăng xuất
                    </button>
                </div>

                {/* Orders History */}
                <div className="md:col-span-2 space-y-6 stagger-2">
                    <h3 className="text-lg md:text-xl font-black text-stone-900 tracking-tight uppercase">Lịch sử chế tác (Đồng bộ DB)</h3>
                    
                    <div className="space-y-4">
                        {myOrders.map((order, i) => (
                            <div key={order.id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-sm border border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-stone-900">#{order.id.toString().slice(0,8).toUpperCase()}</p>
                                        <p className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest">{new Date(order.created_at || Date.now()).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                                    <span className={`px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider mb-0 sm:mb-2 ${order.status === 'making' ? 'bg-blue-100 text-blue-700' : order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {order.status === 'pending' ? 'Chờ duyệt' : order.status === 'making' ? 'Đang làm' : 'Hoàn thành'}
                                    </span>
                                    <p className="font-black text-stone-900 text-sm md:text-base">{(order.total_amount || 0).toLocaleString('vi-VN')} đ</p>
                                </div>
                            </div>
                        ))}
                        {myOrders.length === 0 && (
                            <div className="bg-white rounded-[1.5rem] p-10 text-center border border-stone-100 border-dashed">
                                <p className="text-stone-400 font-bold text-sm uppercase tracking-widest">Chưa có đơn hàng nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-4 pb-28 sm:p-6 sm:pb-32 md:p-12 md:pb-12 selection:bg-stone-200 overflow-x-hidden relative animate-fade-in">
            {/* Nav */}
            <header className="max-w-7xl mx-auto mb-8 md:mb-12 flex justify-between items-center animate-slide-up">
                <div onClick={() => setCurrentView('home')} className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-stone-900 text-white flex items-center justify-center font-black italic rounded-xl md:rounded-2xl group-hover:rotate-12 transition-transform shadow-lg text-sm md:text-base">H</div>
                    <h2 className="text-lg md:text-2xl font-black tracking-tighter uppercase italic truncate">LEATHER<span className="text-stone-400 hidden sm:inline">CRAFT.</span></h2>
                </div>
                <nav className="hidden md:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                    <button onClick={() => setCurrentView('home')} className={`hover:text-stone-900 transition-colors ${currentView === 'home' ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : ''}`}>Cửa hàng</button>
                    
                    {/* Desktop Auth Button */}
                    {currentUser ? (
                        <div className="flex items-center gap-6 border-l border-stone-200 pl-10">
                            <button 
                                onClick={() => setCurrentView('cart')} 
                                className={`relative hover:text-stone-900 transition-colors flex items-center gap-1 ${currentView === 'cart' ? 'text-stone-900' : ''}`}
                            >
                                <ShoppingCart size={16} /> Giỏ hàng
                                {cart.length > 0 && <span className="absolute -top-2 -right-3 bg-amber-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}
                            </button>
                            <button 
                                onClick={() => setCurrentView('profile')} 
                                className={`hover:text-stone-900 transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100 ${currentView === 'profile' ? 'ring-2 ring-stone-900' : ''}`}
                            >
                                <User size={14} /> {currentUser.name}
                            </button>
                        </div>
                    ) : (
                        <button onClick={onLoginClick} className="hover:text-stone-900 transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100">
                            <User size={14} /> Đăng nhập
                        </button>
                    )}
                </nav>
                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => handleProtectedNavigation('cart')}
                        className="relative p-2 text-stone-900 bg-white rounded-full shadow-sm border border-stone-100"
                    >
                        <ShoppingCart size={18} />
                        {currentUser && cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {currentView === 'home' && renderStorefront()}
                {currentView === 'custom' && renderCustomRoom()}
                {currentView === 'cart' && renderCart()}
                {currentView === 'profile' && renderProfile()}
            </main>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-400 py-8 md:py-16 mt-12 md:mt-24 px-6 sm:px-10 md:px-16 rounded-[2rem] md:rounded-[3rem] pb-24 md:pb-16 shadow-xl animate-fade-in stagger-3">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                    <div className="col-span-2 space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3 group shrink-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-white text-stone-900 flex items-center justify-center font-black italic rounded-xl md:rounded-2xl group-hover:rotate-12 transition-transform shadow-lg text-sm md:text-base">H</div>
                            <h2 className="text-lg md:text-2xl font-black tracking-tighter uppercase italic text-white truncate">LEATHER<span className="text-stone-500">CRAFT.</span></h2>
                        </div>
                        <p className="text-[11px] md:text-sm leading-relaxed max-w-sm mt-2 md:mt-4">Chế tác đồ da thủ công độc bản. Dữ liệu sản phẩm và đơn hàng được bảo chứng bởi hệ thống Supabase Database.</p>
                    </div>
                    <div className="col-span-1">
                        <h3 className="text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-3 md:mb-4">Liên hệ</h3>
                        <ul className="space-y-2 md:space-y-3 text-[10px] md:text-sm">
                            <li>123 Sáng Tạo, Q1</li>
                            <li>Hotline: 090 123 4567</li>
                            <li className="truncate">hello@hmade.vn</li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-3 md:mb-4">Chính sách</h3>
                        <ul className="space-y-2 md:space-y-3 text-[10px] md:text-sm">
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Giao nhận</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Bảo hành</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Bảo mật</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 md:mt-12 pt-6 md:pt-8 border-t border-stone-800 text-[9px] md:text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-center md:text-left">
                    <p>© 2026 H.MADE STUDIO.</p>
                    <div className="flex gap-4 md:gap-6 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-stone-900/95 backdrop-blur-2xl rounded-[2rem] flex items-center justify-around px-2 z-50 border border-white/10 shadow-2xl animate-slide-up">
                <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'home' ? 'text-white' : 'text-stone-500 hover:text-stone-400'}`}>
                    <Home size={18} /> <span className="text-[8px] font-black uppercase tracking-widest">Shop</span>
                </button>
                {/* Mobile Auth Button */}
                {currentUser ? (
                    <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'profile' ? 'text-amber-500' : 'text-stone-500 hover:text-stone-400'}`}>
                        <User size={18} /> <span className="text-[8px] font-black uppercase tracking-widest">Hồ sơ</span>
                    </button>
                ) : (
                    <button onClick={onLoginClick} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-stone-500 transition-colors hover:text-stone-400">
                        <User size={18} /> <span className="text-[8px] font-black uppercase tracking-widest">Login</span>
                    </button>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 3. COMPONENT: LOGIN MODAL
// ==========================================
const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // Mock Authentication Logic - Phân quyền theo sơ đồ DB
        if (username === 'admin' && password === 'admin123') {
            onLogin({ id: 1, name: 'H.Made Admin', role: 'admin' });
        } else if (username === 'khach' && password === 'khach123') {
            onLogin({ id: 2, name: 'Nguyễn Văn An', role: 'customer' });
        } else {
            setError('Tài khoản hoặc mật khẩu không chính xác!');
        }
    };

    return (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-zoom-in">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-stone-100 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-stone-900 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4">
                        <Lock size={28} />
                    </div>
                    <h2 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Đăng nhập</h2>
                    <p className="text-xs text-stone-500 mt-2 font-medium tracking-widest uppercase">Hệ thống quản lý H.MADE</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-xl text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-2 ml-1">Tên tài khoản</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent text-sm font-medium transition-all"
                            placeholder="Nhập tên tài khoản..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-2 ml-1">Mật khẩu</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent text-sm font-medium transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-600 transition-colors mt-4 shadow-lg active:scale-95 transition-all"
                    >
                        Xác nhận đăng nhập
                    </button>
                </form>

                <div className="mt-8 p-4 bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 text-center italic">Thông tin thử nghiệm:</p>
                    <div className="text-[10px] font-medium text-stone-600 space-y-1">
                        <p>👉 Admin: <b className="text-stone-900">admin</b> / <b className="text-stone-900">admin123</b></p>
                        <p>👉 Khách: <b className="text-stone-900">khach</b> / <b className="text-stone-900">khach123</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 4. MAIN APP (ORCHESTRATOR)
// ==========================================
export default function App() {
    const [currentUser, setCurrentUser] = useState(null); 
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const [supabaseClient, setSupabaseClient] = useState(null);
    const [libLoaded, setLibLoaded] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    // 1. NẠP THƯ VIỆN QUA CDN
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
        script.async = true;
        script.onload = () => setLibLoaded(true);
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    // 2. KHỞI TẠO CLIENT
    useEffect(() => {
        if (libLoaded && window.supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            setSupabaseClient(client);
        }
    }, [libLoaded]);

    // 3. FETCH DATA
    const fetchData = async () => {
        if (!supabaseClient) return;
        setFetchError(false);
        try {
            const { data: mats, error: errMats } = await supabaseClient.from('materials').select('*').order('id', { ascending: true });
            if (errMats) throw errMats;
            setMaterials(mats || []);

            const { data: logs, error: errLogs } = await supabaseClient.from('inventory_logs').select('*').order('created_at', { ascending: false });
            if (errLogs) throw errLogs;
            setTransactions(logs || []);

            const { data: ords, error: errOrds } = await supabaseClient.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false });
            if (errOrds) throw errOrds;
            setOrders(ords || []);

            const { data: prods, error: errProds } = await supabaseClient.from('products').select('*').order('id', { ascending: true });
            if (errProds) throw errProds;
            setProducts(prods || []);

        } catch (error) {
            console.error("Lỗi fetching dữ liệu Supabase:", error);
            if (error.code === '42501' || error.status === 401) {
                setFetchError(true);
            }
        }
    };

    useEffect(() => {
        if (supabaseClient) fetchData();
    }, [supabaseClient]);

    const handleLogin = (userData) => {
        setIsLoginModalOpen(false);
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentUser(userData);
            setIsTransitioning(false);
        }, 500);
    };

    const handleLogout = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentUser(null);
            setIsTransitioning(false);
        }, 500);
    };

    if (!libLoaded) {
        return (
            <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white p-8">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse italic">NẠP HỆ THỐNG...</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden bg-stone-50">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slide-left { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-slide-left { animation: slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-zoom-in { animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .stagger-1 { animation-delay: 100ms; }
                .stagger-2 { animation-delay: 200ms; }
                .stagger-3 { animation-delay: 300ms; }
            `}} />

            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                onLogin={handleLogin}
            />

            {isTransitioning && (
                <div className="fixed inset-0 bg-stone-900 z-[300] flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin"></div>
                    <p className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest animate-pulse italic">XÁC THỰC QUYỀN TRUY CẬP...</p>
                </div>
            )}

            <div className="w-full h-full overflow-y-auto">
                {currentUser?.role === 'admin' ? (
                    <AdminDashboard 
                        onLogout={handleLogout} 
                        currentUser={currentUser} 
                        materials={materials} 
                        transactions={transactions} 
                        orders={orders} 
                        refreshData={fetchData} 
                        supabaseClient={supabaseClient}
                        fetchError={fetchError}
                    />
                ) : (
                    <CustomerPortal 
                        onLoginClick={() => setIsLoginModalOpen(true)} 
                        onLogout={handleLogout} 
                        currentUser={currentUser} 
                        products={products} 
                        materials={materials} 
                        orders={orders}
                        refreshData={fetchData} 
                        supabaseClient={supabaseClient}
                    />
                )}
            </div>
        </div>
    );
}