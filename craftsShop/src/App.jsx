import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { 
    LayoutDashboard, PackageSearch, ShoppingCart, Users,
    Menu, X, Bell, Plus, ChevronLeft, Wrench, CreditCard, 
    Home, LogOut, Lock, User, Package, Trash2, ArrowRight,
    Download, Upload, History, ClipboardList, AlertTriangle, 
    Search, CheckCircle2, Clock, MapPin, Edit3, Compass, Info,
    MessageCircle, Send, Sparkles, Smartphone, Award, Ticket, 
    Gift, Tag, Percent, Layers, ImagePlus, Check, BookOpen, Calendar, Zap
} from 'lucide-react';

// Custom SVG Icons
const FacebookIcon = memo(({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
));

const InstagramIcon = memo(({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
));

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
    { id: 4, name: 'Ví Dài Cầm Tay', base_price: 850000, category_id: 'Ví da', is_hot: false, image_url: 'https://images.unsplash.com/photo-1559564104-e58777085a6a?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Túi Tote Mini', base_price: 1250000, category_id: 'Túi xách', is_hot: true, image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80' }
];

const fallbackMaterials = [
    { id: 1, name: 'Da Bò Epsom', type: 'leather', stock_qty: 15, unit: 'Tấm', color_code: '#8B4513', image_url: 'https://images.unsplash.com/photo-1606115915130-b9a1ec093155?auto=format&fit=crop&w=300&q=80' },
    { id: 2, name: 'Da Bê Swift', type: 'leather', stock_qty: 2, unit: 'Tấm', color_code: '#1A1A1A', image_url: 'https://images.unsplash.com/photo-1552689486-f6773047d58b?auto=format&fit=crop&w=300&q=80' },
    { id: 3, name: 'Chỉ Sáp Trắng', type: 'thread', stock_qty: 50, unit: 'Cuộn', color_code: '#F9F7F3' },
    { id: 4, name: 'Chỉ Sáp Nâu', type: 'thread', stock_qty: 30, unit: 'Cuộn', color_code: '#5C3A21' }
];

const fallbackArticles = [
    {
        id: 1,
        title: '5 Bước bảo quản đồ da thủ công luôn như mới',
        excerpt: 'Đồ da thủ công cần sự chăm sóc đặc biệt để giữ được độ bóng và bền màu theo thời gian...',
        content: `Đồ da thủ công không chỉ là vật dụng, mà là một tác phẩm nghệ thuật. Để giữ cho tác phẩm ấy luôn bền đẹp, bạn cần lưu ý:\n\n1. Tránh để da tiếp xúc trực tiếp với ánh nắng mặt trời quá lâu.\n2. Vệ sinh bằng khăn mềm hơi ẩm, tuyệt đối không dùng cồn.\n3. Dưỡng da bằng mỡ cừu hoặc kem chuyên dụng mỗi 3 tháng.\n4. Nếu da bị ướt, hãy để khô tự nhiên ở nơi thoáng gió.\n5. Cất giữ trong túi vải breath-able khi không sử dụng.`,
        image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        date: '20/05/2024',
        read_time: '4 phút đọc'
    },
    {
        id: 2,
        title: 'Nghệ thuật khâu tay Saddle Stitch là gì?',
        excerpt: 'Saddle Stitch là kỹ thuật khâu bằng hai cây kim, tạo nên đường chỉ vô cùng bền chắc...',
        content: `Saddle Stitch (Khâu yên ngựa) là niềm tự hào của những nghệ nhân làm da thủ công. Khác với may máy, nếu một mắt xích bị đứt, toàn bộ đường may máy sẽ bị tuột.\n\nỞ Saddle Stitch, mỗi mũi khâu là một nút thắt độc lập. Nếu một sợi chỉ bị đứt, sợi kia vẫn giữ chặt các lớp da với nhau. Đây chính là lý do vì sao các sản phẩm xa xỉ từ H.MADE luôn có độ bền vượt thời gian.`,
        image_url: 'https://images.unsplash.com/photo-1606115915130-b9a1ec093155?auto=format&fit=crop&w=800&q=80',
        date: '15/05/2024',
        read_time: '6 phút đọc'
    },
    {
        id: 3,
        title: 'Cách phân biệt Da thật và Da PU (Giả da)',
        excerpt: 'Chỉ với 3 mẹo đơn giản, bạn có thể tự mình nhận biết được da bò thật 100%...',
        content: `Thị trường hiện nay có rất nhiều sản phẩm giả da (PU, Simili) được làm tinh vi. Để không mua nhầm, hãy chú ý:\n\n1. Nhìn bề mặt: Da thật có lỗ chân lông li ti, vân da không đều hoàn toàn.\n2. Ngửi mùi: Da thật có mùi ngai ngái đặc trưng của động vật.\n3. Thử nước: Nhỏ 1 giọt nước, da thật sẽ hơi thấm và loang ra, da PU sẽ trượt đi.\nTại H.MADE, chúng tôi cam kết sử dụng 100% da thật nhập khẩu.`,
        image_url: 'https://images.unsplash.com/photo-1559564104-e58777085a6a?auto=format&fit=crop&w=800&q=80',
        date: '10/05/2024',
        read_time: '5 phút đọc'
    }
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

const membershipTiers = [
    { id: 'silver', name: 'Hội Viên Silver', points: '0 - 5.000 điểm', benefits: ['Tích điểm 1% mỗi đơn hàng', 'Quà sinh nhật 100K'], bg: 'bg-gradient-to-br from-stone-200 to-stone-300', text: 'text-stone-800', icon: 'text-stone-600', badge: 'text-stone-500' },
    { id: 'gold', name: 'Hội Viên Gold', points: '5.000 - 20.000 điểm', benefits: ['Tích điểm 3% mỗi đơn hàng', 'Giảm 5% toàn bộ sản phẩm', 'Quà sinh nhật 300K'], bg: 'bg-gradient-to-br from-[#E5C158] to-[#CFA34D]', text: 'text-white', icon: 'text-white/90', badge: 'text-white/80' },
    { id: 'diamond', name: 'Hội Viên Diamond', points: 'Trên 20.000 điểm', benefits: ['Tích điểm 5% mỗi đơn hàng', 'Giảm 10% toàn bộ sản phẩm', 'Quà sinh nhật 1.000K', 'Bảo dưỡng tận nhà miễn phí'], bg: 'bg-gradient-to-br from-[#2A2A2A] to-[#121212]', text: 'text-[#CFA34D]', icon: 'text-[#CFA34D]/90', badge: 'text-stone-400' },
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
// CHAT BOT
// ==========================================
const ChatBot = memo(({ isOpen, onClose, initialContext }) => {
    const [messages, setMessages] = useState([{ id: 1, text: "Chào bạn! Tôi là trợ lý H.MADE. Bạn cần tư vấn gì ạ?", sender: 'bot' }]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    // Tự động điền nội dung nếu mở chat từ một đơn hàng cụ thể
    useEffect(() => {
        if (isOpen && initialContext) {
            setInput(`Tôi cần hỗ trợ về đơn hàng #${initialContext}`);
        }
    }, [isOpen, initialContext]);

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
});

// ==========================================
// SHARED FOOTER
// ==========================================
const InformationFooter = memo(() => (
    <div className="px-5 mt-10 mb-28">
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
));

// ==========================================
// ADMIN DASHBOARD
// ==========================================
const AdminDashboard = ({ onLogout, currentUser, materials, transactions, orders, refreshData, supabaseClient, showToast, promos, setPromos, panels, setPanels, products }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [invTab, setInvTab] = useState('stock'); 
    const [showTxModal, setShowTxModal] = useState(false);
    const [txType, setTxType] = useState('import'); 
    const [txMatId, setTxMatId] = useState('');
    const [txQty, setTxQty] = useState(1);
    const [txNote, setTxNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // State quản lý Modal chỉnh sửa Promo & Panel
    const [promoModalOpen, setPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [panelModalOpen, setPanelModalOpen] = useState(false);
    const [editingPanel, setEditingPanel] = useState(null);

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

    // Hàm xử lý lưu Promo
    const handleSavePromo = (e) => {
        e.preventDefault();
        if (editingPromo.id) {
            setPromos(promos.map(p => p.id === editingPromo.id ? editingPromo : p));
            showToast('Đã cập nhật Ưu đãi thành công', 'success');
        } else {
            setPromos([{ ...editingPromo, id: Date.now() }, ...promos]);
            showToast('Đã thêm Ưu đãi mới', 'success');
        }
        setPromoModalOpen(false);
    };

    // Hàm xử lý lưu Panel
    const handleSavePanel = (e) => {
        e.preventDefault();
        if (editingPanel.id) {
            setPanels(panels.map(p => p.id === editingPanel.id ? editingPanel : p));
            showToast('Đã cập nhật Banner thành công', 'success');
        } else {
            setPanels([...panels, { ...editingPanel, id: Date.now() }]);
            showToast('Đã thêm Banner mới', 'success');
        }
        setPanelModalOpen(false);
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
                            {m.image_url ? <img src={m.image_url} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="w-full h-full object-cover" alt=""/> : <div className="w-8 h-8 rounded-full opacity-40" style={{backgroundColor: m.color_code}}></div>}
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
                <button onClick={() => { setEditingPromo({code:'', title:'', desc:'', type:'percent', value:0.1, exp:''}); setPromoModalOpen(true); }} className={`w-8 h-8 rounded-full ${theme.dark} text-white flex items-center justify-center shadow-lg active:scale-90`}><Plus size={16}/></button>
            </div>
            <div className="space-y-4">
                {promos.map(p => (
                    <div key={p.id} className="bg-white p-5 rounded-[1.5rem] border border-stone-200/60 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100"><Ticket size={20}/></div>
                            <div>
                                <h4 className="font-extrabold text-sm">{p.code}</h4>
                                <p className="text-[10px] font-medium text-stone-500 mt-0.5 max-w-[120px] truncate">{p.title}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingPromo(p); setPromoModalOpen(true); }} className="px-3 py-1 bg-stone-50 border border-stone-200 text-stone-600 rounded-md text-[9px] font-bold active:scale-95">Sửa</button>
                            <button onClick={() => setPromos(promos.filter(item => item.id !== p.id))} className="px-3 py-1 bg-red-50 text-red-500 rounded-md text-[9px] font-bold active:scale-95">Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPanelsAdmin = () => (
        <div className="h-full overflow-y-auto space-y-6 animate-fade-in pb-32 px-5 pt-6">
            <div className="flex justify-between items-center px-1">
                <h2 className={`text-2xl font-black ${theme.darkText} tracking-tight`}>Quản lý Giao diện</h2>
                <button onClick={() => { setEditingPanel({img:'', tag:'', title:'', sub:'', actionType:'promo', actionId:''}); setPanelModalOpen(true); }} className={`w-8 h-8 rounded-full ${theme.dark} text-white flex items-center justify-center shadow-lg active:scale-90`}><Plus size={16}/></button>
            </div>
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Panels Trang Chủ</h3>
                {panels.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-[1.5rem] border border-stone-200/60 shadow-sm flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden relative bg-stone-100">
                            <img src={p.img} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="w-full h-full object-cover opacity-80" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                            <span className="text-[8px] font-black uppercase text-[#CFA34D] bg-[#CFA34D]/10 px-2 py-0.5 rounded w-fit mb-1 truncate max-w-full">{p.tag}</span>
                            <h4 className="font-extrabold text-sm text-stone-800 truncate">{p.title}</h4>
                            <p className="text-[10px] text-stone-400 mt-0.5 truncate">{p.sub}</p>
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => { setEditingPanel(p); setPanelModalOpen(true); }} className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-md text-[9px] font-bold text-stone-600">Sửa</button>
                                <button onClick={() => setPanels(panels.filter(item => item.id !== p.id))} className="px-3 py-1 bg-red-50 text-red-500 rounded-md text-[9px] font-bold">Xóa</button>
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

                {/* MODAL FORM: CHỈNH SỬA ƯU ĐÃI */}
                {promoModalOpen && (
                    <div className="absolute inset-0 z-[100] bg-white animate-slide-left flex flex-col">
                        <header className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-white shadow-sm z-10">
                            <h3 className="font-black text-lg">{editingPromo?.id ? 'Sửa Mã Ưu Đãi' : 'Thêm Mã Mới'}</h3>
                            <button onClick={() => setPromoModalOpen(false)} className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors"><X size={16}/></button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-5 pb-20">
                            <form onSubmit={handleSavePromo} className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-stone-500 uppercase">Mã Khuyến Mãi (Code)</label>
                                    <input required value={editingPromo.code} onChange={e=>setEditingPromo({...editingPromo, code: e.target.value.toUpperCase()})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 font-bold text-sm outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder="VD: SUMMER20" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-stone-500 uppercase">Tiêu đề</label>
                                    <input required value={editingPromo.title} onChange={e=>setEditingPromo({...editingPromo, title: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder="VD: Giảm 20% Đơn Đầu" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-stone-500 uppercase">Mô tả chi tiết</label>
                                    <textarea required value={editingPromo.desc} onChange={e=>setEditingPromo({...editingPromo, desc: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm outline-none focus:ring-2 focus:ring-[#CFA34D]/30" rows="2" placeholder="VD: Áp dụng cho khách hàng mới..." />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-stone-500 uppercase">Loại giảm giá</label>
                                        <select value={editingPromo.type} onChange={e=>setEditingPromo({...editingPromo, type: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#CFA34D]/30">
                                            <option value="percent">Phần trăm (%)</option>
                                            <option value="fixed">Tiền mặt (VNĐ)</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-stone-500 uppercase">Giá trị giảm</label>
                                        <input type="number" required step="0.01" value={editingPromo.value} onChange={e=>setEditingPromo({...editingPromo, value: Number(e.target.value)})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder={editingPromo.type === 'percent' ? "VD: 0.2 (20%)" : "VD: 50000"} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-stone-500 uppercase">Hạn sử dụng</label>
                                    <input required type="text" value={editingPromo.exp} onChange={e=>setEditingPromo({...editingPromo, exp: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder="VD: 31/12/2026" />
                                </div>
                                
                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-[#121212] text-white rounded-[1.25rem] font-bold uppercase text-[11px] tracking-widest active:scale-95 transition-transform shadow-lg">Lưu Ưu Đãi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL FORM: CHỈNH SỬA BANNER */}
                {panelModalOpen && (
                    <div className="absolute inset-0 z-[100] bg-white animate-slide-left flex flex-col">
                        <header className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-white shadow-sm z-10">
                            <h3 className="font-black text-lg">{editingPanel?.id ? 'Sửa Banner' : 'Thêm Banner Mới'}</h3>
                            <button onClick={() => setPanelModalOpen(false)} className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors"><X size={16}/></button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-5 pb-20">
                            <form onSubmit={handleSavePanel} className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-stone-500 uppercase">Link Ảnh (URL)</label>
                                    <input required value={editingPanel.img} onChange={e=>setEditingPanel({...editingPanel, img: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 font-medium text-[11px] outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder="https://..." />
                                    {editingPanel.img && (
                                        <div className="mt-3 relative rounded-xl overflow-hidden border border-stone-100 h-28">
                                            <img src={editingPanel.img} className="w-full h-full object-cover" onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-stone-500 uppercase">Nhãn (Tag)</label>
                                        <input required value={editingPanel.tag} onChange={e=>setEditingPanel({...editingPanel, tag: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder="VD: Sản phẩm tiêu biểu" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-stone-500 uppercase">Tiêu đề (Title)</label>
                                        <input required value={editingPanel.title} onChange={e=>setEditingPanel({...editingPanel, title: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm font-black outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder="VD: Bộ sưu tập hè" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-stone-500 uppercase">Mô tả ngắn (Sub)</label>
                                    <input required value={editingPanel.sub} onChange={e=>setEditingPanel({...editingPanel, sub: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm outline-none focus:ring-2 focus:ring-[#CFA34D]/30" placeholder="VD: Khám phá ngay hôm nay..." />
                                </div>
                                
                                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                                    <label className="text-[10px] font-bold text-stone-800 uppercase tracking-widest block mb-3">Hành động khi nhấn Banner</label>
                                    <div className="space-y-4">
                                        <select value={editingPanel.actionType} onChange={e=>setEditingPanel({...editingPanel, actionType: e.target.value})} className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm font-bold outline-none focus:ring-2 focus:ring-[#121212]/20">
                                            <option value="promo">Chuyển đến Kho Ưu đãi</option>
                                            <option value="product">Chuyển đến một Sản phẩm cụ thể</option>
                                        </select>
                                        {editingPanel.actionType === 'product' && (
                                            <select value={editingPanel.actionId || ''} onChange={e=>setEditingPanel({...editingPanel, actionId: Number(e.target.value)})} className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm font-bold outline-none focus:ring-2 focus:ring-[#121212]/20">
                                                <option value="" disabled>-- Chọn sản phẩm đích --</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="pt-4">
                                    <button type="submit" className="w-full py-4 bg-[#121212] text-white rounded-[1.25rem] font-bold uppercase text-[11px] tracking-widest active:scale-95 transition-transform shadow-lg">Lưu Banner</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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
// CUSTOMER PORTAL
// ==========================================
const CustomerPortal = ({ onLoginClick, onLogout, currentUser, products, orders, materials, onPlaceOrder, supabaseClient, showToast, promos, panels }) => {
    const [currentView, setCurrentView] = useState('home'); 
    const [previousView, setPreviousView] = useState('home');
    const navigateTo = useCallback((newView) => { setPreviousView(currentView); setCurrentView(newView); }, [currentView]);

    const [customProduct, setCustomProduct] = useState(null);
    const [addKeychain, setAddKeychain] = useState(false);
    const [addNFC, setAddNFC] = useState(false);
    const [selectedLeather, setSelectedLeather] = useState(null);
    const [selectedThread, setSelectedThread] = useState(null);
    const [engraving, setEngraving] = useState('');
    const [cart, setCart] = useState([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedCartItems, setSelectedCartItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    
    const [promoTab, setPromoTab] = useState('vouchers');
    const [savedPromos, setSavedPromos] = useState([]);
    const [appliedPromoCode, setAppliedPromoCode] = useState('');
    const [activePromo, setActivePromo] = useState(null);
    const [isPromoSelectorOpen, setIsPromoSelectorOpen] = useState(false);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ email: '', phone: '', address: '' });
    
    // State lưu ngữ cảnh chat (VD: ID Đơn hàng)
    const [chatContext, setChatContext] = useState(null);

    const [currentPanel, setCurrentPanel] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ h: 2, m: 15, s: 30 });

    const handleProtectedNavigation = (view) => {
        if (!currentUser) onLoginClick();
        else navigateTo(view);
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

    const leathers = materials.filter(m => m.type === 'leather');
    const threads = materials.filter(m => m.type === 'thread');

    useEffect(() => {
        if (leathers.length > 0 && !selectedLeather) setSelectedLeather(leathers[0]);
        if (threads.length > 0 && !selectedThread) setSelectedThread(threads[0]);
    }, [materials]);

    useEffect(() => {
        if(currentView !== 'home' || panels.length === 0) return;
        const timer = setInterval(() => setCurrentPanel((prev) => (prev + 1) % panels.length), 4000);
        return () => clearInterval(timer);
    }, [currentView, panels.length]);

    useEffect(() => {
        if(currentView !== 'home') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { h, m, s } = prev;
                if (s > 0) s--;
                else if (m > 0) { m--; s = 59; }
                else if (h > 0) { h--; m = 59; s = 59; }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentView]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const totalPrice = (customProduct?.base_price || 0) + (addKeychain ? 150000 : 0) + (addNFC ? 80000 : 0);
    const checkoutTotal = cart.filter(item => selectedCartItems.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
    const discountAmount = activePromo ? (activePromo.type === 'percent' ? checkoutTotal * activePromo.value : activePromo.value) : 0;
    const finalTotal = Math.max(0, checkoutTotal - discountAmount);

    const applyPromoCode = (codeToApply = appliedPromoCode) => {
        const promo = promos.find(p => p.code.toUpperCase() === codeToApply.toUpperCase());
        if (promo) {
            if(promo.type === 'fixed' && checkoutTotal < 2000000) { 
                showToast('Mã này chỉ áp dụng cho đơn từ 2.000.000đ', 'error'); return; 
            }
            setActivePromo(promo); setAppliedPromoCode(promo.code);
            showToast(`Đã áp dụng mã ${promo.code}`, 'success');
        } else {
            showToast('Mã ưu đãi không hợp lệ', 'error'); setActivePromo(null);
        }
    };

    const handleSavePromo = (promoId) => {
        setSavedPromos([...savedPromos, promoId]); showToast('Đã lưu mã ưu đãi vào ví!', 'success');
    };

    const openCustomRoom = (product = null, editItem = null) => {
        if (editItem) {
            setEditingItemId(editItem.id); setCustomProduct(editItem.product); setSelectedLeather(editItem.leather);
            setSelectedThread(editItem.thread); setEngraving(editItem.engraving || '');
            setAddKeychain(editItem.addKeychain || false); setAddNFC(editItem.addNFC || false);
        } else {
            setEditingItemId(null); setCustomProduct(product || products[0]); setSelectedLeather(leathers[0]);
            setSelectedThread(threads[0]); setEngraving(''); setAddKeychain(false); setAddNFC(false);
        }
        navigateTo('custom');
    };

    const handleAddToCart = () => {
        const newItem = { id: editingItemId || Date.now(), product: customProduct, leather: selectedLeather, thread: selectedThread, engraving, addKeychain, addNFC, price: totalPrice, qty: 1 };
        if (editingItemId) { setCart(cart.map(item => item.id === editingItemId ? newItem : item)); setEditingItemId(null); showToast('Đã cập nhật thay đổi', 'success'); } 
        else { setCart([...cart, newItem]); setSelectedCartItems(prev => [...prev, newItem.id]); showToast('Đã thêm vào túi hàng', 'success'); }
        navigateTo('cart');
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
            setSelectedCartItems([]); setActivePromo(null); setAppliedPromoCode('');
            setIsCheckingOut(false); navigateTo('profile');
        }, 1200);
    };

    const handleOpenChatForOrder = (orderId) => {
        setChatContext(orderId);
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        // Xóa context sau khi đóng modal một chút để tránh giật UI
        setTimeout(() => setChatContext(null), 300);
    };

    const handleSaveProfile = () => { 
        setIsEditingProfile(false); 
        showToast('Cập nhật thông tin thành công!', 'success');
    };

    const categories = ['Tất cả', 'Flash Sale', ...new Set(products.map(p => p.category_id))];
    const filteredProducts = useMemo(() => products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tất cả' || 
                                (selectedCategory === 'Flash Sale' ? p.is_hot : p.category_id === selectedCategory);
        return matchesSearch && matchesCategory;
    }), [products, searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const myOrders = orders.filter(o => o.user_id === currentUser?.id);

    const renderStorefront = () => (
        <div className="h-full overflow-y-auto animate-fade-in pb-24 relative">
            
            {/* 1. TÌM KIẾM & DANH MỤC (STICKY TOP) */}
            <div className="px-5 pt-4 pb-2 sticky top-0 z-20 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-stone-100/80 mb-4">
                <div className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-stone-200 rounded-2xl py-3 pl-11 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-[#CFA34D]/30 transition-all shadow-sm font-medium" />
                </div>
                <div className="overflow-x-auto scrollbar-hide flex gap-2">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCategory === cat ? (cat === 'Flash Sale' ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'bg-[#121212] text-[#CFA34D] shadow-md') : 'bg-white text-stone-500 border border-stone-200'}`}>
                            {cat === 'Flash Sale' && <Zap size={10} className="inline mr-1 mb-[2px]"/>}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. CHỨC NĂNG MỚI: FLASH SALE LÊN ĐẦU */}
            <div className="px-5 mb-6">
                <div onClick={() => setSelectedCategory('Flash Sale')} className="bg-gradient-to-r from-red-600 to-rose-500 rounded-[1.5rem] p-5 text-white shadow-[0_10px_30px_rgba(220,38,38,0.2)] relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
                    <div className="absolute right-0 top-0 opacity-20 transform translate-x-4 -translate-y-4"><Zap size={100} /></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={18} className="fill-white" />
                                <h3 className="font-black italic uppercase tracking-wider text-base">Flash Sale</h3>
                            </div>
                            <div className="flex gap-1.5 font-black text-xs items-center">
                                <span className="text-[9px] uppercase tracking-widest opacity-90 mr-1">Còn:</span>
                                <span className="bg-white text-red-600 px-2 py-1 rounded-md min-w-[28px] text-center">{String(timeLeft.h).padStart(2, '0')}</span>:
                                <span className="bg-white text-red-600 px-2 py-1 rounded-md min-w-[28px] text-center">{String(timeLeft.m).padStart(2, '0')}</span>:
                                <span className="bg-white text-red-600 px-2 py-1 rounded-md min-w-[28px] text-center">{String(timeLeft.s).padStart(2, '0')}</span>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-1.5 border border-white/20">
                            <span className="text-[9px] font-black uppercase tracking-widest">Săn ngay</span>
                            <ArrowRight size={12} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PANELS SLIDER */}
            {panels.length > 0 && (
                <div className="px-5 mb-8">
                    <div onClick={() => {
                        const panel = panels[currentPanel];
                        if(panel?.actionType === 'product') {
                            const prod = products.find(p => p.id === panel.actionId);
                            if(prod) openCustomRoom(prod);
                        } else navigateTo('promos');
                    }} className="relative h-[220px] rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] group cursor-pointer bg-stone-100 border border-stone-100">
                        {panels.map((panel, idx) => (
                            <img key={panel.id} src={panel.img} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentPanel ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} alt="" />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                            <span className="bg-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-2 inline-block shadow-lg transition-all">{panels[currentPanel]?.tag}</span>
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic drop-shadow-md leading-tight mb-2 transition-all">{panels[currentPanel]?.title}</h3>
                        </div>
                        {/* Dots Indicator */}
                        <div className="absolute bottom-5 right-5 flex gap-1.5 z-20">
                            {panels.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPanel ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-white/50'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. KẾT QUẢ SẢN PHẨM & PHÂN TRANG */}
            <div className="px-5 min-h-[380px]">
                <div className="flex justify-between items-end mb-4">
                    <h3 className={`font-black ${theme.darkText} uppercase tracking-tighter text-xl italic flex items-center gap-2`}>
                        {selectedCategory === 'Flash Sale' ? <><Zap size={20} className="text-red-500 fill-red-500"/> Săn Sale</> : (searchQuery ? 'Kết quả tìm kiếm' : 'Bộ sưu tập')}
                    </h3>
                </div>
                
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-[1.5rem] p-8 text-center border border-stone-100 shadow-sm flex flex-col items-center justify-center h-[200px]">
                        <PackageSearch size={32} className="text-stone-300 mb-3"/>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Không tìm thấy sản phẩm</p>
                    </div>
                ) : (
                    <>
                        <div key={`${currentPage}-${selectedCategory}`} className="grid grid-cols-2 gap-4 animate-fade-in">
                            {paginatedProducts.map(p => (
                                <div key={p.id} onClick={() => openCustomRoom(p)} className={`bg-white p-3.5 rounded-[1.5rem] shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-stone-100 flex flex-col gap-3 active:scale-[0.97] transition-all group cursor-pointer relative overflow-hidden`}>
                                    <div className="aspect-square rounded-xl overflow-hidden relative bg-stone-50 border border-stone-50">
                                        <img src={p.image_url || FALLBACK_IMG} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt=""/>
                                        {p.is_hot && selectedCategory === 'Flash Sale' && <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-md border border-red-400/50">-20%</div>}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <p className={`text-[9px] font-bold text-stone-400 mb-1 uppercase tracking-widest`}>{p.category_id}</p>
                                        <h4 className={`text-sm font-extrabold ${theme.darkText} leading-tight line-clamp-1 mb-1`}>{p.name}</h4>
                                        
                                        <div className="mt-auto flex items-end justify-between pt-1">
                                            <div className="flex flex-col">
                                                {p.is_hot && selectedCategory === 'Flash Sale' && <span className="text-[9px] font-bold text-stone-400 line-through mb-0.5">{p.base_price.toLocaleString()}đ</span>}
                                                <p className={`text-[13px] font-black ${p.is_hot && selectedCategory === 'Flash Sale' ? 'text-red-600' : theme.goldText}`}>
                                                    {p.is_hot && selectedCategory === 'Flash Sale' ? (p.base_price * 0.8).toLocaleString() : p.base_price.toLocaleString()}đ
                                                </p>
                                            </div>
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${p.is_hot && selectedCategory === 'Flash Sale' ? 'bg-red-50 text-red-600' : 'bg-[#121212] text-white'}`}><Plus size={14}/></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Thanh Phân Trang */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6 mb-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setCurrentPage(i + 1)} 
                                        className={`h-2 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'w-6 bg-[#CFA34D]' : 'w-2 bg-stone-200 hover:bg-stone-300'}`}
                                        aria-label={`Page ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 5. BÀI VIẾT TẠP CHÍ - CHUYỂN THÀNH VUỐT NGANG */}
            <div className="mt-10 mb-8 border-t border-stone-200/50 pt-8">
                <div className="px-5 flex justify-between items-center mb-4">
                    <h3 className={`font-black ${theme.darkText} uppercase tracking-tighter text-xl italic`}>H.MADE Journal</h3>
                    <button onClick={() => navigateTo('discover')} className="text-[10px] font-bold uppercase tracking-widest text-[#CFA34D]">Xem tất cả</button>
                </div>
                
                <div className="flex overflow-x-auto gap-4 px-5 pb-4 snap-x snap-mandatory scrollbar-hide">
                    {fallbackArticles.map(art => (
                        <div key={art.id} onClick={() => { setSelectedArticle(art); navigateTo('article_detail'); }} className="relative h-[180px] min-w-[85%] sm:min-w-[70%] rounded-[1.5rem] overflow-hidden shadow-sm group cursor-pointer snap-center shrink-0 border border-stone-100">
                            <img src={art.image_url} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt=""/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-5 right-5">
                                <h4 className="text-white font-bold text-sm leading-tight mb-1.5 drop-shadow-md line-clamp-2">{art.title}</h4>
                                <p className="text-white/70 text-[9px] uppercase tracking-widest flex items-center gap-1.5"><Clock size={10}/> {art.read_time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. KHU VỰC THÔNG TIN TIỆN ÍCH */}
            <div className="px-5 mb-8">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#121212] text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-lg">
                        <Award size={22} className="text-[#CFA34D]" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/90">Bảo hành<br/>trọn đời</span>
                    </div>
                    <div className="bg-white border border-stone-200 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                        <Package size={22} className="text-stone-700" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-stone-700">Giao hàng<br/>tận nơi</span>
                    </div>
                    <div className="bg-[#CFA34D]/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-[#CFA34D]/20">
                        <Sparkles size={22} className="text-[#CFA34D]" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#CFA34D]">Cá nhân<br/>hóa</span>
                    </div>
                </div>
            </div>

            <InformationFooter />
        </div>
    );

    const renderDiscover = () => (
        <div className="h-full overflow-y-auto animate-fade-in pb-24 bg-[#FAFAFA]">
            {/* HERO BANNER GIỚI THIỆU */}
            <div className="relative h-[280px] w-full rounded-b-[2.5rem] overflow-hidden shadow-xl border-b border-stone-200/50">
                <img src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=800&q=80" onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="absolute inset-0 w-full h-full object-cover" alt="H.MADE Craft" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-black/20"></div>
                <div className="absolute bottom-8 left-6 right-6">
                    <span className="bg-[#CFA34D] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 inline-block shadow-md">Về Chúng Tôi</span>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 drop-shadow-md">H.MADE Studio</h2>
                    <p className="text-white/90 text-[11px] font-medium leading-relaxed drop-shadow-sm">Đánh thức vẻ đẹp nguyên bản của da thật qua từng đường kim mũi chỉ thủ công.</p>
                </div>
            </div>

            <div className="px-5 mt-8 space-y-10 mb-8">
                {/* 1. TRIẾT LÝ */}
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 text-stone-900"><Info size={120} /></div>
                    <div className="w-10 h-10 bg-[#CFA34D]/10 rounded-2xl flex items-center justify-center mb-4 relative z-10">
                        <Sparkles size={18} className="text-[#CFA34D]" />
                    </div>
                    <h3 className="text-lg font-black italic uppercase mb-3 text-stone-900 relative z-10 tracking-tight">Cá nhân hóa độc bản</h3>
                    <p className="text-[11px] text-stone-500 leading-loose relative z-10 font-medium">
                        Mỗi sản phẩm tại H.MADE không chỉ là một phụ kiện, mà là một câu chuyện riêng của bạn. Chúng tôi từ chối sản xuất công nghiệp hàng loạt để giữ trọn cái hồn của đồ da thủ công. Mọi công đoạn từ chọn da, đục lỗ đến khâu tay Saddle Stitch đều được thực hiện bởi đôi bàn tay tỉ mỉ của nghệ nhân.
                    </p>
                </div>

                {/* 2. CHẤT LIỆU */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Layers size={18} className="text-[#CFA34D]" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Chất liệu tuyển chọn</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5 snap-x">
                        {leathers.map(l => (
                            <div key={l.id} className="min-w-[130px] bg-white p-3 rounded-[1.5rem] border border-stone-100 shadow-sm shrink-0 snap-start">
                                <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-stone-50 relative">
                                    {l.image_url ? <img src={l.image_url} onError={(e)=>{e.target.style.display='none'}} className="w-full h-full object-cover" alt={l.name} /> : <div className="w-full h-full" style={{backgroundColor: l.color_code}}></div>}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm"><ImagePlus size={10} className="text-stone-700"/></div>
                                </div>
                                <h4 className="font-extrabold text-xs text-stone-800">{l.name}</h4>
                                <p className="text-[9px] text-[#CFA34D] mt-1 uppercase tracking-widest font-bold">Da Nhập Khẩu</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. TẠP CHÍ */}
                <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-[#CFA34D]" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Tạp chí Leather</h3>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {fallbackArticles.map(art => (
                            <div key={art.id} onClick={() => { setSelectedArticle(art); navigateTo('article_detail'); }} className="bg-white rounded-[1.5rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex p-3 gap-4 items-center">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                                    <img src={art.image_url} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[8px] font-bold text-white uppercase tracking-widest bg-[#121212] px-2 py-0.5 rounded-md">{art.read_time}</span>
                                    </div>
                                    <h4 className="font-extrabold text-[13px] text-stone-900 leading-snug mb-1 line-clamp-2">{art.title}</h4>
                                    <p className="text-[9px] font-medium text-stone-400">{art.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 4. ĐỊA CHỈ */}
                <div className="bg-[#121212] p-7 rounded-[2rem] text-center text-white relative overflow-hidden shadow-lg mt-8">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#CFA34D]/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 relative z-10">
                        <MapPin size={20} className="text-[#CFA34D]" />
                    </div>
                    <h3 className="font-black text-xl uppercase tracking-tight mb-2 relative z-10">Ghé thăm xưởng</h3>
                    <p className="text-[11px] text-white/70 leading-relaxed mb-5 relative z-10">123 Đường Lê Lợi, Quận 1, TP.HCM<br/>Mở cửa: 09:00 - 20:00 mỗi ngày</p>
                    <button className="px-6 py-3 bg-[#CFA34D] text-[#121212] rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform w-full shadow-md relative z-10">Xem bản đồ chỉ đường</button>
                </div>
            </div>
            
            <InformationFooter />
        </div>
    );

    const renderArticleDetail = () => (
        <div className="h-full overflow-y-auto animate-slide-left pb-32 bg-white relative">
            <div className="relative h-[350px]">
                <img src={selectedArticle?.image_url} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="w-full h-full object-cover" alt=""/>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                <button onClick={() => navigateTo(previousView)} className="absolute top-8 left-8 w-10 h-10 bg-white/90 backdrop-blur-md text-[#121212] rounded-full flex items-center justify-center shadow-lg z-50 active:scale-90 transition-transform">
                    <ChevronLeft size={20} />
                </button>
            </div>
            <div className="px-8 -mt-10 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-[#CFA34D]">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{selectedArticle?.date}</span>
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{selectedArticle?.read_time}</span>
                </div>
                <h1 className="text-3xl font-black text-stone-900 leading-[1.15] mb-6 tracking-tighter">{selectedArticle?.title}</h1>
                <div className="w-12 h-1.5 bg-[#CFA34D] rounded-full mb-8"></div>
                <div className="text-sm text-stone-600 leading-loose space-y-4 whitespace-pre-wrap font-medium">
                    {selectedArticle?.content}
                </div>
                
                <div className="mt-12 p-8 bg-stone-50 rounded-[2rem] border border-stone-100 text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-[#CFA34D] mb-2">Bạn quan tâm đồ da?</p>
                    <p className="text-xs text-stone-500 mb-6">Trải nghiệm dịch vụ cá nhân hóa độc bản tại H.MADE ngay hôm nay.</p>
                    <button onClick={() => navigateTo('home')} className="bg-[#121212] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform">Khám phá ngay</button>
                </div>
            </div>
        </div>
    );

    // MÀN HÌNH ƯU ĐÃI (CẬP NHẬT CÁCH ĐĂNG KÝ HỘI VIÊN)
    const renderPromos = () => (
        <div className="h-full overflow-y-auto animate-fade-in pb-32 bg-[#FAFAFA]">
            <div className="px-6 pt-6">
                <h2 className={`text-2xl font-extrabold tracking-tight mb-4 ${theme.darkText}`}>Ưu đãi & Hội Viên</h2>
                
                {/* Tabs */}
                <div className="flex bg-stone-100 p-1.5 rounded-xl mb-6">
                    <button onClick={() => setPromoTab('vouchers')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${promoTab === 'vouchers' ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}>Mã giảm giá</button>
                    <button onClick={() => setPromoTab('membership')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${promoTab === 'membership' ? 'bg-white shadow-sm text-black' : 'text-stone-400'}`}>Đặc quyền</button>
                </div>

                {promoTab === 'vouchers' ? (
                    <div className="space-y-4 animate-fade-in">
                        {promos.map(p => {
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
                                            <button onClick={() => { setAppliedPromoCode(p.code); navigateTo('cart'); }} className="px-3 py-1.5 bg-[#121212] text-white rounded-lg text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-transform">Dùng</button>
                                            <button onClick={() => handleSavePromo(p.id)} disabled={isSaved} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors ${isSaved ? 'bg-stone-100 text-stone-400' : 'bg-stone-50 border border-stone-200 text-stone-600'}`}>{isSaved ? 'Đã lưu' : 'Lưu mã'}</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* KHU VỰC CÁC GÓI HỘI VIÊN & ĐĂNG KÝ */
                    <div className="space-y-5 animate-fade-in pb-10">
                        {currentUser ? (
                            <div className="bg-[#121212] p-5 rounded-[1.5rem] shadow-lg text-white mb-2 relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 opacity-10"><Award size={80}/></div>
                                <div className="flex justify-between items-center mb-3 relative z-10">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#CFA34D]">Điểm tích lũy của bạn</span>
                                    <span className="font-black text-lg">0 <span className="text-[10px] font-medium text-white/50">pts</span></span>
                                </div>
                                <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden relative z-10">
                                    <div className="h-full bg-[#CFA34D] w-[5%] rounded-full"></div>
                                </div>
                                <p className="text-[9px] text-white/60 mb-4 relative z-10">Cần 5.000 điểm để thăng hạng <strong className="text-white">Silver</strong></p>
                                <button onClick={() => navigateTo('home')} className="bg-[#CFA34D] text-[#121212] w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform relative z-10">Mua sắm ngay</button>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-[1.5rem] text-center mb-2 border border-stone-200 shadow-sm">
                                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Award size={24} className="text-stone-400" />
                                </div>
                                <h4 className="font-black text-sm text-[#121212] mb-1 uppercase tracking-tight">Đăng ký Thẻ Thành Viên</h4>
                                <p className="text-[11px] text-stone-500 mb-5 leading-relaxed">Tích điểm mọi đơn hàng và nhận vô vàn đặc quyền dành riêng cho bạn.</p>
                                <button onClick={onLoginClick} className="bg-[#121212] text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform w-full">Đăng ký / Đăng nhập</button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-2 mt-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Phân hạng đặc quyền</h3>
                        </div>

                        {membershipTiers.map(tier => (
                            <div key={tier.id} className={`${tier.bg} p-6 rounded-[2rem] shadow-md relative overflow-hidden border border-white/10`}>
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                                    <Award size={100} />
                                </div>
                                <h3 className={`text-xl font-black italic uppercase tracking-tighter ${tier.text} mb-1 relative z-10`}>{tier.name}</h3>
                                <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${tier.badge} relative z-10`}>{tier.points}</p>
                                
                                <div className="space-y-2.5 relative z-10">
                                    {tier.benefits.map((b, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 size={14} className={`${tier.icon} shrink-0 mt-0.5`} />
                                            <span className={`text-[11px] font-medium leading-tight ${tier.text} opacity-90`}>{b}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <InformationFooter />
        </div>
    );

    // MÀN HÌNH CUSTOM (KHÔNG ĐỔI)
    const renderCustomRoom = () => (
        <div className={`h-full flex flex-col animate-slide-left bg-[#FAFAFA] relative pb-6`}>
            
            {/* THIẾT KẾ PREVIEW ĐẸP: Dark Card, viền đứt đoạn bên trong */}
            <div className="mx-5 mt-6 mb-2 h-[45%] shrink-0 relative rounded-[2.5rem] shadow-2xl overflow-hidden bg-[#1c1c1c]">
                <img src={customProduct?.image_url || FALLBACK_IMG} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 mix-blend-overlay" alt=""/>
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

                <button onClick={() => { setEditingItemId(null); navigateTo(editingItemId ? 'cart' : previousView); }} className="absolute top-8 left-8 w-10 h-10 bg-white text-[#121212] rounded-full flex items-center justify-center shadow-lg z-50 active:scale-90 transition-transform">
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

    // MÀN HÌNH GIỎ HÀNG (CẬP NHẬT EMPTY STATE MỚI)
    const renderCart = () => (
        <div className="h-full overflow-y-auto animate-fade-in px-6 pt-10 pb-32 bg-[#FAFAFA]">
            <h2 className={`text-2xl font-extrabold tracking-tight mb-6 ${theme.darkText} uppercase italic`}>Giỏ hàng</h2>
            
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-6 animate-fade-in pb-20">
                    <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] mb-6 relative border border-stone-100">
                        <ShoppingCart size={48} className="text-stone-300" />
                        <Sparkles size={20} className="text-[#CFA34D] absolute top-6 right-6 animate-pulse" />
                    </div>
                    <h3 className="font-black text-lg text-stone-800 mb-2">Giỏ hàng đang trống</h3>
                    <p className="text-[11px] text-stone-500 text-center px-6 mb-8 leading-relaxed">Hãy lấp đầy giỏ hàng bằng những kiệt tác đồ da thủ công độc bản từ H.MADE.</p>
                    <button onClick={() => navigateTo('home')} className="bg-[#121212] text-white px-8 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform mb-12">Khám phá ngay</button>
                    
                    {/* KHU VỰC GỢI Ý SẢN PHẨM Ở GIỎ HÀNG TRỐNG */}
                    <div className="w-full text-left">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <ImagePlus size={16} className="text-[#CFA34D]" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Gợi ý cho bạn</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {products.filter(p => p.is_hot).slice(0, 2).map(p => (
                                <div key={p.id} onClick={() => openCustomRoom(p)} className={`bg-white p-3.5 rounded-[1.5rem] shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-stone-100 flex flex-col gap-3 active:scale-[0.97] transition-all group cursor-pointer relative overflow-hidden`}>
                                    <div className="aspect-square rounded-xl overflow-hidden relative bg-stone-50 border border-stone-50">
                                        <img src={p.image_url || FALLBACK_IMG} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt=""/>
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-md">-20%</div>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h4 className={`text-sm font-extrabold ${theme.darkText} leading-tight line-clamp-1 mb-1`}>{p.name}</h4>
                                        <div className="mt-auto flex items-end justify-between pt-1">
                                            <div className="flex flex-col">
                                                <p className={`text-[12px] font-black text-red-600`}>{(p.base_price * 0.8).toLocaleString()}đ</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-[#121212] text-white`}><Plus size={12}/></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                                <img src={item.product?.image_url || FALLBACK_IMG} onError={(e)=>{e.target.onerror=null; e.target.src=FALLBACK_IMG}} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" alt=""/>
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
                            {isCheckingOut ? 'Đang xử lý...' : 'Thanh toán ngay'}
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

            <div className="space-y-4 mb-8">
                <h3 className="font-extrabold text-sm px-1">Lịch sử đơn hàng</h3>
                {myOrders.length === 0 ? <p className="text-center py-8 text-xs text-stone-400 bg-white rounded-2xl border border-stone-100 shadow-sm">Chưa có đơn hàng</p> : myOrders.map(o => {
                    const steps = ['Chờ duyệt', 'Chế tác', 'Hoàn thành'];
                    let currentIndex = 0;
                    if (o.status === 'making') currentIndex = 1;
                    if (o.status === 'completed') currentIndex = 2;

                    return (
                        <div key={o.id} className="bg-white p-5 rounded-[1.5rem] border border-stone-100 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                            {/* Header Đơn hàng */}
                            <div className="flex justify-between items-center border-b border-stone-50 pb-3 mb-2">
                                <div>
                                    <p className="font-black text-sm text-[#121212]">#{o.id}</p>
                                    <p className="text-[9px] text-stone-400 font-medium mt-0.5">Ngày đặt: {new Date(o.created_at).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <p className="font-extrabold text-base text-[#CFA34D]">{o.total_amount.toLocaleString()}đ</p>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="flex items-center justify-between mt-2 mb-5 relative px-2">
                                <div className="absolute left-[10%] right-[10%] top-1.5 h-[2px] bg-stone-100 z-0"></div>
                                <div className="absolute left-[10%] top-1.5 h-[2px] bg-[#CFA34D] z-0 transition-all duration-500" style={{ width: `${(currentIndex / 2) * 80}%` }}></div>
                                
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2.5 relative z-10 w-1/3">
                                        <div className={`w-3.5 h-3.5 rounded-full border-[2px] outline outline-[3px] outline-white transition-colors duration-500 ${idx <= currentIndex ? 'border-[#CFA34D] bg-[#CFA34D]' : 'border-stone-200 bg-white'}`}></div>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest text-center transition-colors duration-500 ${idx <= currentIndex ? 'text-stone-800' : 'text-stone-400'}`}>{step}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-2">
                                <button onClick={() => handleOpenChatForOrder(o.id)} className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 text-stone-600 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-[#121212] hover:text-white hover:border-[#121212] active:scale-95 transition-all">
                                    <MessageCircle size={12} /> Cần hỗ trợ?
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className={`h-full relative flex flex-col ${theme.light}`}>
            {/* GLOBAL HEADER */}
            {currentView !== 'custom' && currentView !== 'article_detail' && (
                <header className="shrink-0 sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-xl border-b border-stone-100 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className={`text-[9px] font-extrabold ${theme.goldText} uppercase tracking-[0.3em]`}>Leather Craft</h2>
                        <h1 className={`text-2xl font-black ${theme.darkText} tracking-tighter uppercase italic mt-0.5 leading-none`}>H.MADE</h1>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#121212] active:scale-95 transition-all shadow-sm`}><MessageCircle size={16} /></button>
                    </div>
                </header>
            )}

            <main className="flex-1 overflow-hidden relative z-0">
                <div key={currentView} className="w-full h-full bg-[#FAFAFA]">
                    {currentView === 'home' && renderStorefront()}
                    {currentView === 'discover' && renderDiscover()}
                    {currentView === 'article_detail' && renderArticleDetail()}
                    {currentView === 'promos' && renderPromos()}
                    {currentView === 'custom' && renderCustomRoom()}
                    {currentView === 'cart' && renderCart()}
                    {currentView === 'profile' && renderProfile()}
                </div>
            </main>
            
            <ChatBot isOpen={isChatOpen} onClose={handleCloseChat} initialContext={chatContext} />

            {/* GLOBAL BOTTOM NAV */}
            {currentView !== 'custom' && currentView !== 'article_detail' && (
                <div className="absolute bottom-6 left-6 right-6 h-[64px] bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-around px-2 z-50 border border-stone-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                    <button onClick={() => navigateTo('home')} className={`transition-colors p-2 ${currentView === 'home' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><Home size={22} /></button>
                    <button onClick={() => navigateTo('discover')} className={`transition-colors p-2 ${currentView === 'discover' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><Compass size={22} /></button>
                    <button onClick={() => navigateTo('promos')} className={`transition-colors p-2 ${currentView === 'promos' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><Gift size={22} /></button>
                    <button onClick={() => navigateTo('cart')} className={`relative transition-colors p-2 ${currentView === 'cart' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}>
                        <ShoppingCart size={22} />
                        {cart.length > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#CFA34D] rounded-full text-[8px] font-bold flex items-center justify-center text-white border border-white">{cart.length}</span>}
                    </button>
                    <button onClick={() => handleProtectedNavigation('profile')} className={`transition-colors p-2 ${currentView === 'profile' ? 'text-[#CFA34D]' : 'text-[#121212]'}`}><User size={22} /></button>
                </div>
            )}

            {/* Modal Danh sách mã ưu đãi */}
            {isPromoSelectorOpen && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end animate-fade-in">
                    <div className="bg-white w-full rounded-t-[2.5rem] p-6 pb-12 animate-slide-up shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg uppercase tracking-tight text-[#121212]">Mã đã lưu</h3>
                            <button onClick={() => setIsPromoSelectorOpen(false)} className="p-2 bg-stone-50 rounded-full active:scale-95"><X size={16}/></button>
                        </div>
                        <div className="space-y-3 max-h-[40vh] overflow-y-auto scrollbar-hide">
                            {savedPromos.length === 0 ? <p className="text-center text-[10px] font-bold uppercase tracking-widest text-stone-300 py-4">Chưa có mã nào</p> : null}
                            {promos.filter(p => savedPromos.includes(p.id)).map(p => (
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
// 5. MAIN APP
// ==========================================
export default function App() {
    const [currentUser, setCurrentUser] = useState(null); 
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [materials] = useState(fallbackMaterials);
    const [products] = useState(fallbackProducts);
    const [orders, setOrders] = useState([]);
    
    // ĐƯA DATA LÊN GLOBAL STATE ĐỂ ĐỒNG BỘ
    const [promos, setPromos] = useState(fallbackPromos);
    const [panels, setPanels] = useState(fallbackPanels);
    
    // Toast State
    const [toast, setToast] = useState({ message: '', type: '', id: 0 });

    const showToast = useCallback((message, type = 'success') => setToast({ message, type, id: Date.now() }), []);

    useEffect(() => {
        if (toast.message) {
            const timer = setTimeout(() => setToast({ message: '', type: '', id: 0 }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.id]);

    const handleLogin = useCallback((userData) => {
        setIsLoginModalOpen(false);
        setIsTransitioning(true);
        setTimeout(() => { 
            setCurrentUser(userData); 
            setIsTransitioning(false); 
            showToast(`Chào mừng ${userData.name}!`, 'success');
        }, 400);
    }, [showToast]);

    const handleLogout = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => { 
            setCurrentUser(null); 
            setIsTransitioning(false); 
            showToast('Đã đăng xuất thành công', 'success');
        }, 400);
    }, [showToast]);

    const handlePlaceOrder = useCallback((newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
    }, []);

    return (
        <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4 sm:p-8">
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap');
                * { font-family: 'Outfit', sans-serif; scrollbar-width: none; }
                ::-webkit-scrollbar { display: none; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-left { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.4s ease-out; }
                .animate-slide-left { animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            `}} />

            <div className="w-full max-w-[400px] h-[850px] bg-white rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.2)] relative overflow-hidden border-[12px] border-[#121212] flex flex-col shrink-0">
                {/* TOAST NOTIFICATION */}
                {toast.message && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[1000] animate-fade-in">
                        <div className={`px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-[#121212] border-white/10 text-white' : 'bg-red-50 border-red-200 text-red-600'}`}>
                            {toast.type === 'success' ? <CheckCircle2 size={16} className="text-[#CFA34D]" /> : <AlertTriangle size={16} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
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
                            <AdminDashboard 
                                onLogout={handleLogout} currentUser={currentUser} materials={materials} transactions={[]} orders={orders} refreshData={() => {}} supabaseClient={null} showToast={showToast} 
                                promos={promos} setPromos={setPromos} panels={panels} setPanels={setPanels}
                            />
                        ) : (
                            <CustomerPortal 
                                onLoginClick={() => setIsLoginModalOpen(true)}
                                onLogout={handleLogout}
                                currentUser={currentUser}
                                products={products}
                                materials={materials}
                                orders={orders}
                                onPlaceOrder={handlePlaceOrder}
                                showToast={showToast}
                                promos={promos}
                                panels={panels}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}