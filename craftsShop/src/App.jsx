import React, { useState, useEffect, useRef } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { 
    LayoutDashboard, PackageSearch, ShoppingCart, Users,
    Menu, X, Bell, Plus, ChevronLeft, Wrench, CreditCard, 
    Home, LogOut, Lock, User, Package, Trash2, ArrowRight,
    Download, Upload, History, ClipboardList, AlertTriangle, 
    Search, CheckCircle2, Clock, MapPin, Edit3, Compass, Info,
    MessageCircle, Send, Sparkles, Smartphone, Award, Ticket, 
    Gift, Tag, Percent, Layers, ImagePlus, Check
} from 'lucide-react';

// Custom SVG Icons
const FacebookIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const InstagramIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

// ==========================================
// CẤU HÌNH SUPABASE & DỮ LIỆU MẪU
// ==========================================
const SUPABASE_URL = 'https://scbzrwkhsvzuxfasijwh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9_NH1e-N5xf9zmNplFpF-Q_3Rh8-JHV';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80';

const fallbackProducts = [
    { id: 1, name: 'Ví Sen Premium', base_price: 550000, category_id: 'Ví da', is_hot: true, image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Dây Apple Watch', base_price: 450000, category_id: 'Phụ kiện', is_hot: false, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Bao Smartkey', base_price: 350000, category_id: 'Phụ kiện', is_hot: true, image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Ví Dài Cầm Tay', base_price: 850000, category_id: 'Ví da', is_hot: false, image_url: 'https://images.unsplash.com/photo-1559564104-e58777085a6a?auto=format&fit=crop&w=600&q=80' }
];

const fallbackMaterials = [
    { id: 1, name: 'Da Bò Epsom', type: 'leather', stock_qty: 15, unit: 'Tấm', color_code: '#8B4513', image_url: 'https://images.unsplash.com/photo-1606115915130-b9a1ec093155?auto=format&fit=crop&w=300&q=80' },
    { id: 2, name: 'Da Bê Swift', type: 'leather', stock_qty: 2, unit: 'Tấm', color_code: '#1A1A1A', image_url: 'https://images.unsplash.com/photo-1552689486-f6773047d58b?auto=format&fit=crop&w=300&q=80' },
    { id: 3, name: 'Chỉ Sáp Trắng', type: 'thread', stock_qty: 50, unit: 'Cuộn', color_code: '#F9F7F3' },
    { id: 4, name: 'Chỉ Sáp Nâu', type: 'thread', stock_qty: 30, unit: 'Cuộn', color_code: '#5C3A21' }
];

const fallbackPromos = [
    { id: 1, code: 'WELCOME20', title: 'Giảm 20% Đơn Đầu', desc: 'Đặc quyền cho khách hàng mới', type: 'percent', value: 0.2, exp: '30/12/2026' },
    { id: 2, code: 'HMADE500', title: 'Giảm 500.000đ', desc: 'Cho đơn thiết kế trên 2 triệu', type: 'fixed', value: 500000, exp: '15/11/2026' }
];

const fallbackPanels = [
    { id: 1, img: fallbackProducts[0].image_url, tag: 'Sản Phẩm Tiêu Biểu', title: fallbackProducts[0].name, sub: `Từ ${fallbackProducts[0].base_price.toLocaleString()}đ`, actionType: 'product', actionId: 1 },
    { id: 2, img: fallbackProducts[3].image_url, tag: 'Ưu Đãi Đặc Quyền', title: 'Giảm 20% Cho VIP', sub: 'Lưu mã ngay hôm nay', actionType: 'promo', actionId: null },
    { id: 3, img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', tag: 'Chế tác riêng', title: 'Khắc Tên Laser', sub: 'Cá nhân hóa độc bản', actionType: 'product', actionId: 3 }
];

const theme = {
    dark: 'bg-[#151515]',
    darkText: 'text-[#151515]',
    gold: 'bg-[#CFA34D]',
    goldText: 'text-[#CFA34D]',
    light: 'bg-[#FAFAFA]', 
    card: 'bg-white',
    border: 'border-stone-100' 
};

// ==========================================
// 1. COMPONENT: CHAT BOT
// ==========================================
const ChatBot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([{ id: 1, text: "Chào bạn! Tôi là trợ lý H.MADE. Bạn cần tư vấn gì ạ?", sender: 'bot' }]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Cảm ơn bạn. Chuyên viên sẽ hỗ trợ bạn sớm nhất!", sender: 'bot' }]);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-28 right-6 w-[280px] h-[380px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-[200] border border-white flex flex-col overflow-hidden animate-zoom-in">
            <div className={`${theme.dark} p-4 text-white flex justify-between items-center`}>
                <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CFA34D] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#CFA34D]"></span></div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90">Trợ lý H.MADE</span>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><X size={14}/></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide bg-transparent">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${m.sender === 'user' ? `${theme.dark} text-white rounded-tr-sm` : 'bg-white text-stone-800 border border-stone-100 rounded-tl-sm'}`}>{m.text}</div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-white border-t border-stone-100 flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Nhập tin nhắn..." className="flex-1 bg-stone-50 border border-transparent rounded-[1rem] px-4 py-3 text-xs focus:bg-white focus:border-[#CFA34D]/30 focus:ring-2 focus:ring-[#CFA34D]/20 outline-none transition-all" />
                <button onClick={handleSend} className={`${theme.dark} text-white p-3 rounded-[1rem] active:scale-95 transition-transform`}><Send size={14} /></button>
            </div>
        </div>
    );
};

// ==========================================
// 2. COMPONENT: SHARED FOOTER
// ==========================================
const InformationFooter = () => (
    <div className="px-5 mt-10 mb-6">
        <footer className={`py-10 ${theme.dark} rounded-[2rem] text-white/40 px-6 flex flex-col gap-6 shadow-xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="space-y-2 relative z-10 text-center">
                <h2 className="text-white text-2xl font-black italic uppercase tracking-tighter leading-none">H.MADE</h2>
                <p className="text-[10px] font-medium italic opacity-70 leading-relaxed">Leather goods with a modern soul.</p>
            </div>
            <div className="flex justify-center gap-4 pt-4 border-t border-white/10 relative z-10">
                <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#121212] cursor-pointer transition-colors text-white"><FacebookIcon size={14}/></div>
                <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#121212] cursor-pointer transition-colors text-white"><InstagramIcon size={14}/></div>
            </div>
        </footer>
    </div>
);

// ==========================================
// 3. COMPONENT: ADMIN DASHBOARD
// ==========================================
const AdminDashboard = ({ onLogout, currentUser, materials, transactions, orders, refreshData, supabaseClient, showToast }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [invTab, setInvTab] = useState('stock'); 
    const [showTxModal, setShowTxModal] = useState(false);
    const [txType, setTxType] = useState('import'); 
    const [txMatId, setTxMatId] = useState('');
    const [txQty, setTxQty] = useState(1);
    const [txNote, setTxNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const stats = {
        totalOrders: orders.length,
        revenue: orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0).toLocaleString('vi-VN') + 'đ',
        pendingOrders: orders.filter(o => o.status === 'pending').length
    };

    useEffect(() => { if (materials.length > 0 && !txMatId) setTxMatId(materials[0].id.toString()); }, [materials, txMatId]);

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        const mat = materials.find(m => m.id.toString() === txMatId);
        if (txType === 'export' && txQty > (mat?.stock_qty || 0)) {
            showToast('Tồn kho không đủ để xuất!', 'error'); 
            setIsProcessing(false); 
            return;
        }
        if (!supabaseClient) {
            showToast('Cập nhật kho thành công (Giả lập)', 'success');
            setShowTxModal(false); setIsProcessing(false); return;
        }
        const newStock = txType === 'import' ? Number(mat.stock_qty) + Number(txQty) : Number(mat.stock_qty) - Number(txQty);
        try {
            await supabaseClient.from('materials').update({ stock_qty: newStock }).eq('id', txMatId);
            await supabaseClient.from('inventory_logs').insert([{ material_id: txMatId, staff_id: currentUser.id, type: txType, quantity: Number(txQty), note: txNote }]);
            showToast('Giao dịch kho thành công', 'success');
            setShowTxModal(false); setTxQty(1); refreshData(); 
        } catch (error) { 
            showToast('Lỗi: ' + error.message, 'error'); 
        } finally { 
            setIsProcessing(false); 
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!supabaseClient) { showToast('Đã cập nhật trạng thái đơn hàng', 'success'); return; }
        try { 
            await supabaseClient.from('orders').update({ status: newStatus }).eq('id', orderId); 
            refreshData(); 
            showToast('Cập nhật trạng thái thành công', 'success');
        } catch (e) { 
            showToast('Không thể cập nhật trạng thái', 'error'); 
        }
    };

    const getStatusStyle = (s) => {
        if(s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100';
        if(s === 'making') return 'bg-blue-50 text-blue-600 border-blue-100';
        return 'bg-green-50 text-green-600 border-green-100';
    };

    const renderDashboard = () => (
        <div className="h-full overflow-y-auto space-y-6 animate-fade-in pb-28 px-5 pt-6">
            <div className={`${theme.dark} rounded-[2rem] p-7 text-white shadow-[0_15px_40px_rgba(0,0,0,0.2)] relative overflow-hidden`}>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#CFA34D]/20 rounded-full blur-3xl"></div>
                <p className={`text-[9px] font-black ${theme.goldText} uppercase tracking-[0.3em] mb-1.5 relative z-10`}>Doanh thu hệ thống</p>
                <h2 className="text-3xl font-black relative z-10 tracking-tight leading-none">{stats.revenue}</h2>
                <div className="mt-8 flex gap-4 relative z-10">
                    <div className="bg-white/5 flex-1 p-4 rounded-2xl border border-white/10 text-center backdrop-blur-md">
                        <p className="text-xl font-black">{stats.totalOrders}</p>
                        <p className="text-[9px] text-white/50 uppercase font-bold mt-1 tracking-widest">Đơn hàng</p>
                    </div>
                    <div className="bg-[#CFA34D]/10 flex-1 p-4 rounded-2xl border border-[#CFA34D]/20 text-center backdrop-blur-md">
                        <p className={`text-xl font-black ${theme.goldText}`}>{stats.pendingOrders}</p>
                        <p className={`text-[9px] ${theme.goldText} uppercase font-bold mt-1 tracking-widest`}>Chờ xử lý</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between px-1 pb-2">
                    <h3 className={`font-extrabold ${theme.darkText} tracking-tight text-lg`}>Đơn hàng gần đây</h3>
                    <button onClick={() => setCurrentView('orders')} className={`text-[10px] font-bold text-stone-500 hover:${theme.darkText} transition-colors`}>Tất cả</button>
                </div>
                {orders.length === 0 ? <div className="p-8 text-center opacity-30 text-[10px] uppercase font-black tracking-widest">Chưa có dữ liệu</div> : orders.slice(0, 5).map(o => (
                    <div key={o.id} className={`${theme.card} p-5 rounded-3xl border border-stone-200/60 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all`}>
                        <div className="flex justify-between items-start">
                            <div><p className={`font-black text-sm ${theme.darkText}`}>#{o.id.toString().slice(0,8).toUpperCase()}</p><p className="text-[10px] text-stone-400 mt-0.5 uppercase font-bold tracking-wider">{o.profiles?.full_name || 'Khách vãng lai'}</p></div>
                            <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border outline-none bg-stone-50 ${getStatusStyle(o.status)}`}>
                                <option value="pending">Chờ duyệt</option>
                                <option value="making">Đang làm</option>
                                <option value="completed">Đã xong</option>
                            </select>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-stone-50">
                            <span className="text-[10px] font-bold text-stone-400">{new Date(o.created_at).toLocaleDateString()}</span>
                            <span className={`font-black ${theme.darkText} text-sm`}>{(o.total_amount || 0).toLocaleString()}đ</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="h-full overflow-y-auto space-y-6 animate-fade-in pb-32 px-5 pt-6">
            <h2 className={`text-2xl font-extrabold ${theme.darkText} tracking-tight px-1`}>Tất cả đơn</h2>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="text" placeholder="Tìm mã đơn hàng..." className={`w-full bg-white border border-stone-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#CFA34D]/20 focus:border-[#CFA34D] transition-all shadow-sm`} />
            </div>
            <div className="space-y-4">
                {orders.map(o => (
                    <div key={o.id} className={`${theme.card} p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 flex flex-col gap-4`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`font-extrabold text-base ${theme.darkText}`}>#{o.id.toString().slice(0,8).toUpperCase()}</p>
                                <p className="text-xs font-medium text-stone-500 mt-1">{o.profiles?.full_name || 'Khách vãng lai'}</p>
                            </div>
                            <select 
                                value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl border outline-none appearance-none ${getStatusStyle(o.status)}`}
                            >
                                <option value="pending">Chờ duyệt</option>
                                <option value="making">Đang làm</option>
                                <option value="completed">Xong</option>
                            </select>
                        </div>
                        <div className="bg-stone-50/50 p-3.5 rounded-[1rem] border border-stone-100/50">
                            <p className="text-[10px] font-medium text-stone-500 mb-1">Địa chỉ giao hàng</p>
                            <p className={`text-xs font-medium ${theme.darkText} line-clamp-2`}>{o.shipping_address || 'Chưa cung cấp'}</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <p className="text-[10px] text-stone-400 font-medium">{new Date(o.created_at || Date.now()).toLocaleDateString('vi-VN')}</p>
                            <p className={`font-extrabold text-lg ${theme.darkText}`}>{(o.total_amount || 0).toLocaleString()}đ</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInventory = () => (
        <div className="h-full overflow-y-auto space-y-6 animate-fade-in pb-32 px-5 pt-6">
            <h2 className={`text-2xl font-black ${theme.darkText} uppercase tracking-tighter px-1`}>Kho Vật Tư</h2>
            <div className="flex gap-3">
                <button onClick={() => { setTxType('import'); setShowTxModal(true); }} className={`flex-1 ${theme.dark} text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2`}><Download size={14}/> Nhập</button>
                <button onClick={() => { setTxType('export'); setShowTxModal(true); }} className={`flex-1 bg-white ${theme.darkText} border border-stone-200 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2`}><Upload size={14}/> Xuất</button>
            </div>
            
            <div className={`flex bg-stone-100 p-1.5 rounded-xl`}>
                <button onClick={() => setInvTab('stock')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${invTab === 'stock' ? `bg-white shadow-sm text-black` : `text-stone-400`}`}>Tồn kho</button>
                <button onClick={() => setInvTab('history')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${invTab === 'history' ? `bg-white shadow-sm text-black` : `text-stone-400`}`}>Lịch sử</button>
            </div>

            <div className="space-y-4">
                {invTab === 'stock' ? materials.map(m => (
                    <div key={m.id} className={`${theme.card} p-4 rounded-[1.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-stone-100 flex items-center gap-4`}>
                        <div className="w-14 h-14 rounded-2xl bg-stone-50 overflow-hidden relative shadow-inner flex items-center justify-center border border-stone-100">
                            {m.image_url ? <img src={m.image_url} className="w-full h-full object-cover" alt=""/> : <div className="w-8 h-8 rounded-full opacity-40" style={{backgroundColor: m.color_code}}></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-extrabold text-sm ${theme.darkText} truncate`}>{m.name}</p>
                            <p className="text-[9px] font-bold text-[#A3A3A3] uppercase mt-0.5 tracking-widest">{m.type}</p>
                        </div>
                        <div className={`text-right shrink-0 bg-stone-50 px-3 py-2 rounded-xl border border-stone-100`}>
                            <p className={`font-extrabold text-lg ${theme.darkText}`}>{m.stock_qty}</p>
                            <p className="text-[9px] font-medium text-stone-400">{m.unit}</p>
                        </div>
                    </div>
                )) : transactions.map(t => (
                    <div key={t.id} className={`${theme.card} p-5 rounded-[1.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-stone-100 space-y-3`}>
                        <div className={`flex justify-between items-center border-b border-stone-50 pb-3`}>
                            <span className={`text-[9px] font-bold px-2.5 py-1 rounded-md tracking-widest ${t.type === 'import' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{t.type === 'import' ? 'NHẬP KHO' : 'XUẤT KHO'}</span>
                            <p className="text-[10px] font-medium text-stone-400">{new Date(t.created_at || Date.now()).toLocaleString('vi-VN')}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className={`text-xs font-bold ${theme.darkText} max-w-[200px] truncate`}>{materials.find(m => m.id === t.material_id)?.name || 'Vật tư'}</p>
                            <p className={`font-extrabold text-xl ${t.type === 'import' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'import' ? '+' : '-'}{t.quantity}</p>
                        </div>
                        {t.note && <p className="text-[11px] text-stone-500 italic bg-stone-50 p-3 rounded-xl border border-stone-100/50">"{t.note}"</p>}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPromosAdmin = () => (
        <div className="h-full overflow-y-auto space-y-6 animate-fade-in pb-32 px-5 pt-6">
            <div className="flex justify-between items-center px-1">
                <h2 className={`text-2xl font-black ${theme.darkText} tracking-tight`}>Mã Ưu Đãi</h2>
                <button className={`w-8 h-8 rounded-full ${theme.dark} text-white flex items-center justify-center shadow-lg active:scale-90`}><Plus size={16}/></button>
            </div>
            <div className="space-y-4">
                {fallbackPromos.map(p => (
                    <div key={p.id} className="bg-white p-5 rounded-[1.5rem] border border-stone-200/60 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100"><Ticket size={20}/></div>
                            <div>
                                <h4 className="font-extrabold text-sm">{p.code}</h4>
                                <p className="text-[10px] font-medium text-stone-500 mt-0.5">{p.title}</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">Đang chạy</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPanelsAdmin = () => (
        <div className="h-full overflow-y-auto space-y-6 animate-fade-in pb-32 px-5 pt-6">
            <div className="flex justify-between items-center px-1">
                <h2 className={`text-2xl font-black ${theme.darkText} tracking-tight`}>Quản lý Giao diện</h2>
                <button className={`w-8 h-8 rounded-full ${theme.dark} text-white flex items-center justify-center shadow-lg active:scale-90`}><Plus size={16}/></button>
            </div>
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Panels Trang Chủ</h3>
                {fallbackPanels.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-[1.5rem] border border-stone-200/60 shadow-sm flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden relative bg-stone-100">
                            <img src={p.img} className="w-full h-full object-cover opacity-80" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[8px] font-black uppercase text-[#CFA34D] bg-[#CFA34D]/10 px-2 py-0.5 rounded w-fit mb-1">{p.tag}</span>
                            <h4 className="font-extrabold text-sm text-stone-800 line-clamp-1">{p.title}</h4>
                            <p className="text-[10px] text-stone-400 mt-0.5">{p.sub}</p>
                            <div className="flex gap-2 mt-2">
                                <button className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-md text-[9px] font-bold text-stone-600">Sửa</button>
                                <button className="px-3 py-1 bg-red-50 text-red-500 rounded-md text-[9px] font-bold">Xóa</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`h-full ${theme.light} relative flex flex-col`}>
            <header className={`shrink-0 px-6 py-5 flex justify-between items-center bg-white/90 backdrop-blur-md border-b ${theme.border} z-20 sticky top-0`}>
                <div><h1 className={`text-[9px] font-black ${theme.goldText} uppercase tracking-[0.4em]`}>Terminal</h1><p className={`text-xl font-black ${theme.darkText} tracking-tighter mt-0.5`}>ADMIN</p></div>
                <div className={`w-9 h-9 rounded-full ${theme.dark} text-white flex items-center justify-center shadow-md cursor-pointer active:scale-90 transition-transform`} onClick={onLogout}><LogOut size={14} /></div>
            </header>
            <main className="flex-1 overflow-hidden relative z-0">
                <div key={currentView} className="h-full w-full">
                    {currentView === 'dashboard' && renderDashboard()}
                    {currentView === 'orders' && renderOrders()}
                    {currentView === 'inventory' && renderInventory()}
                    {currentView === 'promos' && renderPromosAdmin()}
                    {currentView === 'panels' && renderPanelsAdmin()}
                </div>
            </main>
            
            {/* ADMIN BOTTOM NAV - 5 TABS */}
            <div className={`absolute bottom-6 left-5 right-5 h-[64px] bg-white/90 backdrop-blur-2xl rounded-3xl flex items-center justify-around px-2 z-50 border border-stone-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)]`}>
                <button onClick={() => setCurrentView('dashboard')} className={`p-2 transition-colors ${currentView === 'dashboard' ? theme.goldText : 'text-[#121212] opacity-40 hover:opacity-100'}`}><LayoutDashboard size={20} /></button>
                <button onClick={() => setCurrentView('orders')} className={`p-2 transition-colors ${currentView === 'orders' ? theme.goldText : 'text-[#121212] opacity-40 hover:opacity-100'}`}><ShoppingCart size={20} /></button>
                <button onClick={() => setCurrentView('inventory')} className={`p-2 transition-colors ${currentView === 'inventory' ? theme.goldText : 'text-[#121212] opacity-40 hover:opacity-100'}`}><PackageSearch size={20} /></button>
                <button onClick={() => setCurrentView('promos')} className={`p-2 transition-colors ${currentView === 'promos' ? theme.goldText : 'text-[#121212] opacity-40 hover:opacity-100'}`}><Tag size={20} /></button>
                <button onClick={() => setCurrentView('panels')} className={`p-2 transition-colors ${currentView === 'panels' ? theme.goldText : 'text-[#121212] opacity-40 hover:opacity-100'}`}><Layers size={20} /></button>
            </div>
        </div>
    );
};

// ==========================================
// 3. COMPONENT: CUSTOMER PORTAL
// ==========================================
const CustomerPortal = ({ onLoginClick, onLogout, currentUser, products, orders, materials, onPlaceOrder, supabaseClient, showToast }) => {
    const [currentView, setCurrentView] = useState('home'); 
    const [customProduct, setCustomProduct] = useState(null);
    const [addKeychain, setAddKeychain] = useState(false);
    const [addNFC, setAddNFC] = useState(false);
    const [selectedLeather, setSelectedLeather] = useState(null);
    const [selectedThread, setSelectedThread] = useState(null);
    const [engraving, setEngraving] = useState('');
    const [cart, setCart] = useState([]);
    
    // STATE GIỎ HÀNG THÔNG MINH & ƯU ĐÃI
    const [selectedCartItems, setSelectedCartItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [savedPromos, setSavedPromos] = useState([]);
    const [appliedPromoCode, setAppliedPromoCode] = useState('');
    const [activePromo, setActivePromo] = useState(null);
    const [isPromoSelectorOpen, setIsPromoSelectorOpen] = useState(false);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ email: '', phone: '', address: '' });

    // State Slider Panels
    const [currentPanel, setCurrentPanel] = useState(0);

    const handleProtectedNavigation = (view) => {
        if (!currentUser) onLoginClick();
        else setCurrentView(view);
    };

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                email: currentUser.email || 'customer@hmade.vn',
                phone: currentUser.phone || '0901234567',
                address: currentUser.address || '123 Đ. Lê Lợi, Quận 1, TP.HCM'
            });
        }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser && currentView === 'profile') setCurrentView('home');
    }, [currentUser, currentView]);

    const leathers = materials.filter(m => m.type === 'leather');
    const threads = materials.filter(m => m.type === 'thread');

    useEffect(() => {
        if (leathers.length > 0 && !selectedLeather) setSelectedLeather(leathers[0]);
        if (threads.length > 0 && !selectedThread) setSelectedThread(threads[0]);
    }, [materials]);

    // Auto slide Panel
    useEffect(() => {
        if(currentView !== 'home') return;
        const timer = setInterval(() => {
            setCurrentPanel((prev) => (prev + 1) % fallbackPanels.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [currentView]);

    const totalPrice = (customProduct?.base_price || 0) + (addKeychain ? 150000 : 0) + (addNFC ? 80000 : 0);
    const checkoutTotal = cart.filter(item => selectedCartItems.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
    
    const discountAmount = activePromo ? (activePromo.type === 'percent' ? checkoutTotal * activePromo.value : activePromo.value) : 0;
    const finalTotal = Math.max(0, checkoutTotal - discountAmount);

    const applyPromoCode = (codeToApply = appliedPromoCode) => {
        const promo = fallbackPromos.find(p => p.code.toUpperCase() === codeToApply.toUpperCase());
        if (promo) {
            if(promo.type === 'fixed' && checkoutTotal < 2000000) { 
                showToast('Mã này chỉ áp dụng cho đơn từ 2.000.000đ', 'error'); 
                return; 
            }
            setActivePromo(promo);
            setAppliedPromoCode(promo.code);
            showToast(`Đã áp dụng mã ${promo.code}`, 'success');
        } else {
            showToast('Mã ưu đãi không hợp lệ', 'error');
            setActivePromo(null);
        }
    };

    const handleSavePromo = (promoId) => {
        setSavedPromos([...savedPromos, promoId]);
        showToast('Đã lưu mã ưu đãi vào ví!', 'success');
    };

    const openCustomRoom = (product = null, editItem = null) => {
        if (editItem) {
            setEditingItemId(editItem.id);
            setCustomProduct(editItem.product);
            setSelectedLeather(editItem.leather);
            setSelectedThread(editItem.thread);
            setEngraving(editItem.engraving || '');
            setAddKeychain(editItem.addKeychain || false);
            setAddNFC(editItem.addNFC || false);
        } else {
            setEditingItemId(null);
            setCustomProduct(product || products[0]);
            setSelectedLeather(leathers[0]);
            setSelectedThread(threads[0]);
            setEngraving('');
            setAddKeychain(false);
            setAddNFC(false);
        }
        setCurrentView('custom');
    };

    const handlePanelClick = (panel) => {
        if(panel.actionType === 'product') {
            const prod = products.find(p => p.id === panel.actionId);
            if(prod) openCustomRoom(prod);
        } else if (panel.actionType === 'promo') {
            setCurrentView('promos');
        }
    };

    const handleAddToCart = () => {
        const newItem = { id: editingItemId || Date.now(), product: customProduct, leather: selectedLeather, thread: selectedThread, engraving, addKeychain, addNFC, price: totalPrice, qty: 1 };
        if (editingItemId) { 
            setCart(cart.map(item => item.id === editingItemId ? newItem : item)); 
            setEditingItemId(null); 
            showToast('Đã cập nhật thay đổi', 'success');
        } 
        else { 
            setCart([...cart, newItem]); 
            setSelectedCartItems(prev => [...prev, newItem.id]); 
            showToast('Đã thêm vào túi hàng', 'success');
        }
        setCurrentView('cart');
    };

    const handleRemoveFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
        setSelectedCartItems(prev => prev.filter(itemId => itemId !== id));
        if(cart.length - 1 === 0) setActivePromo(null);
    };

    const toggleSelectItem = (id) => setSelectedCartItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const toggleSelectAll = () => { if (selectedCartItems.length === cart.length && cart.length > 0) setSelectedCartItems([]); else setSelectedCartItems(cart.map(item => item.id)); };

    const handleCheckout = () => {
        if (!currentUser) { onLoginClick(); return; }
        if (selectedCartItems.length === 0) { showToast("Vui lòng chọn sản phẩm để thanh toán", "error"); return; }
        setIsCheckingOut(true);
        setTimeout(() => {
            const newOrder = { id: Math.random().toString(36).substr(2, 6).toUpperCase(), user_id: currentUser.id, status: 'pending', total_amount: finalTotal, created_at: new Date().toISOString(), profiles: { full_name: currentUser.name } };
            onPlaceOrder(newOrder);
            showToast("Tuyệt vời! Đơn hàng đã được ghi nhận.", 'success');
            setCart(cart.filter(item => !selectedCartItems.includes(item.id)));
            setSelectedCartItems([]);
            setActivePromo(null);
            setAppliedPromoCode('');
            setIsCheckingOut(false); setCurrentView('profile');
        }, 1200);
    };

    const handleSaveProfile = () => { 
        setIsEditingProfile(false); 
        showToast('Cập nhật thông tin thành công!', 'success');
    };

    const myOrders = orders.filter(o => o.user_id === currentUser?.id);

    const renderStorefront = () => (
        <div className="h-full overflow-y-auto animate-fade-in pb-32">
            {/* PANELS SLIDER */}
            <div className="px-5 mt-6">
                <div onClick={() => handlePanelClick(fallbackPanels[currentPanel])} className="relative h-[340px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group cursor-pointer bg-stone-100">
                    {fallbackPanels.map((panel, idx) => (
                        <img key={panel.id} src={panel.img} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentPanel ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} alt="" />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <span className="bg-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-3 inline-block shadow-lg transition-all">{fallbackPanels[currentPanel].tag}</span>
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic drop-shadow-md leading-tight mb-2 transition-all">{fallbackPanels[currentPanel].title}</h3>
                        <p className="text-xs font-medium text-white/80 mb-5">{fallbackPanels[currentPanel].sub}</p>
                        <button className="bg-white text-[#121212] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
                            {fallbackPanels[currentPanel].actionType === 'promo' ? 'Lưu mã ngay' : 'Thiết kế ngay'} <ArrowRight size={14}/>
                        </button>
                    </div>
                    {/* Dots Indicator */}
                    <div className="absolute bottom-6 right-6 flex gap-1.5 z-20">
                        {fallbackPanels.map((_, idx) => (
                            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPanel ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-white/50'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8">
                <div className="flex justify-between items-end mb-4">
                    <h3 className={`font-black ${theme.darkText} uppercase tracking-tighter text-xl italic`}>Bộ sưu tập</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {products.slice(1).map(p => (
                        <div key={p.id} onClick={() => openCustomRoom(p)} className={`bg-white p-3.5 rounded-[1.5rem] shadow-sm border border-stone-100 flex flex-col gap-3 active:scale-[0.97] transition-all group cursor-pointer`}>
                            <div className="aspect-square rounded-xl overflow-hidden relative bg-stone-50 border border-stone-50">
                                <img src={p.image_url || FALLBACK_IMG} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" onError={(e)=>e.target.src=FALLBACK_IMG} />
                            </div>
                            <div className="flex flex-col flex-1">
                                <p className={`text-[9px] font-bold text-stone-400 mb-1 uppercase tracking-widest`}>{p.category_id}</p>
                                <h4 className={`text-sm font-extrabold ${theme.darkText} leading-tight line-clamp-1 mb-1`}>{p.name}</h4>
                                <div className="mt-auto flex items-center justify-between pt-1">
                                    <p className={`text-xs font-black ${theme.goldText}`}>{p.base_price.toLocaleString()}đ</p>
                                    <div className="w-6 h-6 rounded-full bg-[#121212] text-white flex items-center justify-center"><Plus size={12}/></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <InformationFooter />
        </div>
    );

    const renderDiscover = () => (
        <div className="h-full overflow-y-auto animate-fade-in pb-32 bg-[#FAFAFA]">
            <div className="px-6 pt-6">
                <h2 className={`text-2xl font-extrabold tracking-tight mb-6 ${theme.darkText}`}>Khám phá</h2>
                
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm mb-6">
                    <div className="w-10 h-10 bg-[#CFA34D]/10 rounded-full flex items-center justify-center mb-4">
                        <Info size={18} className="text-[#CFA34D]" />
                    </div>
                    <h3 className="text-lg font-black italic uppercase mb-2">Triết lý H.MADE</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">Chúng tôi tin rằng mỗi tấm da đều có một câu chuyện riêng. H.MADE không sản xuất hàng loạt, chúng tôi chế tác những tác phẩm nghệ thuật độc bản dành riêng cho bạn, kết hợp giữa truyền thống và công nghệ hiện đại (NFC).</p>
                </div>

                <h3 className="text-sm font-extrabold mb-4 px-1">Chất liệu Da thượng hạng</h3>
                <div className="space-y-4 mb-8">
                    {leathers.map(l => (
                        <div key={l.id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                                {l.image_url ? <img src={l.image_url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full" style={{backgroundColor: l.color_code}}></div>}
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm">{l.name}</h4>
                                <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">Nhập khẩu Châu Âu</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-sm font-extrabold mb-4 px-1">Chỉ sáp khâu tay</h3>
                <div className="space-y-4 mb-6">
                    {threads.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-inner border border-stone-100/50" style={{backgroundColor: t.color_code}}></div>
                            <div>
                                <h4 className="font-extrabold text-sm">{t.name}</h4>
                                <p className="text-[10px] text-stone-400 mt-1">Độ bền cao, chống nước</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <InformationFooter />
        </div>
    );

    const renderPromos = () => (
        <div className="h-full overflow-y-auto animate-fade-in pb-32 bg-[#FAFAFA]">
            <div className="px-6 pt-6">
                <h2 className={`text-2xl font-extrabold tracking-tight mb-6 ${theme.darkText}`}>Ưu đãi của bạn</h2>
                <div className="space-y-4">
                    {fallbackPromos.map(p => {
                        const isSaved = savedPromos.includes(p.id);
                        return (
                            <div key={p.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-stone-100 flex items-center gap-4 relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-[85px] border-l-[2px] border-dashed border-stone-100"></div>
                                <div className="absolute top-[-6px] left-[82px] w-3 h-3 bg-[#FAFAFA] rounded-full border-b border-stone-100"></div>
                                <div className="absolute bottom-[-6px] left-[82px] w-3 h-3 bg-[#FAFAFA] rounded-full border-t border-stone-100"></div>
                                
                                <div className="w-14 h-14 rounded-full bg-[#CFA34D]/10 flex items-center justify-center shrink-0">
                                    <Percent size={24} className="text-[#CFA34D]" />
                                </div>
                                <div className="flex-1 pl-4 min-w-0">
                                    <h4 className="font-extrabold text-sm truncate">{p.title}</h4>
                                    <p className="text-[10px] text-stone-500 mt-1 line-clamp-1 leading-relaxed">{p.desc}</p>
                                    <p className="text-[9px] font-bold text-red-400 mt-1.5 uppercase tracking-widest">HSD: {p.exp}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => { setAppliedPromoCode(p.code); setCurrentView('cart'); }} className="px-3 py-1.5 bg-[#121212] text-white rounded-lg text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-transform">Dùng</button>
                                        <button onClick={() => handleSavePromo(p.id)} disabled={isSaved} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors ${isSaved ? 'bg-stone-100 text-stone-400' : 'bg-stone-50 border border-stone-200 text-stone-600'}`}>{isSaved ? 'Đã lưu' : 'Lưu mã'}</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <InformationFooter />
        </div>
    );

    const renderCustomRoom = () => (
        <div className={`h-full flex flex-col animate-slide-left bg-[#FAFAFA] relative pb-6`}>
            
            {/* THIẾT KẾ PREVIEW ĐẸP: Dark Card, viền đứt đoạn bên trong */}
            <div className="mx-5 mt-6 mb-2 h-[45%] shrink-0 relative rounded-[2.5rem] shadow-2xl overflow-hidden bg-[#1c1c1c]">
                <img src={customProduct?.image_url || FALLBACK_IMG} className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 mix-blend-overlay" alt=""/>
                <div className="absolute inset-0 z-10 mix-blend-color transition-colors duration-700 opacity-60" style={{backgroundColor: selectedLeather?.color_code || '#8B4513'}}></div>
                <div className="absolute inset-0 bg-black/40 z-[15]"></div>

                {/* Viền đứt đoạn nằm bên trong */}
                <div className="absolute inset-5 border-[1.5px] border-dashed border-white/30 rounded-[1.5rem] pointer-events-none z-20"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none p-6">
                    <h2 className="text-white font-black tracking-[0.3em] text-3xl uppercase drop-shadow-2xl text-center leading-tight">
                        {customProduct?.name || 'H.MADE'}
                    </h2>
                    {engraving && <p className="mt-3 text-[#D4AF37] font-black tracking-[0.2em] text-sm uppercase drop-shadow-md">{engraving}</p>}
                </div>
                
                {selectedThread && (
                    <div className="absolute inset-5 border-[3px] border-dashed rounded-[1.5rem] opacity-30 pointer-events-none transition-colors duration-500 z-20" style={{borderColor: selectedThread.color_code}}></div>
                )}

                <button onClick={() => { setEditingItemId(null); setCurrentView(editingItemId ? 'cart' : 'home'); }} className="absolute top-8 left-8 w-10 h-10 bg-white text-[#121212] rounded-full flex items-center justify-center shadow-lg z-50 active:scale-90 transition-transform">
                    <ChevronLeft size={20} />
                </button>

                <div className={`absolute transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${addKeychain ? 'opacity-100 bottom-8 right-8 scale-100' : 'opacity-0 bottom-0 right-8 scale-0'} z-40`}>
                    <div className="w-12 h-20 bg-stone-800 rounded-[1.25rem] shadow-xl border border-white/20 flex flex-col items-center pt-3 overflow-hidden" style={{backgroundColor: selectedLeather?.color_code}}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10"></div>
                        <div className="w-5 h-5 rounded-full border-[4px] border-[#D4AF37] relative z-10 shadow-inner"></div>
                    </div>
                </div>
                
                <div className={`absolute transition-all duration-700 ${addNFC ? 'opacity-100 top-8 right-8 scale-100' : 'opacity-0 top-0 right-8 scale-0'} z-40`}>
                    <div className={`${theme.gold} text-[#121212] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5`}>
                        <div className="w-1.5 h-1.5 bg-[#121212] rounded-full animate-ping"></div> NFC
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-4 space-y-8 scrollbar-hide relative z-10 pb-28">
                <div className={`flex justify-between items-end border-b border-stone-200 pb-4`}>
                    <div className="min-w-0 pr-4">
                        <p className={`text-[10px] font-black ${theme.goldText} uppercase tracking-[0.3em] mb-1`}>{editingItemId ? 'Chỉnh sửa' : 'Cá nhân hóa'}</p>
                        <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme.darkText} truncate`}>Thiết Kế</h2>
                    </div>
                    <p className="text-2xl font-black tracking-tight text-[#121212]">{totalPrice.toLocaleString()}đ</p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center"><h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.darkText}`}>1. Màu da thuộc</h3><span className="text-[10px] font-bold text-[#A3A3A3] uppercase">{selectedLeather?.name}</span></div>
                    <div className="flex gap-5 overflow-x-auto scrollbar-hide py-4 px-6 -mx-6">
                        {leathers.map(l => (
                            <button key={l.id} onClick={() => setSelectedLeather(l)} className={`w-14 h-14 rounded-full shrink-0 border-[3px] transition-all duration-300 ${selectedLeather?.id === l.id ? `ring-[4px] ring-offset-4 ring-[#D4AF37] border-white scale-110 shadow-lg` : `border-stone-200 shadow-sm active:scale-90`}`} style={{ backgroundColor: l.color_code }} />
                        ))}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center"><h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.darkText}`}>2. Màu chỉ khâu</h3><span className="text-[10px] font-bold text-[#A3A3A3] uppercase">{selectedThread?.name}</span></div>
                    <div className="flex gap-5 overflow-x-auto scrollbar-hide py-4 px-6 -mx-6">
                        {threads.map(t => (
                            <button key={t.id} onClick={() => setSelectedThread(t)} className={`w-12 h-12 rounded-full shrink-0 border-[3px] transition-all duration-300 ${selectedThread?.id === t.id ? `ring-[4px] ring-offset-4 ring-[#121212] border-white scale-110 shadow-lg` : `border-stone-200 shadow-sm active:scale-90`}`} style={{ backgroundColor: t.color_code }} />
                        ))}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.darkText}`}>3. Chữ ký Laser</h3>
                    <input type="text" maxLength="12" value={engraving} onChange={(e) => setEngraving(e.target.value.toUpperCase())} className="w-full px-6 py-4 bg-white border border-stone-200 rounded-[1.5rem] focus:ring-2 focus:ring-[#D4AF37] outline-none font-black uppercase shadow-sm text-sm tracking-widest transition-all" placeholder="TÊN CỦA BẠN..." />
                </div>

                <div className="space-y-4 pb-10">
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.darkText}`}>4. Phụ kiện đi kèm</h3>
                    <div className="grid gap-4">
                        <button onClick={() => setAddKeychain(!addKeychain)} className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all duration-300 ${addKeychain ? `border-[#121212] ${theme.dark} text-white shadow-lg` : `border-stone-100 bg-white text-stone-600`}`}>
                            <div className="flex items-center gap-4"><Wrench size={18} className={addKeychain ? "text-[#D4AF37]" : "text-[#A3A3A3]"} /><p className="font-black text-xs uppercase tracking-wide">Móc khóa da</p></div>
                            <span className={`font-black text-[10px] px-3 py-1.5 rounded-lg ${addKeychain ? 'bg-white/20' : 'bg-stone-100 text-stone-500'}`}>+150K</span>
                        </button>
                        <button onClick={() => setAddNFC(!addNFC)} className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all duration-300 ${addNFC ? `border-[#121212] ${theme.gold} text-[#121212] shadow-lg` : `border-stone-100 bg-white text-stone-600`}`}>
                            <div className="flex items-center gap-4"><CreditCard size={18} className={addNFC ? "text-[#121212]" : "text-[#A3A3A3]"} /><p className="font-black text-xs uppercase tracking-wide">Chip NFC</p></div>
                            <span className={`font-black text-[10px] px-3 py-1.5 rounded-lg ${addNFC ? 'bg-white/20' : 'bg-stone-100 text-stone-500'}`}>+80K</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 z-40 bg-transparent pt-2">
                <button onClick={handleAddToCart} className={`w-full py-4 ${theme.dark} text-white rounded-[1.5rem] font-bold uppercase text-[11px] tracking-widest shadow-xl flex justify-center items-center gap-2 active:scale-[0.98] transition-transform border border-white/10`}>
                    <span>{editingItemId ? 'Lưu thay đổi' : 'Thêm vào túi'}</span><ArrowRight size={16} className={theme.goldText} />
                </button>
            </div>
        </div>
    );

    const renderCart = () => (
        <div className="h-full overflow-y-auto animate-fade-in px-6 pt-10 pb-32 bg-[#FAFAFA]">
            <h2 className={`text-2xl font-extrabold tracking-tight mb-6 ${theme.darkText}`}>Giỏ hàng</h2>
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 p-10">
                    <ShoppingCart size={40} className="text-stone-200 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Túi trống</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Nút Chọn tất cả */}
                    <div className="flex justify-end items-center px-1 mb-2">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSelectAll}>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Chọn tất cả</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCartItems.length === cart.length && cart.length > 0 ? 'bg-[#121212] border-[#121212]' : 'border-stone-300 bg-white'}`}>
                                {selectedCartItems.length === cart.length && cart.length > 0 && <Check size={12} strokeWidth={3} className="text-white" />}
                            </div>
                        </div>
                    </div>

                    {/* Danh sách món hàng */}
                    {cart.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-stone-100 flex gap-4 items-center hover:shadow-md transition-all">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden relative bg-stone-50 border border-stone-100 shrink-0">
                                <img src={item.product?.image_url || FALLBACK_IMG} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" alt=""/>
                                <div className="absolute inset-0 mix-blend-color opacity-50" style={{backgroundColor: item.leather?.color_code}}></div>
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h3 className="font-extrabold text-sm text-stone-900 truncate">{item.product?.name}</h3>
                                <p className="text-[9px] font-bold text-stone-400 mt-1 uppercase tracking-widest truncate">Da {item.leather?.name}</p>
                                <p className={`font-black text-sm ${theme.darkText} mt-2`}>{item.price.toLocaleString()}đ</p>
                                <div className="flex gap-2 mt-2.5">
                                    <button onClick={() => openCustomRoom(null, item)} className="px-4 py-1.5 bg-stone-50 border border-stone-200 rounded-full text-[9px] font-bold uppercase text-stone-500 hover:text-black transition-colors">Sửa</button>
                                    <button onClick={() => handleRemoveFromCart(item.id)} className="w-7 h-7 bg-red-50 rounded-full text-red-400 hover:text-red-500 transition-colors flex items-center justify-center"><Trash2 size={12}/></button>
                                </div>
                            </div>
                            
                            {/* Checkbox */}
                            <div onClick={() => toggleSelectItem(item.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer shrink-0 transition-colors ${selectedCartItems.includes(item.id) ? 'bg-[#121212] border-[#121212]' : 'border-stone-300 bg-white'}`}>
                                {selectedCartItems.includes(item.id) && <Check size={14} strokeWidth={3} className="text-white" />}
                            </div>
                        </div>
                    ))}

                    {/* MÃ ƯU ĐÃI (Đã fix UI không bị tràn) */}
                    <div className="bg-white p-2 rounded-[1.25rem] border border-stone-100 shadow-sm flex gap-2 items-center mt-6">
                        <button onClick={() => setIsPromoSelectorOpen(true)} className="w-10 h-10 shrink-0 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-center text-stone-400 hover:text-[#121212] transition-colors active:scale-95">
                            <Plus size={18} />
                        </button>
                        <input type="text" value={appliedPromoCode} onChange={(e) => setAppliedPromoCode(e.target.value.toUpperCase())} placeholder="MÃ ƯU ĐÃI..." className="flex-1 min-w-0 bg-transparent border-none px-2 py-2 text-[10px] font-extrabold uppercase tracking-widest outline-none text-stone-800 placeholder:text-stone-300" />
                        <button onClick={() => applyPromoCode()} className="bg-[#121212] shrink-0 text-white px-4 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-transform whitespace-nowrap shadow-md">
                            Áp dụng
                        </button>
                    </div>
                    {activePromo && <p className="text-[10px] font-bold text-green-600 px-2 mt-2 text-right">Đã áp dụng: {activePromo.title}</p>}
                    
                    {/* TỔNG TIỀN & THANH TOÁN */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-stone-100 mt-6">
                        <div className="space-y-3 mb-5 border-b border-stone-100 pb-5">
                            <div className="flex justify-between items-center text-[11px] font-bold text-stone-500"><p>Tạm tính ({selectedCartItems.length})</p><p>{checkoutTotal.toLocaleString()}đ</p></div>
                            {activePromo && <div className="flex justify-between items-center text-[11px] font-bold text-green-600"><p>Giảm giá</p><p>-{discountAmount.toLocaleString()}đ</p></div>}
                        </div>
                        <div className="flex justify-between items-end mb-6">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Tổng cộng</p>
                            <p className="text-2xl font-black text-[#121212] leading-none">{finalTotal.toLocaleString()}đ</p>
                        </div>
                        <button onClick={handleCheckout} disabled={isCheckingOut || selectedCartItems.length === 0} className={`w-full py-4 rounded-[1.25rem] font-bold text-[11px] uppercase tracking-widest transition-all shadow-md flex justify-center items-center gap-2 ${selectedCartItems.length === 0 ? 'bg-stone-100 text-stone-400 shadow-none' : 'bg-[#121212] text-white active:scale-95'}`}>
                            {isCheckingOut ? 'Đang xử lý...' : 'Thanh toán an toàn'}
                            {selectedCartItems.length > 0 && !isCheckingOut && <Lock size={14} className="text-white/50" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderProfile = () => (
        <div className="h-full overflow-y-auto animate-fade-in px-6 pt-10 pb-32">
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-extrabold tracking-tight ${theme.darkText}`}>Hồ sơ</h2>
                <button onClick={() => { onLogout(); setCurrentView('home'); }} className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-stone-800"><LogOut size={16}/></button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center mb-6">
                <div className={`w-16 h-16 mx-auto bg-stone-50 rounded-full border-2 border-stone-200 flex items-center justify-center mb-3`}><User size={24} className="text-stone-400" /></div>
                <h3 className="font-extrabold text-lg">{currentUser?.name}</h3>
                <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest mt-1">Khách hàng VIP</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-stone-50">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Giao hàng</h3>
                    <button onClick={() => { if(isEditingProfile) handleSaveProfile(); setIsEditingProfile(!isEditingProfile); }} className="text-[10px] font-bold text-[#121212] uppercase underline">{isEditingProfile ? 'Lưu' : 'Sửa'}</button>
                </div>
                <div className="space-y-4">
                    {['email', 'phone', 'address'].map(field => (
                        <div key={field}>
                            <p className="text-[9px] font-medium text-stone-400 uppercase mb-1">{field === 'address' ? 'Địa chỉ' : field === 'phone' ? 'SĐT' : 'Email'}</p>
                            {isEditingProfile ? (
                                <input value={profileData[field]} onChange={e => setProfileData({...profileData, [field]: e.target.value})} className="w-full p-2.5 bg-stone-50 border border-stone-100 rounded-lg text-xs font-bold outline-none focus:border-stone-300" />
                            ) : (
                                <p className="text-xs font-extrabold text-stone-800">{profileData[field]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <h3 className="font-extrabold text-sm px-1">Lịch sử đơn hàng</h3>
                {myOrders.length === 0 ? <p className="text-center py-6 text-xs text-stone-400">Chưa có đơn hàng</p> : myOrders.map(o => (
                    <div key={o.id} className="bg-white p-4 rounded-xl border border-stone-100 flex justify-between items-center shadow-sm">
                        <div>
                            <p className="font-extrabold text-sm">#{o.id}</p>
                            <p className="text-[9px] text-stone-400 font-medium mt-0.5">{new Date(o.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <p className="font-extrabold text-sm">{o.total_amount.toLocaleString()}đ</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`h-full relative flex flex-col ${theme.light}`}>
            {/* GLOBAL HEADER */}
            {currentView !== 'custom' && (
                <header className="shrink-0 sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-100 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className={`text-[9px] font-extrabold ${theme.goldText} uppercase tracking-[0.3em]`}>Leather Craft</h2>
                        <h1 className={`text-2xl font-black ${theme.darkText} tracking-tighter uppercase italic mt-0.5 leading-none`}>H.MADE</h1>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-[#121212] active:scale-95 transition-all shadow-sm`}><MessageCircle size={16} /></button>
                    </div>
                </header>
            )}

            <main className="flex-1 overflow-hidden relative z-0">
                <div key={currentView} className="w-full h-full bg-[#FAFAFA]">
                    {currentView === 'home' && renderStorefront()}
                    {currentView === 'discover' && renderDiscover()}
                    {currentView === 'promos' && renderPromos()}
                    {currentView === 'custom' && renderCustomRoom()}
                    {currentView === 'cart' && renderCart()}
                    {currentView === 'profile' && renderProfile()}
                </div>
            </main>
            
            <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {/* GLOBAL BOTTOM NAV - 5 NÚT - LUÔN MÀU ĐEN */}
            {currentView !== 'custom' && (
                <div className="absolute bottom-6 left-6 right-6 h-[64px] bg-white/90 backdrop-blur-xl rounded-2xl flex items-center justify-around px-2 z-50 border border-stone-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                    <button onClick={() => setCurrentView('home')} className={`transition-colors p-2 ${currentView === 'home' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><Home size={22} /></button>
                    <button onClick={() => setCurrentView('discover')} className={`transition-colors p-2 ${currentView === 'discover' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><Compass size={22} /></button>
                    <button onClick={() => setCurrentView('promos')} className={`transition-colors p-2 ${currentView === 'promos' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><Gift size={22} /></button>
                    <button onClick={() => setCurrentView('cart')} className={`relative transition-colors p-2 ${currentView === 'cart' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}>
                        <ShoppingCart size={22} />
                        {cart.length > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#CFA34D] rounded-full text-[8px] font-bold flex items-center justify-center text-white border border-white">{cart.length}</span>}
                    </button>
                    <button onClick={() => handleProtectedNavigation('profile')} className={`transition-colors p-2 ${currentView === 'profile' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><User size={22} /></button>
                </div>
            )}

            {/* Modal Danh sách mã ưu đãi - Đã chuyển ra ngoài để không bị che bởi Bottom Nav */}
            {isPromoSelectorOpen && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end animate-fade-in">
                    <div className="bg-white w-full rounded-t-[2.5rem] p-6 pb-12 animate-slide-up shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg uppercase tracking-tight text-[#121212]">Mã đã lưu</h3>
                            <button onClick={() => setIsPromoSelectorOpen(false)} className="p-2 bg-stone-50 rounded-full active:scale-95"><X size={16}/></button>
                        </div>
                        <div className="space-y-3 max-h-[40vh] overflow-y-auto scrollbar-hide">
                            {savedPromos.length === 0 ? <p className="text-center text-[10px] font-bold uppercase tracking-widest text-stone-300 py-4">Chưa có mã nào</p> : null}
                            {fallbackPromos.filter(p => savedPromos.includes(p.id)).map(p => (
                                <div key={p.id} onClick={() => { setAppliedPromoCode(p.code); setIsPromoSelectorOpen(false); applyPromoCode(p.code); }} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex justify-between items-center active:scale-95 transition-transform cursor-pointer hover:border-[#121212]">
                                    <div>
                                        <p className="font-black text-sm text-[#121212]">{p.code}</p>
                                        <p className="text-[10px] font-medium text-stone-500 mt-1">{p.title}</p>
                                    </div>
                                    <span className="text-[9px] font-bold text-[#CFA34D] uppercase tracking-widest bg-[#CFA34D]/10 px-3 py-1.5 rounded-lg">Chọn</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 4. COMPONENT: LOGIN MODAL
// ==========================================
const LoginModal = ({ isOpen, onClose, onLogin, showToast }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setUsername('');
            setPassword('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            onLogin({ id: 1, role: 'admin', name: 'Quản trị viên' });
        } else if (username === 'khach' && password === 'khach123') {
            onLogin({ id: 2, role: 'customer', name: 'Khách hàng' });
        } else {
            showToast('Tài khoản hoặc mật khẩu không chính xác', 'error');
        }
    };

    return (
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end animate-fade-in`}>
            <div className={`bg-white w-full rounded-t-[2.5rem] p-8 pb-12 animate-slide-up shadow-2xl`}>
                <button type="button" onClick={onClose} className="absolute top-6 right-6 p-2 text-stone-400 bg-stone-50 rounded-full active:scale-95 transition-transform"><X size={18}/></button>
                <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-6"></div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-[#121212]">Đăng nhập</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm outline-none focus:border-[#121212]" placeholder="Tài khoản (admin/khach)" required />
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm outline-none focus:border-[#121212]" placeholder="Mật khẩu (admin123/khach123)" required />
                    <button type="submit" className={`bg-[#121212] w-full py-4 text-white rounded-xl font-bold text-sm mt-2 shadow-md active:scale-[0.98] transition-transform uppercase tracking-widest`}>Xác nhận</button>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// 5. MAIN APP (IPHONE WRAPPER & TOAST)
// ==========================================
export default function App() {
    const [currentUser, setCurrentUser] = useState(null); 
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [materials] = useState(fallbackMaterials);
    const [products] = useState(fallbackProducts);
    const [orders, setOrders] = useState([]);
    
    // Toast State
    const [toast, setToast] = useState({ message: '', type: '', id: 0 });

    const showToast = (message, type = 'success') => {
        setToast({ message, type, id: Date.now() });
    };

    useEffect(() => {
        if (toast.message) {
            const timer = setTimeout(() => setToast({ message: '', type: '', id: 0 }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.id]);

    const handleLogin = (userData) => {
        setIsLoginModalOpen(false); setIsTransitioning(true);
        setTimeout(() => { 
            setCurrentUser(userData); 
            setIsTransitioning(false); 
            showToast(`Chào mừng ${userData.name}!`, 'success');
        }, 400);
    };

    const handleLogout = () => {
        setIsTransitioning(true);
        setTimeout(() => { 
            setCurrentUser(null); 
            setIsTransitioning(false); 
            showToast('Đã đăng xuất thành công', 'success');
        }, 400);
    };

    const handlePlaceOrder = (newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
    };

    return (
        <div className={`min-h-screen bg-[#E5E5E5] flex items-center justify-center p-4 sm:p-8 relative`}>
            {/* CSS TỐI ƯU VÀ TOAST ANIMATION */}
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800;900&display=swap');
                * { font-family: 'Outfit', sans-serif; scrollbar-width: none !important; -ms-overflow-style: none !important; }
                ::-webkit-scrollbar { display: none !important; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slide-left { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes drop-in { from { transform: translate(-50%, -20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-slide-left { animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-drop-in { animation: drop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}} />

            {/* IPHONE MOCKUP */}
            <div className="w-full max-w-[400px] h-[850px] max-h-[90vh] bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] relative overflow-hidden border-[12px] border-[#121212] flex flex-col shrink-0 ring-1 ring-white/50">
                
                {/* TOAST NOTIFICATION */}
                {toast.message && (
                    <div key={toast.id} className="absolute top-14 left-1/2 -translate-x-1/2 z-[1000] animate-drop-in w-max max-w-[90%]">
                        <div className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border shadow-xl ${toast.type === 'success' ? 'bg-[#121212] border-stone-800 text-white' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            {toast.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 text-[#CFA34D]" /> : <AlertTriangle size={16} className="shrink-0" />}
                            <span className="text-xs font-bold tracking-wide leading-tight">{toast.message}</span>
                        </div>
                    </div>
                )}

                <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-[500] pointer-events-none"><div className="w-28 h-6 bg-[#121212] rounded-b-[1.25rem]"></div></div>
                <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col pt-0">
                    <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} showToast={showToast} />
                    {isTransitioning && (
                        <div className={`absolute inset-0 bg-white/90 backdrop-blur-sm z-[300] flex flex-col items-center justify-center animate-fade-in`}>
                            <div className="w-8 h-8 border-4 border-stone-200 border-t-[#121212] rounded-full animate-spin"></div>
                        </div>
                    )}
                    <div className="w-full h-full overflow-hidden relative">
                        {currentUser?.role === 'admin' ? (
                            <AdminDashboard onLogout={handleLogout} currentUser={currentUser} materials={materials} transactions={[]} orders={orders} refreshData={() => {}} supabaseClient={null} showToast={showToast} />
                        ) : (
                            <CustomerPortal onLoginClick={() => setIsLoginModalOpen(true)} onLogout={handleLogout} currentUser={currentUser} products={products} materials={materials} orders={orders} onPlaceOrder={handlePlaceOrder} supabaseClient={null} showToast={showToast} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}