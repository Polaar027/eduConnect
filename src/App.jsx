import { useState, useEffect } from "react";

// ─── Constantes ───────────────────────────────────────────────────────────────
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const ALUNO_DOMAIN    = "@aluno.edu.es.gov.br";
const EDUCADOR_DOMAIN = "@educador.edu.es.gov.br";
const TYPE_COLORS = { prova:"#ef4444", trabalho:"#f59e0b", evento:"#8b5cf6", feriado:"#10b981", aviso:"#3b82f6", comunicado:"#ec4899" };
const TYPE_LABELS = { prova:"Prova", trabalho:"Trabalho", evento:"Evento", feriado:"Feriado", aviso:"Aviso", comunicado:"Comunicado" };
const tc = t => TYPE_COLORS[t] || "#6b7280";
const tl = t => TYPE_LABELS[t] || t;
const HORARIOS_AULA = ["07:00–07:50","07:50–08:40","08:40–09:30","09:45–10:35","10:35–11:25","11:25–12:15"];
const FOOD_EMOJI    = ["🍚","🫘","🍖","🥗","🍎","🥦","🍋","🐟","🥚","🫐"];

// ─── Estilos FORA do componente (não recriam a cada render) ──────────────────
const BASE = {
  input: {
    width:"100%", padding:"12px 16px",
    background:"rgba(255,255,255,0.07)",
    border:"1px solid rgba(139,92,246,0.3)",
    borderRadius:12, color:"#e2e8f0", fontSize:15,
    outline:"none", boxSizing:"border-box",
  },
  label: { fontSize:13, fontWeight:600, color:"#94a3b8", display:"block", marginBottom:6 },
  error: {
    background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)",
    borderRadius:10, padding:"10px 14px", color:"#f87171", fontSize:14, marginBottom:14,
  },
  btnPrimary: {
    width:"100%", padding:14,
    background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
    border:"none", borderRadius:12, color:"white", fontSize:15, fontWeight:700, cursor:"pointer",
  },
  btnSecondary: {
    width:"100%", padding:13, background:"transparent",
    border:"1px solid rgba(139,92,246,0.4)",
    borderRadius:12, color:"#a78bfa", fontSize:14, fontWeight:600, cursor:"pointer", marginTop:10,
  },
  overlay: {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
    backdropFilter:"blur(4px)", display:"flex", alignItems:"center",
    justifyContent:"center", zIndex:200, padding:16,
  },
};
const badge = tipo => ({
  display:"inline-flex", alignItems:"center", padding:"3px 10px",
  background:tc(tipo)+"22", color:tc(tipo), borderRadius:20,
  fontSize:11, fontWeight:700, border:`1px solid ${tc(tipo)}44`,
});
const btn = (color="#8b5cf6") => ({
  padding:"9px 18px", background:color+"22",
  border:`1px solid ${color}44`, borderRadius:10,
  color, fontSize:14, fontWeight:600, cursor:"pointer",
  display:"inline-flex", alignItems:"center", gap:6,
});
const card = (mobile=false) => ({
  background:"rgba(30,27,75,0.45)", border:"1px solid rgba(139,92,246,0.15)",
  borderRadius:16, padding:mobile?16:22, marginBottom:16,
});
const modal = (mobile=false) => ({
  background:"#1a1740", border:"1px solid rgba(139,92,246,0.4)",
  borderRadius:20, padding:mobile?20:32,
  width:"100%", maxWidth:480, maxHeight:"90vh",
  overflowY:"auto", boxSizing:"border-box",
});

// ─── Dados iniciais ───────────────────────────────────────────────────────────
const INIT_AVISOS = [
  { id:1, titulo:"Feira de Ciências", descricao:"A Feira de Ciências acontecerá no dia 20/06. Todos os alunos devem se inscrever até sexta-feira.", data:"2026-06-04", autor:"Coordenação" },
  { id:2, titulo:"Olimpíada de Matemática", descricao:"Inscrições abertas para a Olimpíada Brasileira de Matemática. Procure o professor responsável.", data:"2026-06-03", autor:"Coordenação" },
];
const INIT_COMUNICADOS = [
  { id:1, titulo:"Encerramento Antecipado", descricao:"A aula de sexta-feira será encerrada às 11h devido à reunião pedagógica.", data:"2026-06-04", autor:"Direção" },
];
const INIT_EVENTOS = [
  { id:1, nome:"Prova de Matemática",    data:"2026-06-10", tipo:"prova",    turma:"3º A",  cor:"#ef4444" },
  { id:2, nome:"Prova de Português",     data:"2026-06-12", tipo:"prova",    turma:"Todas", cor:"#ef4444" },
  { id:3, nome:"Feira de Ciências",      data:"2026-06-20", tipo:"evento",   turma:"Todas", cor:"#8b5cf6" },
  { id:4, nome:"Entrega — História",     data:"2026-06-15", tipo:"trabalho", turma:"3º A",  cor:"#f59e0b" },
  { id:5, nome:"Recesso Corpus Christi", data:"2026-06-19", tipo:"feriado",  turma:"Todas", cor:"#10b981" },
  { id:6, nome:"Reunião de Pais",        data:"2026-06-25", tipo:"evento",   turma:"Todas", cor:"#8b5cf6" },
];
const INIT_HORARIOS = {
  Segunda: ["Matemática","Português","Ciências","Ed. Física","História","Geografia"],
  Terça:   ["Inglês","Matemática","Português","Arte","Biologia","Química"],
  Quarta:  ["Física","História","Matemática","Português","Sociologia","Filosofia"],
  Quinta:  ["Ed. Física","Ciências","Inglês","Matemática","Português","Arte"],
  Sexta:   ["Geografia","Biologia","Química","História","Matemática","Português"],
};
const INIT_MERENDA = [
  { dia:"Segunda", cardapio:["Arroz integral","Feijão carioca","Frango grelhado","Salada de alface","Laranja"] },
  { dia:"Terça",   cardapio:["Macarrão ao sugo","Carne moída","Salada de cenoura","Banana"] },
  { dia:"Quarta",  cardapio:["Arroz","Feijão","Omelete","Salada de beterraba","Maçã"] },
  { dia:"Quinta",  cardapio:["Arroz","Lentilha","Peixe assado","Salada mista","Laranja"] },
  { dia:"Sexta",   cardapio:["Arroz","Feijão preto","Bisteca","Salada de repolho","Banana"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function validateEmail(email) {
  const e = email.toLowerCase().trim();
  if (e.endsWith(ALUNO_DOMAIN))    return { valid:true, tipo:"aluno" };
  if (e.endsWith(EDUCADOR_DOMAIN)) return { valid:true, tipo:"educador" };
  return { valid:false, tipo:null };
}
function roleColor(t) { return t==="aluno"?"#3b82f6":t==="professor"?"#10b981":t==="coordenador"?"#f59e0b":"#8b5cf6"; }
function roleLabel(t) { return t==="aluno"?"Aluno":t==="professor"?"Professor":t==="coordenador"?"Coordenador":"Direção"; }

function RoleIcon({ tipo, size=20 }) {
  if (tipo==="aluno") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l4 2.18V15c0 3.31 4.03 6 7 6s7-2.69 7-6v-3.82L22 9 12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99c0 2.21-3.14 4.01-5 4.01s-5-1.8-5-4.01v-2.77l5 2.73 5-2.73v2.77z"/>
    </svg>
  );
  if (tipo==="professor"||tipo==="educador") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z"/>
    </svg>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function App() {
  const [winW, setWinW] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const mob = winW < 768;

  // Auth
  const [users,    setUsers]    = useState([]);
  const [screen,   setScreen]   = useState("login");
  const [user,     setUser]     = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  // Login
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginSenha,    setLoginSenha]    = useState("");
  const [loginError,    setLoginError]    = useState("");
  const [showLoginPwd,  setShowLoginPwd]  = useState(false);

  // Cadastro
  const [cadNome,    setCadNome]    = useState("");
  const [cadEmail,   setCadEmail]   = useState("");
  const [cadSenha,   setCadSenha]   = useState("");
  const [cadSenha2,  setCadSenha2]  = useState("");
  const [cadTurma,   setCadTurma]   = useState("");
  const [cadError,   setCadError]   = useState("");
  const [showCadPwd, setShowCadPwd] = useState(false);

  // Recuperação
  const [recEmail,     setRecEmail]     = useState("");
  const [recNova,      setRecNova]      = useState("");
  const [recConfirm,   setRecConfirm]   = useState("");
  const [recStep,      setRecStep]      = useState(1);
  const [recError,     setRecError]     = useState("");
  const [recFoundUser, setRecFoundUser] = useState(null);

  // App data
  const [activeTab,   setActiveTab]   = useState("inicio");
  const [avisos,      setAvisos]      = useState(INIT_AVISOS);
  const [comunicados, setComunicados] = useState(INIT_COMUNICADOS);
  const [eventos,     setEventos]     = useState(INIT_EVENTOS);
  const [horarios,    setHorarios]    = useState(INIT_HORARIOS);
  const [merenda,     setMerenda]     = useState(INIT_MERENDA);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 4));
  const [showModal,   setShowModal]   = useState(null);
  const [toast,       setToast]       = useState(null);

  // Estados das abas (aqui no pai — evita recriação de componentes filhos)
  const [horarioDia, setHorarioDia] = useState("Segunda");
  const [merendaDia, setMerendaDia] = useState("Segunda");

  // Modal fields — campos separados evitam o bug do teclado
  const [mTitulo,       setMTitulo]       = useState("");
  const [mDescricao,    setMDescricao]    = useState("");
  const [mNomeEvento,   setMNomeEvento]   = useState("");
  const [mDataEvento,   setMDataEvento]   = useState("");
  const [mTipoEvento,   setMTipoEvento]   = useState("");
  const [mTurmaEvento,  setMTurmaEvento]  = useState("");
  const [mUserNome,     setMUserNome]     = useState("");
  const [mUserEmail,    setMUserEmail]    = useState("");
  const [mUserSenha,    setMUserSenha]    = useState("");
  const [mUserTipo,     setMUserTipo]     = useState("");
  const [mUserExtra,    setMUserExtra]    = useState("");
  const [mHorDia,       setMHorDia]       = useState("Segunda");
  const [mHorAula,      setMHorAula]      = useState(0);
  const [mHorMateria,   setMHorMateria]   = useState("");
  const [mMerDia,       setMMerDia]       = useState("Segunda");
  const [mMerCardapio,  setMMerCardapio]  = useState("");

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); }
  }, [toast]);
  const showToast = (msg, type="success") => setToast({ msg, type });

  function openModal(name) {
    setMTitulo(""); setMDescricao("");
    setMNomeEvento(""); setMDataEvento(""); setMTipoEvento(""); setMTurmaEvento("");
    setMUserNome(""); setMUserEmail(""); setMUserSenha(""); setMUserTipo(""); setMUserExtra("");
    setMHorDia(horarioDia); setMHorAula(0); setMHorMateria("");
    setMMerDia(merendaDia);
    const card = merenda.find(m => m.dia === merendaDia);
    setMMerCardapio(card ? card.cardapio.join("\n") : "");
    setShowModal(name);
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleLogin() {
    setLoginError("");
    const found = users.find(u => u.email === loginEmail.toLowerCase().trim() && u.senha === loginSenha);
    if (found) { setUser(found); setScreen("app"); setActiveTab("inicio"); }
    else setLoginError("E-mail ou senha incorretos.");
  }

  function handleCadastro() {
    setCadError("");
    const email = cadEmail.toLowerCase().trim();
    if (!cadNome.trim()||!email||!cadSenha||!cadSenha2) { setCadError("Preencha todos os campos."); return; }
    const chk = validateEmail(email);
    if (!chk.valid) { setCadError(`Use seu e-mail institucional (${ALUNO_DOMAIN})`); return; }
    if (chk.tipo !== "aluno") { setCadError(`O cadastro público é apenas para alunos. Educadores devem ser cadastrados pela direção.`); return; }
    if (cadSenha.length < 6) { setCadError("A senha deve ter ao menos 6 caracteres."); return; }
    if (cadSenha !== cadSenha2) { setCadError("As senhas não coincidem."); return; }
    if (users.find(u => u.email === email)) { setCadError("Este e-mail já possui uma conta."); return; }
    setUsers(p => [...p, { id:Date.now(), nome:cadNome.trim(), email, senha:cadSenha, tipo:"aluno", turma:cadTurma.trim()||"Sem turma" }]);
    showToast("Conta criada! Faça login.");
    setScreen("login"); setLoginEmail(email); setLoginSenha("");
    setCadNome(""); setCadEmail(""); setCadSenha(""); setCadSenha2(""); setCadTurma("");
  }

  function handleRecuperar() {
    setRecError("");
    if (recStep === 1) {
      const found = users.find(u => u.email === recEmail.toLowerCase().trim());
      if (!found) { setRecError("Nenhuma conta encontrada com este e-mail."); return; }
      setRecFoundUser(found); setRecStep(2);
    } else {
      if (recNova.length < 6) { setRecError("A senha deve ter ao menos 6 caracteres."); return; }
      if (recNova !== recConfirm) { setRecError("As senhas não coincidem."); return; }
      setUsers(p => p.map(u => u.id === recFoundUser.id ? { ...u, senha:recNova } : u));
      showToast("Senha redefinida!");
      setScreen("login"); setRecStep(1); setRecEmail(""); setRecNova(""); setRecConfirm(""); setRecFoundUser(null);
    }
  }

  function handleLogout() { setUser(null); setScreen("login"); setLoginEmail(""); setLoginSenha(""); setSideOpen(false); }

  function handleAddItem() {
    if (showModal === "aviso") {
      if (!mTitulo||!mDescricao) { showToast("Preencha todos os campos.","error"); return; }
      setAvisos(p => [...p, { id:Date.now(), titulo:mTitulo, descricao:mDescricao, data:new Date().toISOString().split("T")[0], autor:user.nome }]);
      showToast("Aviso publicado!");

    } else if (showModal === "comunicado") {
      if (!mTitulo||!mDescricao) { showToast("Preencha todos os campos.","error"); return; }
      setComunicados(p => [...p, { id:Date.now(), titulo:mTitulo, descricao:mDescricao, data:new Date().toISOString().split("T")[0], autor:user.nome }]);
      showToast("Comunicado publicado!");

    } else if (showModal === "evento") {
      if (!mNomeEvento||!mDataEvento||!mTipoEvento) { showToast("Preencha todos os campos.","error"); return; }
      setEventos(p => [...p, { id:Date.now(), nome:mNomeEvento, data:mDataEvento, tipo:mTipoEvento, turma:mTurmaEvento||"Todas", cor:tc(mTipoEvento) }]);
      showToast("Evento adicionado!");

    } else if (showModal === "novoUsuario") {
      const email = mUserEmail.toLowerCase().trim();
      if (!mUserNome||!email||!mUserSenha||!mUserTipo) { showToast("Preencha todos os campos.","error"); return; }
      const chk = validateEmail(email);
      if (!chk.valid) { showToast(`E-mail deve ser ${ALUNO_DOMAIN} ou ${EDUCADOR_DOMAIN}`,"error"); return; }
      if (users.find(u => u.email === email)) { showToast("E-mail já cadastrado.","error"); return; }
      const extra = mUserTipo==="aluno" ? { turma:mUserExtra||"Sem turma" }
                  : mUserTipo==="professor" ? { disciplina:mUserExtra||"" }
                  : { cargo:mUserExtra||"" };
      setUsers(p => [...p, { id:Date.now(), nome:mUserNome.trim(), email, senha:mUserSenha, tipo:mUserTipo, ...extra }]);
      showToast("Usuário cadastrado!");

    } else if (showModal === "editarHorario") {
      if (!mHorDia||!mHorMateria) { showToast("Preencha todos os campos.","error"); return; }
      setHorarios(prev => {
        const n = { ...prev };
        const arr = [...(n[mHorDia]||[])];
        arr[mHorAula] = mHorMateria;
        n[mHorDia] = arr;
        return n;
      });
      showToast("Horário atualizado!");

    } else if (showModal === "editarMerenda") {
      if (!mMerDia||!mMerCardapio) { showToast("Preencha os campos.","error"); return; }
      const itens = mMerCardapio.split("\n").map(s => s.trim()).filter(Boolean);
      setMerenda(p => p.map(m => m.dia === mMerDia ? { ...m, cardapio:itens } : m));
      showToast("Cardápio atualizado!");
    }
    setShowModal(null);
  }

  // ── Calendário ───────────────────────────────────────────────────────────────
  function getDaysInMonth(date) {
    const y = date.getFullYear(), m = date.getMonth();
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m+1, 0).getDate();
    const days = [];
    for (let i=0; i<first; i++) days.push(null);
    for (let i=1; i<=total; i++) days.push(i);
    return days;
  }
  function getEventosForDay(day) {
    if (!day) return [];
    const ds = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return eventos.filter(e => e.data === ds);
  }

  // ── Wrappers de estilo responsivo ────────────────────────────────────────────
  const C  = (extra={}) => ({ ...card(mob), ...extra });
  const BT = (color)    => btn(color);

  // ── Tela de fundo auth ───────────────────────────────────────────────────────
  function AuthBg({ children }) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)", position:"relative", overflow:"hidden", padding:16 }}>
        <div style={{ position:"absolute", width:350, height:350, borderRadius:"50%", background:"rgba(139,92,246,0.12)", filter:"blur(70px)", top:-80, right:-80 }}/>
        <div style={{ position:"absolute", width:250, height:250, borderRadius:"50%", background:"rgba(124,58,237,0.1)", filter:"blur(60px)", bottom:-40, left:-40 }}/>
        <div style={{ background:"rgba(30,27,75,0.65)", backdropFilter:"blur(20px)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:24, padding:mob?"32px 22px":"44px 40px", width:"100%", maxWidth:440, position:"relative", zIndex:1, boxSizing:"border-box" }}>
          {children}
        </div>
        {toast && (
          <div style={{ position:"fixed", bottom:24, right:16, background:toast.type==="error"?"rgba(239,68,68,0.93)":"rgba(16,185,129,0.93)", backdropFilter:"blur(10px)", borderRadius:12, padding:"12px 18px", color:"white", fontWeight:600, fontSize:14, zIndex:300, maxWidth:280 }}>
            {toast.type==="error"?"⚠️":"✅"} {toast.msg}
          </div>
        )}
      </div>
    );
  }

  function AppLogo() {
    return (
      <div style={{ textAlign:"center", marginBottom:26 }}>
        <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:58, height:58, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", borderRadius:16, marginBottom:12 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 3L1 9l4 2.18V15c0 3.31 4.03 6 7 6s7-2.69 7-6v-3.82L22 9 12 3z"/></svg>
        </div>
        <h1 style={{ fontSize:mob?22:26, fontWeight:800, color:"#f1f5f9", margin:"0 0 4px", letterSpacing:-0.5 }}>EduConnect</h1>
        <p style={{ color:"#94a3b8", fontSize:13, margin:0 }}>Sistema de Comunicação Escolar</p>
      </div>
    );
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  if (screen === "login") return (
    <AuthBg>
      <AppLogo/>
      <label style={BASE.label}>E-mail institucional</label>
      <input style={{ ...BASE.input, marginBottom:14 }} placeholder={`usuario${ALUNO_DOMAIN}`}
        value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
        onKeyDown={e => e.key==="Enter" && handleLogin()}/>
      <label style={BASE.label}>Senha</label>
      <div style={{ position:"relative", marginBottom:20 }}>
        <input type={showLoginPwd?"text":"password"} style={{ ...BASE.input, paddingRight:48 }}
          placeholder="••••••" value={loginSenha}
          onChange={e => setLoginSenha(e.target.value)}
          onKeyDown={e => e.key==="Enter" && handleLogin()}/>
        <button onClick={() => setShowLoginPwd(v => !v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:16 }}>
          {showLoginPwd?"🙈":"👁️"}
        </button>
      </div>
      {loginError && <div style={BASE.error}>{loginError}</div>}
      <button style={BASE.btnPrimary} onClick={handleLogin}>Entrar</button>
      <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <span style={{ color:"#64748b", fontSize:13 }}>Não tem conta?{" "}
          <span style={{ color:"#a78bfa", cursor:"pointer", fontWeight:600 }} onClick={() => { setScreen("cadastro"); setCadError(""); }}>Cadastre-se</span>
        </span>
        <span style={{ color:"#a78bfa", fontSize:13, cursor:"pointer", fontWeight:600 }} onClick={() => { setScreen("recuperar"); setRecStep(1); setRecError(""); setRecEmail(""); }}>
          Esqueci a senha
        </span>
      </div>
    </AuthBg>
  );

  // ── CADASTRO ─────────────────────────────────────────────────────────────────
  if (screen === "cadastro") return (
    <AuthBg>
      <AppLogo/>
      <div style={{ background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:18, fontSize:13, color:"#a78bfa", lineHeight:1.5 }}>
        📌 Cadastro público apenas para <strong>alunos</strong> com e-mail <strong>{ALUNO_DOMAIN}</strong>.<br/>
        Educadores são cadastrados pela direção.
      </div>
      <label style={BASE.label}>Nome completo</label>
      <input style={{ ...BASE.input, marginBottom:12 }} placeholder="Seu nome" value={cadNome} onChange={e => setCadNome(e.target.value)}/>
      <label style={BASE.label}>E-mail de aluno</label>
      <input style={{ ...BASE.input, marginBottom:12 }} placeholder={`usuario${ALUNO_DOMAIN}`} value={cadEmail} onChange={e => setCadEmail(e.target.value)}/>
      <label style={BASE.label}>Turma</label>
      <input style={{ ...BASE.input, marginBottom:12 }} placeholder="Ex: 3º A" value={cadTurma} onChange={e => setCadTurma(e.target.value)}/>
      <label style={BASE.label}>Senha (mín. 6 caracteres)</label>
      <div style={{ position:"relative", marginBottom:12 }}>
        <input type={showCadPwd?"text":"password"} style={{ ...BASE.input, paddingRight:48 }} placeholder="••••••" value={cadSenha} onChange={e => setCadSenha(e.target.value)}/>
        <button onClick={() => setShowCadPwd(v => !v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:16 }}>
          {showCadPwd?"🙈":"👁️"}
        </button>
      </div>
      <label style={BASE.label}>Confirmar senha</label>
      <input type="password" style={{ ...BASE.input, marginBottom:18 }} placeholder="••••••" value={cadSenha2} onChange={e => setCadSenha2(e.target.value)}/>
      {cadError && <div style={BASE.error}>{cadError}</div>}
      <button style={BASE.btnPrimary} onClick={handleCadastro}>Criar Conta</button>
      <button style={BASE.btnSecondary} onClick={() => setScreen("login")}>← Voltar para Login</button>
    </AuthBg>
  );

  // ── RECUPERAR SENHA ──────────────────────────────────────────────────────────
  if (screen === "recuperar") return (
    <AuthBg>
      <AppLogo/>
      <h2 style={{ color:"#f1f5f9", fontSize:18, fontWeight:700, margin:"0 0 6px", textAlign:"center" }}>Recuperar Senha</h2>
      {recStep === 1 ? (
        <>
          <p style={{ color:"#94a3b8", fontSize:13, marginBottom:20, textAlign:"center" }}>Informe seu e-mail institucional para redefinir a senha.</p>
          <label style={BASE.label}>E-mail institucional</label>
          <input style={{ ...BASE.input, marginBottom:18 }} placeholder={`usuario${ALUNO_DOMAIN}`} value={recEmail} onChange={e => setRecEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && handleRecuperar()}/>
          {recError && <div style={BASE.error}>{recError}</div>}
          <button style={BASE.btnPrimary} onClick={handleRecuperar}>Verificar E-mail</button>
        </>
      ) : (
        <>
          <p style={{ color:"#94a3b8", fontSize:13, marginBottom:20, textAlign:"center" }}>Conta: <strong style={{color:"#a78bfa"}}>{recFoundUser?.nome}</strong>. Defina a nova senha.</p>
          <label style={BASE.label}>Nova senha (mín. 6 caracteres)</label>
          <input type="password" style={{ ...BASE.input, marginBottom:12 }} placeholder="Nova senha" value={recNova} onChange={e => setRecNova(e.target.value)}/>
          <label style={BASE.label}>Confirmar nova senha</label>
          <input type="password" style={{ ...BASE.input, marginBottom:18 }} placeholder="Repita" value={recConfirm} onChange={e => setRecConfirm(e.target.value)}/>
          {recError && <div style={BASE.error}>{recError}</div>}
          <button style={BASE.btnPrimary} onClick={handleRecuperar}>Redefinir Senha</button>
        </>
      )}
      <button style={BASE.btnSecondary} onClick={() => setScreen("login")}>← Voltar para Login</button>
    </AuthBg>
  );

  // ── APP ──────────────────────────────────────────────────────────────────────
  const isEducador = ["professor","coordenador","direcao"].includes(user.tipo);
  const allTabs = [
    { id:"inicio",      label:"Início",      icon:"🏠", roles:["aluno","professor","coordenador","direcao"] },
    { id:"avisos",      label:"Avisos",       icon:"📢", roles:["aluno","professor","coordenador","direcao"] },
    { id:"calendario",  label:"Calendário",   icon:"📅", roles:["aluno","professor","coordenador","direcao"] },
    { id:"comunicados", label:"Comunicados",  icon:"📋", roles:["aluno","professor","coordenador","direcao"] },
    { id:"horarios",    label:"Horários",     icon:"🕐", roles:["aluno","professor","coordenador","direcao"] },
    { id:"merenda",     label:"Merenda",      icon:"🍽️", roles:["aluno","professor","coordenador","direcao"] },
    { id:"gerenciar",   label:"Gerenciar",    icon:"✏️", roles:["professor","coordenador","direcao"] },
    { id:"usuarios",    label:"Usuários",     icon:"👥", roles:["direcao"] },
  ];
  const userTabs = allTabs.filter(t => t.roles.includes(user.tipo));
  const SW = 220;

  function renderContent() {
    // ── INÍCIO ────────────────────────────────────────────────────────────────
    if (activeTab === "inicio") return (
      <div>
        <div style={{ background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.1))", border:"1px solid rgba(139,92,246,0.2)", borderRadius:20, padding:mob?"18px":"26px 30px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div>
            <p style={{ color:"#a78bfa", fontSize:12, fontWeight:600, margin:0 }}>Bem-vindo(a)</p>
            <h2 style={{ fontSize:mob?20:26, fontWeight:800, color:"#f1f5f9", margin:"4px 0 6px", letterSpacing:-0.5 }}>{user.nome}</h2>
            <p style={{ color:"#64748b", fontSize:13, margin:0 }}>
              {user.tipo==="aluno"?`Turma: ${user.turma}`:user.tipo==="professor"?`Disciplina: ${user.disciplina||""}`:user.cargo||roleLabel(user.tipo)}
            </p>
          </div>
          <div style={{ width:mob?50:62, height:mob?50:62, flexShrink:0, borderRadius:16, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
            <RoleIcon tipo={user.tipo} size={mob?24:30}/>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:mob?10:14, marginBottom:18 }}>
          {[
            { label:"Avisos",      v:avisos.length,                              color:"#3b82f6", icon:"📢" },
            { label:"Comunicados", v:comunicados.length,                         color:"#ec4899", icon:"📋" },
            { label:"Eventos",     v:eventos.filter(e=>e.data>="2026-06-04").length, color:"#8b5cf6", icon:"📅" },
          ].map(s => (
            <div key={s.label} style={{ background:`${s.color}11`, border:`1px solid ${s.color}33`, borderRadius:14, padding:mob?"12px 8px":"18px 18px", textAlign:"center" }}>
              <div style={{ fontSize:mob?20:24, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:mob?22:28, fontWeight:800, color:s.color }}>{s.v}</div>
              <div style={{ fontSize:mob?10:12, color:"#64748b", fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={C()}>
          <h3 style={{ margin:"0 0 12px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>📢 Últimos Avisos</h3>
          {avisos.length===0 && <p style={{color:"#64748b",margin:0,fontSize:13}}>Nenhum aviso ainda.</p>}
          {[...avisos].reverse().slice(0,3).map(a => (
            <div key={a.id} style={{ padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <span style={badge("aviso")}>Aviso</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{a.titulo}</span>
              </div>
              <p style={{ color:"#64748b", fontSize:12, margin:"0 0 2px" }}>{a.descricao}</p>
              <span style={{ fontSize:11, color:"#475569" }}>{a.data} · {a.autor}</span>
            </div>
          ))}
        </div>

        <div style={C()}>
          <h3 style={{ margin:"0 0 12px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>📅 Próximos Eventos</h3>
          {eventos.filter(e=>e.data>="2026-06-04").slice(0,4).map(ev => (
            <div key={ev.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ background:ev.cor+"22", border:`1px solid ${ev.cor}44`, borderRadius:10, padding:"5px 10px", textAlign:"center", minWidth:mob?42:52, flexShrink:0 }}>
                <div style={{ fontSize:10, color:ev.cor, fontWeight:700 }}>{MESES[parseInt(ev.data.split("-")[1])-1].slice(0,3).toUpperCase()}</div>
                <div style={{ fontSize:16, fontWeight:800, color:ev.cor, lineHeight:1.2 }}>{parseInt(ev.data.split("-")[2])}</div>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:600, color:"#e2e8f0", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.nome}</div>
                <span style={badge(ev.tipo)}>{tl(ev.tipo)} · {ev.turma}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // ── AVISOS ────────────────────────────────────────────────────────────────
    if (activeTab === "avisos") return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>📢 Avisos</h2>
          {isEducador && <button style={BT("#3b82f6")} onClick={() => openModal("aviso")}>+ Novo Aviso</button>}
        </div>
        {avisos.length===0 && <p style={{color:"#64748b"}}>Nenhum aviso no momento.</p>}
        {[...avisos].reverse().map(a => (
          <div key={a.id} style={{ ...C(), borderLeft:"4px solid #3b82f6" }}>
            <span style={badge("aviso")}>Aviso</span>
            <h3 style={{ margin:"8px 0 6px", color:"#f1f5f9", fontSize:16, fontWeight:700 }}>{a.titulo}</h3>
            <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 8px" }}>{a.descricao}</p>
            <span style={{ fontSize:11, color:"#475569" }}>{a.data} · {a.autor}</span>
          </div>
        ))}
      </div>
    );

    // ── COMUNICADOS ───────────────────────────────────────────────────────────
    if (activeTab === "comunicados") return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>📋 Comunicados da Direção</h2>
          {["direcao","coordenador"].includes(user.tipo) && <button style={BT("#ec4899")} onClick={() => openModal("comunicado")}>+ Novo</button>}
        </div>
        {comunicados.length===0 && <p style={{color:"#64748b"}}>Nenhum comunicado.</p>}
        {[...comunicados].reverse().map(c => (
          <div key={c.id} style={{ ...C(), borderLeft:"4px solid #ec4899" }}>
            <span style={badge("comunicado")}>Comunicado Oficial</span>
            <h3 style={{ margin:"8px 0 6px", color:"#f1f5f9", fontSize:16, fontWeight:700 }}>{c.titulo}</h3>
            <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 8px" }}>{c.descricao}</p>
            <span style={{ fontSize:11, color:"#475569" }}>{c.data} · {c.autor}</span>
          </div>
        ))}
      </div>
    );

    // ── CALENDÁRIO ────────────────────────────────────────────────────────────
    if (activeTab === "calendario") {
      const days = getDaysInMonth(currentDate);
      const todayStr = "2026-06-04";
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>📅 Calendário</h2>
            {isEducador && <button style={BT("#8b5cf6")} onClick={() => openModal("evento")}>+ Evento</button>}
          </div>
          <div style={C()}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <button style={{ ...BT(), padding:"6px 12px", fontSize:13 }} onClick={() => setCurrentDate(d => new Date(d.getFullYear(),d.getMonth()-1,1))}>‹</button>
              <span style={{ fontSize:16, fontWeight:800, color:"#f1f5f9" }}>{MESES[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <button style={{ ...BT(), padding:"6px 12px", fontSize:13 }} onClick={() => setCurrentDate(d => new Date(d.getFullYear(),d.getMonth()+1,1))}>›</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:mob?2:4, marginBottom:4 }}>
              {DIAS_SEMANA.map(d => <div key={d} style={{ textAlign:"center", fontSize:mob?10:12, fontWeight:700, color:"#64748b", padding:"4px 0" }}>{d}</div>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:mob?2:4 }}>
              {days.map((day,i) => {
                const de = getEventosForDay(day);
                const ds = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` : "";
                const isToday = ds === todayStr;
                return (
                  <div key={i} style={{ minHeight:mob?46:66, borderRadius:8, padding:mob?3:6, background:isToday?"rgba(139,92,246,0.2)":"rgba(255,255,255,0.03)", border:isToday?"1px solid rgba(139,92,246,0.5)":"1px solid rgba(255,255,255,0.05)" }}>
                    {day && <>
                      <div style={{ fontSize:mob?11:13, fontWeight:isToday?800:500, color:isToday?"#a78bfa":"#94a3b8", marginBottom:2 }}>{day}</div>
                      {de.slice(0, mob?1:2).map(ev => (
                        <div key={ev.id} title={ev.nome} style={{ fontSize:9, background:ev.cor+"33", color:ev.cor, borderRadius:3, padding:"1px 3px", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:600 }}>{mob?"●":ev.nome}</div>
                      ))}
                      {de.length>(mob?1:2) && <div style={{fontSize:9,color:"#64748b"}}>+{de.length-(mob?1:2)}</div>}
                    </>}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
            {["prova","trabalho","evento","feriado"].map(t => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:tc(t) }}/><span style={{color:"#64748b"}}>{tl(t)}</span>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#f1f5f9", marginBottom:12 }}>Eventos em {MESES[currentDate.getMonth()]}</h3>
          {eventos.filter(e => e.data.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}`)).map(ev => (
            <div key={ev.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", marginBottom:8, background:ev.cor+"11", border:`1px solid ${ev.cor}22`, borderRadius:12 }}>
              <div style={{ fontSize:18, fontWeight:800, color:ev.cor, minWidth:28, textAlign:"center" }}>{parseInt(ev.data.split("-")[2])}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, color:"#e2e8f0", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.nome}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{ev.turma}</div>
              </div>
              <span style={badge(ev.tipo)}>{tl(ev.tipo)}</span>
            </div>
          ))}
        </div>
      );
    }

    // ── HORÁRIOS ──────────────────────────────────────────────────────────────
    if (activeTab === "horarios") {
      const dias = Object.keys(horarios);
      const aulas = horarios[horarioDia] || [];
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>🕐 Horário Escolar</h2>
            {isEducador && <button style={BT("#f59e0b")} onClick={() => openModal("editarHorario")}>✏️ Editar</button>}
          </div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
            {dias.map(d => (
              <button key={d} onClick={() => setHorarioDia(d)} style={{ padding:"8px 14px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, flexShrink:0, background:horarioDia===d?"linear-gradient(135deg,#8b5cf6,#7c3aed)":"rgba(255,255,255,0.07)", color:horarioDia===d?"white":"#94a3b8" }}>{d}</button>
            ))}
          </div>
          <div style={C()}>
            <h3 style={{ margin:"0 0 14px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>📚 {horarioDia}</h3>
            {aulas.map((mat,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:10, padding:"6px 10px", textAlign:"center", minWidth:mob?48:62, flexShrink:0 }}>
                  <div style={{ fontSize:10, color:"#a78bfa", fontWeight:700 }}>{i+1}ª aula</div>
                  <div style={{ fontSize:mob?8:10, color:"#7c3aed", fontWeight:600 }}>{HORARIOS_AULA[i]}</div>
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:"#e2e8f0" }}>{mat}</div>
              </div>
            ))}
            {aulas.length===0 && <p style={{color:"#64748b",fontSize:13}}>Sem aulas cadastradas.</p>}
          </div>
          {!mob && (
            <div style={C()}>
              <h3 style={{ margin:"0 0 14px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>Visão Semanal</h3>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>
                      <th style={{ padding:"8px 12px", color:"#64748b", textAlign:"left", fontWeight:700 }}>Horário</th>
                      {dias.map(d => <th key={d} style={{ padding:"8px 12px", color:"#a78bfa", fontWeight:700, textAlign:"center" }}>{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {HORARIOS_AULA.map((hr,i) => (
                      <tr key={i} style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                        <td style={{ padding:"8px 12px", color:"#64748b", fontSize:11 }}>{hr}</td>
                        {dias.map(d => <td key={d} style={{ padding:"8px 12px", textAlign:"center", color:"#e2e8f0" }}>{horarios[d]?.[i]||"—"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── MERENDA ───────────────────────────────────────────────────────────────
    if (activeTab === "merenda") {
      const cardapio = merenda.find(m => m.dia === merendaDia);
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>🍽️ Cardápio da Merenda</h2>
            {isEducador && <button style={BT("#10b981")} onClick={() => openModal("editarMerenda")}>✏️ Editar</button>}
          </div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
            {merenda.map(m => (
              <button key={m.dia} onClick={() => setMerendaDia(m.dia)} style={{ padding:"8px 14px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, flexShrink:0, background:merendaDia===m.dia?"linear-gradient(135deg,#10b981,#059669)":"rgba(255,255,255,0.07)", color:merendaDia===m.dia?"white":"#94a3b8" }}>{m.dia}</button>
            ))}
          </div>
          <div style={C()}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div style={{ fontSize:36 }}>🍱</div>
              <div>
                <h3 style={{ margin:0, color:"#f1f5f9", fontSize:17, fontWeight:700 }}>Cardápio de {merendaDia}</h3>
                <p style={{ margin:0, color:"#64748b", fontSize:13 }}>Escola Estadual</p>
              </div>
            </div>
            {cardapio ? (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {cardapio.cardapio.map((item,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:10 }}>
                    <span style={{ fontSize:18 }}>{FOOD_EMOJI[i%FOOD_EMOJI.length]}</span>
                    <span style={{ color:"#e2e8f0", fontSize:14, fontWeight:500 }}>{item}</span>
                  </div>
                ))}
              </div>
            ) : <p style={{color:"#64748b",fontSize:13}}>Sem cardápio para este dia.</p>}
            <div style={{ marginTop:16, padding:"10px 14px", background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:10 }}>
              <p style={{ margin:0, color:"#10b981", fontSize:12, fontWeight:600 }}>🌿 Cardápio elaborado conforme diretrizes do PNAE</p>
            </div>
          </div>
          {!mob && (
            <div style={C()}>
              <h3 style={{ margin:"0 0 14px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>Semana Completa</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
                {merenda.map(m => (
                  <div key={m.dia} style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:12, padding:14 }}>
                    <div style={{ fontWeight:700, color:"#34d399", fontSize:13, marginBottom:8 }}>{m.dia}</div>
                    {m.cardapio.map((item,i) => <div key={i} style={{ fontSize:11, color:"#94a3b8", marginBottom:4 }}>• {item}</div>)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── GERENCIAR ─────────────────────────────────────────────────────────────
    if (activeTab === "gerenciar") return (
      <div>
        <h2 style={{ margin:"0 0 20px", fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>
          {["direcao","coordenador"].includes(user.tipo)?"⚙️ Gerenciamento":"✏️ Meu Espaço"}
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(3,1fr)", gap:14 }}>
          {[
            { icon:"📢", label:"Publicar Aviso",   desc:"Informe alunos e turmas",    modal:"aviso",         color:"#3b82f6", roles:["professor","coordenador","direcao"] },
            { icon:"📅", label:"Adicionar Evento",  desc:"Provas, trabalhos, feriados", modal:"evento",        color:"#8b5cf6", roles:["professor","coordenador","direcao"] },
            { icon:"📋", label:"Comunicado",        desc:"Comunicados oficiais",        modal:"comunicado",    color:"#ec4899", roles:["coordenador","direcao"] },
            { icon:"🕐", label:"Editar Horário",    desc:"Alterar grade de aulas",      modal:"editarHorario", color:"#f59e0b", roles:["coordenador","direcao"] },
            { icon:"🍽️", label:"Editar Merenda",   desc:"Atualizar cardápio",           modal:"editarMerenda", color:"#10b981", roles:["coordenador","direcao"] },
          ].filter(it => it.roles.includes(user.tipo)).map(it => (
            <div key={it.modal} style={{ ...C(), cursor:"pointer", textAlign:"center" }} onClick={() => openModal(it.modal)}>
              <div style={{ fontSize:28, marginBottom:10 }}>{it.icon}</div>
              <h3 style={{ margin:"0 0 4px", color:"#f1f5f9", fontSize:14, fontWeight:700 }}>{it.label}</h3>
              <p style={{ margin:0, color:"#64748b", fontSize:12 }}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );

    // ── USUÁRIOS ──────────────────────────────────────────────────────────────
    if (activeTab === "usuarios") return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>👥 Usuários</h2>
          <button style={BT("#8b5cf6")} onClick={() => openModal("novoUsuario")}>+ Cadastrar</button>
        </div>
        {users.length===0 && <p style={{color:"#64748b"}}>Nenhum usuário cadastrado ainda.</p>}
        {users.map(u => (
          <div key={u.id} style={{ ...C(), display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:40, height:40, flexShrink:0, borderRadius:12, background:roleColor(u.tipo)+"33", display:"flex", alignItems:"center", justifyContent:"center", color:roleColor(u.tipo) }}>
              <RoleIcon tipo={u.tipo} size={20}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14 }}>{u.nome}</div>
              <div style={{ fontSize:12, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</div>
            </div>
            <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", background:roleColor(u.tipo)+"22", color:roleColor(u.tipo), borderRadius:20, fontSize:11, fontWeight:700, border:`1px solid ${roleColor(u.tipo)}44`, flexShrink:0 }}>{roleLabel(u.tipo)}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Shell do app ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", minHeight:"100vh", background:"#0f172a", color:"#e2e8f0" }}>
      {/* NAVBAR */}
      <nav style={{ background:"rgba(15,23,42,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(139,92,246,0.2)", padding:"0 14px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {mob && (
            <button onClick={() => setSideOpen(v => !v)} style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#a78bfa", display:"flex", marginRight:2 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </button>
          )}
          <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 3L1 9l4 2.18V15c0 3.31 4.03 6 7 6s7-2.69 7-6v-3.82L22 9 12 3z"/></svg>
          </div>
          <span style={{ fontWeight:800, fontSize:mob?15:17, color:"#f1f5f9", letterSpacing:-0.5 }}>EduConnect</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:mob?6:12 }}>
          {!mob && (
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{user.nome}</div>
              <div style={{ fontSize:11, color:"#64748b" }}>{roleLabel(user.tipo)}</div>
            </div>
          )}
          <button onClick={handleLogout} style={{ padding:"6px 12px", background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, color:"#f87171", fontSize:13, fontWeight:600, cursor:"pointer" }}>Sair</button>
        </div>
      </nav>

      {mob && sideOpen && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:150 }} onClick={() => setSideOpen(false)}/>}

      {/* SIDEBAR */}
      <aside style={{ width:SW, background:"rgba(15,23,42,0.92)", borderRight:"1px solid rgba(139,92,246,0.15)", padding:"18px 12px", display:"flex", flexDirection:"column", gap:2, position:"fixed", top:mob?0:58, left:mob?(sideOpen?0:-SW-10):0, bottom:0, zIndex:mob?160:50, transition:"left 0.25s ease", overflowY:"auto" }}>
        {mob && (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <RoleIcon tipo={user.tipo} size={14}/>
            </div>
            <div>
              <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:13 }}>{user.nome}</div>
              <div style={{ fontSize:11, color:"#64748b" }}>{roleLabel(user.tipo)}</div>
            </div>
          </div>
        )}
        <p style={{ fontSize:10, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:1, padding:"0 10px", marginBottom:6 }}>Menu</p>
        {userTabs.map(tab => (
          <div key={tab.id} onClick={() => { setActiveTab(tab.id); setSideOpen(false); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:500, background:activeTab===tab.id?"rgba(139,92,246,0.2)":"transparent", color:activeTab===tab.id?"#a78bfa":"#94a3b8", border:activeTab===tab.id?"1px solid rgba(139,92,246,0.3)":"1px solid transparent" }}>
            <span style={{ fontSize:15 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft:mob?0:SW, padding:mob?"18px 14px 88px":"26px 28px 48px", minHeight:"calc(100vh - 58px)" }}>
        {renderContent()}
      </main>

      {/* BOTTOM NAV (mobile) */}
      {mob && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(15,23,42,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(139,92,246,0.2)", display:"flex", justifyContent:"space-around", padding:"6px 4px 10px", zIndex:100 }}>
          {userTabs.slice(0,5).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 6px", borderRadius:8 }}>
              <span style={{ fontSize:18 }}>{tab.icon}</span>
              <span style={{ fontSize:9, fontWeight:600, color:activeTab===tab.id?"#a78bfa":"#475569" }}>{tab.label}</span>
            </button>
          ))}
          {userTabs.length > 5 && (
            <button onClick={() => setSideOpen(true)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 6px" }}>
              <span style={{ fontSize:18 }}>⋯</span>
              <span style={{ fontSize:9, fontWeight:600, color:"#475569" }}>Mais</span>
            </button>
          )}
        </nav>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={BASE.overlay} onClick={() => setShowModal(null)}>
          <div style={modal(mob)} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin:"0 0 18px", color:"#f1f5f9", fontSize:18, fontWeight:800 }}>
              {showModal==="aviso"?"📢 Novo Aviso":showModal==="comunicado"?"📋 Novo Comunicado":showModal==="evento"?"📅 Novo Evento":showModal==="novoUsuario"?"👤 Cadastrar Usuário":showModal==="editarHorario"?"🕐 Editar Horário":"🍽️ Editar Cardápio"}
            </h3>

            {(showModal==="aviso"||showModal==="comunicado") && <>
              <label style={BASE.label}>Título</label>
              <input style={{ ...BASE.input, marginBottom:12 }} placeholder="Título" value={mTitulo} onChange={e => setMTitulo(e.target.value)}/>
              <label style={BASE.label}>Descrição</label>
              <textarea style={{ ...BASE.input, minHeight:90, resize:"vertical", marginBottom:20 }} placeholder="Descreva..." value={mDescricao} onChange={e => setMDescricao(e.target.value)}/>
            </>}

            {showModal==="evento" && <>
              <label style={BASE.label}>Nome do Evento</label>
              <input style={{ ...BASE.input, marginBottom:12 }} placeholder="Nome" value={mNomeEvento} onChange={e => setMNomeEvento(e.target.value)}/>
              <label style={BASE.label}>Data</label>
              <input type="date" style={{ ...BASE.input, marginBottom:12 }} value={mDataEvento} onChange={e => setMDataEvento(e.target.value)}/>
              <label style={BASE.label}>Tipo</label>
              <select style={{ ...BASE.input, marginBottom:12 }} value={mTipoEvento} onChange={e => setMTipoEvento(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="prova">Prova</option><option value="trabalho">Trabalho</option>
                <option value="evento">Evento</option><option value="feriado">Feriado</option>
              </select>
              <label style={BASE.label}>Turma</label>
              <input style={{ ...BASE.input, marginBottom:20 }} placeholder="Ex: 3º A, Todas" value={mTurmaEvento} onChange={e => setMTurmaEvento(e.target.value)}/>
            </>}

            {showModal==="novoUsuario" && <>
              <div style={{ background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#a78bfa", lineHeight:1.6 }}>
                E-mails aceitos:<br/>
                <strong>{ALUNO_DOMAIN}</strong> → Aluno<br/>
                <strong>{EDUCADOR_DOMAIN}</strong> → Professor / Coordenador / Direção
              </div>
              <label style={BASE.label}>Nome completo</label>
              <input style={{ ...BASE.input, marginBottom:12 }} placeholder="Nome" value={mUserNome} onChange={e => setMUserNome(e.target.value)}/>
              <label style={BASE.label}>E-mail institucional</label>
              <input style={{ ...BASE.input, marginBottom:12 }} placeholder={`email${ALUNO_DOMAIN}`} value={mUserEmail} onChange={e => setMUserEmail(e.target.value)}/>
              <label style={BASE.label}>Senha provisória</label>
              <input type="password" style={{ ...BASE.input, marginBottom:12 }} placeholder="Mín. 6 caracteres" value={mUserSenha} onChange={e => setMUserSenha(e.target.value)}/>
              <label style={BASE.label}>Tipo</label>
              <select style={{ ...BASE.input, marginBottom:12 }} value={mUserTipo} onChange={e => setMUserTipo(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="aluno">Aluno</option><option value="professor">Professor</option>
                <option value="coordenador">Coordenador</option><option value="direcao">Direção</option>
              </select>
              <label style={BASE.label}>{mUserTipo==="professor"?"Disciplina":mUserTipo==="aluno"?"Turma":"Cargo"}</label>
              <input style={{ ...BASE.input, marginBottom:20 }} placeholder="Ex: 3º A / Matemática" value={mUserExtra} onChange={e => setMUserExtra(e.target.value)}/>
            </>}

            {showModal==="editarHorario" && <>
              <label style={BASE.label}>Dia da semana</label>
              <select style={{ ...BASE.input, marginBottom:12 }} value={mHorDia} onChange={e => setMHorDia(e.target.value)}>
                {Object.keys(horarios).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <label style={BASE.label}>Número da aula</label>
              <select style={{ ...BASE.input, marginBottom:12 }} value={mHorAula} onChange={e => setMHorAula(parseInt(e.target.value))}>
                {HORARIOS_AULA.map((h,i) => <option key={i} value={i}>{i+1}ª aula — {h}</option>)}
              </select>
              <label style={BASE.label}>Disciplina</label>
              <input style={{ ...BASE.input, marginBottom:20 }} placeholder="Nome da disciplina" value={mHorMateria} onChange={e => setMHorMateria(e.target.value)}/>
            </>}

            {showModal==="editarMerenda" && <>
              <label style={BASE.label}>Dia</label>
              <select style={{ ...BASE.input, marginBottom:12 }} value={mMerDia} onChange={e => setMMerDia(e.target.value)}>
                {merenda.map(m => <option key={m.dia} value={m.dia}>{m.dia}</option>)}
              </select>
              <label style={BASE.label}>Itens do cardápio (um por linha)</label>
              <textarea style={{ ...BASE.input, minHeight:120, resize:"vertical", marginBottom:20 }} placeholder={"Arroz\nFeijão\nFrango grelhado"} value={mMerCardapio} onChange={e => setMMerCardapio(e.target.value)}/>
            </>}

            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...BT("#8b5cf6"), flex:1, justifyContent:"center" }} onClick={handleAddItem}>
                {showModal==="novoUsuario"?"Cadastrar":showModal.startsWith("editar")?"Salvar":"Publicar"}
              </button>
              <button style={{ ...BT("#ef4444"), justifyContent:"center" }} onClick={() => setShowModal(null)}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:mob?84:24, right:16, background:toast.type==="error"?"rgba(239,68,68,0.93)":"rgba(16,185,129,0.93)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"11px 18px", color:"white", fontWeight:600, fontSize:14, zIndex:400, maxWidth:280 }}>
          {toast.type==="error"?"⚠️":"✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
