import { useState, useEffect } from "react";

// ── Constantes ─────────────────────────────────────────────────────────────────
const ALUNO_DOMAIN    = "@aluno.edu.es.gov.br";
const EDUCADOR_DOMAIN = "@educador.edu.es.gov.br";
const MESES      = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEM   = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const HORARIOS   = ["07:00–07:50","07:50–08:40","08:40–09:30","09:45–10:35","10:35–11:25","11:25–12:15"];
const FOOD_EMOJI = ["🍚","🫘","🍖","🥗","🍎","🥦","🍋","🐟","🥚","🫐"];
const TCOLORS    = { prova:"#ef4444", trabalho:"#f59e0b", evento:"#8b5cf6", feriado:"#10b981", aviso:"#3b82f6", comunicado:"#ec4899" };
const TLABELS    = { prova:"Prova", trabalho:"Trabalho", evento:"Evento", feriado:"Feriado", aviso:"Aviso", comunicado:"Comunicado" };
const tc = t => TCOLORS[t] || "#6b7280";
const tl = t => TLABELS[t] || t;

// ── Estilos estáticos (nunca recriados) ────────────────────────────────────────
const INPUT    = { display:"block", width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:12, color:"#e2e8f0", fontSize:16, outline:"none", boxSizing:"border-box", marginBottom:12 };
const TEXTAREA = { ...INPUT, minHeight:90, resize:"vertical" };
const SELECT   = { ...INPUT, background:"#1e1b4b" };
const LABEL    = { fontSize:13, fontWeight:600, color:"#94a3b8", display:"block", marginBottom:5 };
const ERR      = { background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"10px 14px", color:"#f87171", fontSize:14, marginBottom:12 };
const BTN_PRI  = { display:"block", width:"100%", padding:14, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", border:"none", borderRadius:12, color:"white", fontSize:15, fontWeight:700, cursor:"pointer" };
const BTN_SEC  = { display:"block", width:"100%", padding:13, background:"transparent", border:"1px solid rgba(139,92,246,0.4)", borderRadius:12, color:"#a78bfa", fontSize:14, fontWeight:600, cursor:"pointer", marginTop:10 };
const CARD     = { background:"rgba(30,27,75,0.45)", border:"1px solid rgba(139,92,246,0.15)", borderRadius:16, padding:20, marginBottom:16 };
const OVERLAY  = { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 };
const MCARD    = { background:"#1a1740", border:"1px solid rgba(139,92,246,0.4)", borderRadius:20, padding:24, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", boxSizing:"border-box" };
const AUTHBG   = { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)", padding:16 };
const AUTHCARD = { background:"rgba(30,27,75,0.65)", backdropFilter:"blur(20px)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:24, padding:"36px 28px", width:"100%", maxWidth:420, boxSizing:"border-box" };

const badge = t => ({ display:"inline-flex", alignItems:"center", padding:"3px 10px", background:tc(t)+"22", color:tc(t), borderRadius:20, fontSize:11, fontWeight:700, border:`1px solid ${tc(t)}44` });
const obtn  = c => ({ padding:"9px 16px", background:c+"22", border:`1px solid ${c}44`, borderRadius:10, color:c, fontSize:14, fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 });

// ── Dados iniciais ─────────────────────────────────────────────────────────────
const INIT_AVISOS = [
  { id:1, titulo:"Feira de Ciências", descricao:"A Feira de Ciências acontecerá no dia 20/06. Inscrições até sexta.", data:"2026-06-04", autor:"Coordenação" },
  { id:2, titulo:"Olimpíada de Matemática", descricao:"Inscrições abertas para a Olimpíada Brasileira de Matemática.", data:"2026-06-03", autor:"Coordenação" },
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

// ── Helpers ────────────────────────────────────────────────────────────────────
function checkEmail(email) {
  const e = email.toLowerCase().trim();
  if (e.endsWith(ALUNO_DOMAIN))    return { ok:true, tipo:"aluno" };
  if (e.endsWith(EDUCADOR_DOMAIN)) return { ok:true, tipo:"educador" };
  return { ok:false };
}
const rColor = t => t==="aluno"?"#3b82f6":t==="professor"?"#10b981":t==="coordenador"?"#f59e0b":"#8b5cf6";
const rLabel = t => t==="aluno"?"Aluno":t==="professor"?"Professor":t==="coordenador"?"Coordenador":"Direção";

function RoleIcon({ tipo, size=20 }) {
  if (tipo==="aluno") return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18V15c0 3.31 4.03 6 7 6s7-2.69 7-6v-3.82L22 9 12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99c0 2.21-3.14 4.01-5 4.01s-5-1.8-5-4.01v-2.77l5 2.73 5-2.73v2.77z"/></svg>;
  if (tipo==="professor"||tipo==="educador") return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z"/></svg>;
}

// ══════════════════════════════════════════════════════════════════════════════
// MODAIS — componentes INDEPENDENTES fora do App (estado próprio, sem re-render
//          do pai ao digitar)
// ══════════════════════════════════════════════════════════════════════════════

function ModalTexto({ tipo, onSave, onClose }) {
  const [titulo,    setTitulo]    = useState("");
  const [descricao, setDescricao] = useState("");
  const isAviso = tipo === "aviso";
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={MCARD} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin:"0 0 18px", color:"#f1f5f9", fontSize:18, fontWeight:800 }}>
          {isAviso ? "📢 Novo Aviso" : "📋 Novo Comunicado"}
        </h3>
        <label style={LABEL}>Título</label>
        <input style={INPUT} placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
        <label style={LABEL}>Descrição</label>
        <textarea style={TEXTAREA} placeholder="Descreva..." value={descricao} onChange={e => setDescricao(e.target.value)} />
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button style={{ ...obtn("#8b5cf6"), flex:1, justifyContent:"center" }} onClick={() => { if (titulo && descricao) onSave(titulo, descricao); }}>Publicar</button>
          <button style={obtn("#ef4444")} onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}

function ModalEvento({ onSave, onClose }) {
  const [nome,  setNome]  = useState("");
  const [data,  setData]  = useState("");
  const [tipo,  setTipo]  = useState("");
  const [turma, setTurma] = useState("");
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={MCARD} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin:"0 0 18px", color:"#f1f5f9", fontSize:18, fontWeight:800 }}>📅 Novo Evento</h3>
        <label style={LABEL}>Nome do Evento</label>
        <input style={INPUT} placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <label style={LABEL}>Data</label>
        <input type="date" style={INPUT} value={data} onChange={e => setData(e.target.value)} />
        <label style={LABEL}>Tipo</label>
        <select style={SELECT} value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="">Selecione...</option>
          <option value="prova">Prova</option>
          <option value="trabalho">Trabalho</option>
          <option value="evento">Evento</option>
          <option value="feriado">Feriado</option>
        </select>
        <label style={LABEL}>Turma</label>
        <input style={INPUT} placeholder="Ex: 3º A, Todas" value={turma} onChange={e => setTurma(e.target.value)} />
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button style={{ ...obtn("#8b5cf6"), flex:1, justifyContent:"center" }} onClick={() => { if (nome && data && tipo) onSave({ nome, data, tipo, turma: turma||"Todas", cor: tc(tipo) }); }}>Adicionar</button>
          <button style={obtn("#ef4444")} onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}

function ModalUsuario({ onSave, onClose, horarios }) {
  const [nome,  setNome]  = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo,  setTipo]  = useState("");
  const [extra, setExtra] = useState("");
  const [err,   setErr]   = useState("");
  function salvar() {
    const em = email.toLowerCase().trim();
    if (!nome||!em||!senha||!tipo) { setErr("Preencha todos os campos."); return; }
    const chk = checkEmail(em);
    if (!chk.ok) { setErr(`E-mail deve terminar em ${ALUNO_DOMAIN} ou ${EDUCADOR_DOMAIN}`); return; }
    setErr("");
    onSave({ nome: nome.trim(), email: em, senha, tipo, extra: extra.trim() });
  }
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={MCARD} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin:"0 0 14px", color:"#f1f5f9", fontSize:18, fontWeight:800 }}>👤 Cadastrar Usuário</h3>
        <div style={{ background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#a78bfa", lineHeight:1.6 }}>
          <strong>{ALUNO_DOMAIN}</strong> → Aluno &nbsp;|&nbsp; <strong>{EDUCADOR_DOMAIN}</strong> → Educador
        </div>
        <label style={LABEL}>Nome completo</label>
        <input style={INPUT} placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <label style={LABEL}>E-mail institucional</label>
        <input style={INPUT} placeholder={`email${ALUNO_DOMAIN}`} value={email} onChange={e => setEmail(e.target.value)} />
        <label style={LABEL}>Senha provisória</label>
        <input type="password" style={INPUT} placeholder="Mín. 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} />
        <label style={LABEL}>Tipo</label>
        <select style={SELECT} value={tipo} onChange={e => { setTipo(e.target.value); setExtra(""); }}>
          <option value="">Selecione...</option>
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
          <option value="coordenador">Coordenador</option>
          <option value="direcao">Direção</option>
        </select>
        <label style={LABEL}>{tipo==="professor"?"Disciplina":tipo==="aluno"?"Turma":"Cargo"}</label>
        <input style={INPUT} placeholder="Ex: 3º A / Matemática" value={extra} onChange={e => setExtra(e.target.value)} />
        {err && <div style={ERR}>{err}</div>}
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button style={{ ...obtn("#8b5cf6"), flex:1, justifyContent:"center" }} onClick={salvar}>Cadastrar</button>
          <button style={obtn("#ef4444")} onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}

function ModalHorario({ horarios, onSave, onClose }) {
  const dias = Object.keys(horarios);
  const [dia,     setDia]     = useState(dias[0]);
  const [aula,    setAula]    = useState(0);
  const [materia, setMateria] = useState("");
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={MCARD} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin:"0 0 18px", color:"#f1f5f9", fontSize:18, fontWeight:800 }}>🕐 Editar Horário</h3>
        <label style={LABEL}>Dia da semana</label>
        <select style={SELECT} value={dia} onChange={e => setDia(e.target.value)}>
          {dias.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <label style={LABEL}>Número da aula</label>
        <select style={SELECT} value={aula} onChange={e => setAula(parseInt(e.target.value))}>
          {HORARIOS.map((h,i) => <option key={i} value={i}>{i+1}ª aula — {h}</option>)}
        </select>
        <label style={LABEL}>Disciplina</label>
        <input style={INPUT} placeholder="Nome da disciplina" value={materia} onChange={e => setMateria(e.target.value)} />
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button style={{ ...obtn("#8b5cf6"), flex:1, justifyContent:"center" }} onClick={() => { if (materia) onSave(dia, aula, materia); }}>Salvar</button>
          <button style={obtn("#ef4444")} onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}

function ModalMerenda({ merenda, diaInicial, onSave, onClose }) {
  const [dia,      setDia]      = useState(diaInicial);
  const card = merenda.find(m => m.dia === dia);
  const [texto, setTexto] = useState(card ? card.cardapio.join("\n") : "");
  function changeDia(d) {
    setDia(d);
    const c = merenda.find(m => m.dia === d);
    setTexto(c ? c.cardapio.join("\n") : "");
  }
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={MCARD} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin:"0 0 18px", color:"#f1f5f9", fontSize:18, fontWeight:800 }}>🍽️ Editar Cardápio</h3>
        <label style={LABEL}>Dia</label>
        <select style={SELECT} value={dia} onChange={e => changeDia(e.target.value)}>
          {merenda.map(m => <option key={m.dia} value={m.dia}>{m.dia}</option>)}
        </select>
        <label style={LABEL}>Itens (um por linha)</label>
        <textarea style={{ ...TEXTAREA, minHeight:130 }} placeholder={"Arroz\nFeijão\nFrango grelhado"} value={texto} onChange={e => setTexto(e.target.value)} />
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button style={{ ...obtn("#8b5cf6"), flex:1, justifyContent:"center" }} onClick={() => onSave(dia, texto)}>Salvar</button>
          <button style={obtn("#ef4444")} onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TELAS DE AUTH — também fora do App
// ══════════════════════════════════════════════════════════════════════════════

function TelaLogin({ onLogin, onGoCadastro, onGoRecuperar, toast }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err,   setErr]   = useState("");
  const [show,  setShow]  = useState(false);
  function tentar(users) {
    const found = users.find(u => u.email === email.toLowerCase().trim() && u.senha === senha);
    if (found) { setErr(""); onLogin(found); }
    else setErr("E-mail ou senha incorretos.");
  }
  return { email, senha, err, show, setEmail, setSenha, setErr, setShow, tentar };
}

// Componente real de login
function Login({ users, onLogin, onGoCadastro, onGoRecuperar, toast }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err,   setErr]   = useState("");
  const [show,  setShow]  = useState(false);
  function tentar() {
    const found = users.find(u => u.email === email.toLowerCase().trim() && u.senha === senha);
    if (found) { setErr(""); onLogin(found); }
    else setErr("E-mail ou senha incorretos.");
  }
  return (
    <div style={AUTHBG}>
      <div style={AUTHCARD}>
        <LogoBloco />
        <label style={LABEL}>E-mail institucional</label>
        <input style={INPUT} placeholder={`usuario${ALUNO_DOMAIN}`} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && tentar()} />
        <label style={LABEL}>Senha</label>
        <div style={{ position:"relative", marginBottom:12 }}>
          <input type={show?"text":"password"} style={{ ...INPUT, paddingRight:48, marginBottom:0 }} placeholder="••••••" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key==="Enter" && tentar()} />
          <button onClick={() => setShow(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:16, padding:0 }}>{show?"🙈":"👁️"}</button>
        </div>
        {err && <div style={ERR}>{err}</div>}
        <button style={BTN_PRI} onClick={tentar}>Entrar</button>
        <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <span style={{ color:"#64748b", fontSize:13 }}>Sem conta? <span style={{ color:"#a78bfa", cursor:"pointer", fontWeight:600 }} onClick={onGoCadastro}>Cadastre-se</span></span>
          <span style={{ color:"#a78bfa", fontSize:13, cursor:"pointer", fontWeight:600 }} onClick={onGoRecuperar}>Esqueci a senha</span>
        </div>
      </div>
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function Cadastro({ users, onCriou, onVoltar }) {
  const [nome,   setNome]   = useState("");
  const [email,  setEmail]  = useState("");
  const [turma,  setTurma]  = useState("");
  const [senha,  setSenha]  = useState("");
  const [senha2, setSenha2] = useState("");
  const [err,    setErr]    = useState("");
  const [showP,  setShowP]  = useState(false);
  function salvar() {
    setErr("");
    const em = email.toLowerCase().trim();
    if (!nome.trim()||!em||!senha||!senha2) { setErr("Preencha todos os campos."); return; }
    const chk = checkEmail(em);
    if (!chk.ok)           { setErr(`Use seu e-mail ${ALUNO_DOMAIN}`); return; }
    if (chk.tipo!=="aluno"){ setErr("Cadastro público só para alunos. Educadores são cadastrados pela direção."); return; }
    if (senha.length < 6)  { setErr("Senha deve ter ao menos 6 caracteres."); return; }
    if (senha !== senha2)  { setErr("As senhas não coincidem."); return; }
    if (users.find(u => u.email===em)) { setErr("Este e-mail já possui uma conta."); return; }
    onCriou({ id:Date.now(), nome:nome.trim(), email:em, senha, tipo:"aluno", turma:turma.trim()||"Sem turma" });
  }
  return (
    <div style={AUTHBG}>
      <div style={{ ...AUTHCARD, maxHeight:"95vh", overflowY:"auto" }}>
        <LogoBloco />
        <div style={{ background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#a78bfa", lineHeight:1.5 }}>
          📌 Apenas <strong>alunos</strong> com e-mail <strong>{ALUNO_DOMAIN}</strong>.<br/>Educadores são cadastrados pela direção.
        </div>
        <label style={LABEL}>Nome completo</label>
        <input style={INPUT} placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
        <label style={LABEL}>E-mail de aluno</label>
        <input style={INPUT} placeholder={`usuario${ALUNO_DOMAIN}`} value={email} onChange={e => setEmail(e.target.value)} />
        <label style={LABEL}>Turma</label>
        <input style={INPUT} placeholder="Ex: 3º A" value={turma} onChange={e => setTurma(e.target.value)} />
        <label style={LABEL}>Senha (mín. 6 caracteres)</label>
        <div style={{ position:"relative", marginBottom:12 }}>
          <input type={showP?"text":"password"} style={{ ...INPUT, paddingRight:48, marginBottom:0 }} placeholder="••••••" value={senha} onChange={e => setSenha(e.target.value)} />
          <button onClick={() => setShowP(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:16, padding:0 }}>{showP?"🙈":"👁️"}</button>
        </div>
        <label style={LABEL}>Confirmar senha</label>
        <input type="password" style={INPUT} placeholder="••••••" value={senha2} onChange={e => setSenha2(e.target.value)} />
        {err && <div style={ERR}>{err}</div>}
        <button style={BTN_PRI} onClick={salvar}>Criar Conta</button>
        <button style={BTN_SEC} onClick={onVoltar}>← Voltar para Login</button>
      </div>
    </div>
  );
}

function Recuperar({ users, onRecuperou, onVoltar }) {
  const [email,  setEmail]  = useState("");
  const [nova,   setNova]   = useState("");
  const [conf,   setConf]   = useState("");
  const [step,   setStep]   = useState(1);
  const [found,  setFound]  = useState(null);
  const [err,    setErr]    = useState("");
  function passo1() {
    const f = users.find(u => u.email===email.toLowerCase().trim());
    if (!f) { setErr("Nenhuma conta com este e-mail."); return; }
    setFound(f); setErr(""); setStep(2);
  }
  function passo2() {
    if (nova.length < 6) { setErr("Senha deve ter ao menos 6 caracteres."); return; }
    if (nova !== conf)   { setErr("As senhas não coincidem."); return; }
    onRecuperou(found.id, nova);
  }
  return (
    <div style={AUTHBG}>
      <div style={AUTHCARD}>
        <LogoBloco />
        <h2 style={{ color:"#f1f5f9", fontSize:18, fontWeight:700, margin:"0 0 6px", textAlign:"center" }}>Recuperar Senha</h2>
        {step===1 ? <>
          <p style={{ color:"#94a3b8", fontSize:13, marginBottom:16, textAlign:"center" }}>Informe seu e-mail para redefinir a senha.</p>
          <label style={LABEL}>E-mail institucional</label>
          <input style={INPUT} placeholder={`usuario${ALUNO_DOMAIN}`} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && passo1()} />
          {err && <div style={ERR}>{err}</div>}
          <button style={BTN_PRI} onClick={passo1}>Verificar E-mail</button>
        </> : <>
          <p style={{ color:"#94a3b8", fontSize:13, marginBottom:16, textAlign:"center" }}>Conta: <strong style={{color:"#a78bfa"}}>{found?.nome}</strong>. Defina a nova senha.</p>
          <label style={LABEL}>Nova senha</label>
          <input type="password" style={INPUT} placeholder="Mín. 6 caracteres" value={nova} onChange={e => setNova(e.target.value)} />
          <label style={LABEL}>Confirmar</label>
          <input type="password" style={INPUT} placeholder="Repita" value={conf} onChange={e => setConf(e.target.value)} />
          {err && <div style={ERR}>{err}</div>}
          <button style={BTN_PRI} onClick={passo2}>Redefinir Senha</button>
        </>}
        <button style={BTN_SEC} onClick={onVoltar}>← Voltar para Login</button>
      </div>
    </div>
  );
}

function LogoBloco() {
  return (
    <div style={{ textAlign:"center", marginBottom:24 }}>
      <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:56, height:56, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", borderRadius:16, marginBottom:12 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 3L1 9l4 2.18V15c0 3.31 4.03 6 7 6s7-2.69 7-6v-3.82L22 9 12 3z"/></svg>
      </div>
      <h1 style={{ fontSize:24, fontWeight:800, color:"#f1f5f9", margin:"0 0 4px", letterSpacing:-0.5 }}>EduConnect</h1>
      <p style={{ color:"#94a3b8", fontSize:13, margin:0 }}>Sistema de Comunicação Escolar</p>
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:16, background:toast.type==="error"?"rgba(239,68,68,0.93)":"rgba(16,185,129,0.93)", backdropFilter:"blur(10px)", borderRadius:12, padding:"11px 18px", color:"white", fontWeight:600, fontSize:14, zIndex:400, maxWidth:280 }}>
      {toast.type==="error"?"⚠️":"✅"} {toast.msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL — sem nenhum input inline, sem re-render nos modais
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [winW, setWinW] = useState(typeof window!=="undefined" ? window.innerWidth : 800);
  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const mob = winW < 768;

  const [users,       setUsers]       = useState([]);
  const [screen,      setScreen]      = useState("login");
  const [user,        setUser]        = useState(null);
  const [sideOpen,    setSideOpen]    = useState(false);
  const [activeTab,   setActiveTab]   = useState("inicio");
  const [avisos,      setAvisos]      = useState(INIT_AVISOS);
  const [comunicados, setComunicados] = useState(INIT_COMUNICADOS);
  const [eventos,     setEventos]     = useState(INIT_EVENTOS);
  const [horarios,    setHorarios]    = useState(INIT_HORARIOS);
  const [merenda,     setMerenda]     = useState(INIT_MERENDA);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 4));
  const [modal,       setModal]       = useState(null); // null | string
  const [toast,       setToast]       = useState(null);
  const [horarioDia,  setHorarioDia]  = useState("Segunda");
  const [merendaDia,  setMerendaDia]  = useState("Segunda");

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); }
  }, [toast]);
  const ok  = msg => setToast({ msg, type:"success" });
  const err = msg => setToast({ msg, type:"error" });

  // ── Auth ───────────────────────────────────────────────────────────────────
  if (screen==="login")     return <Login users={users} onLogin={u => { setUser(u); setScreen("app"); setActiveTab("inicio"); }} onGoCadastro={() => setScreen("cadastro")} onGoRecuperar={() => setScreen("recuperar")} toast={toast} />;
  if (screen==="cadastro")  return <Cadastro users={users} onCriou={u => { setUsers(p=>[...p,u]); ok("Conta criada! Faça login."); setScreen("login"); }} onVoltar={() => setScreen("login")} />;
  if (screen==="recuperar") return <Recuperar users={users} onRecuperou={(id,nova) => { setUsers(p=>p.map(u=>u.id===id?{...u,senha:nova}:u)); ok("Senha redefinida!"); setScreen("login"); }} onVoltar={() => setScreen("login")} />;

  // ── Dados derivados ────────────────────────────────────────────────────────
  const isEdu = ["professor","coordenador","direcao"].includes(user.tipo);

  const ALL_TABS = [
    { id:"inicio",      label:"Início",      icon:"🏠", roles:["aluno","professor","coordenador","direcao"] },
    { id:"avisos",      label:"Avisos",       icon:"📢", roles:["aluno","professor","coordenador","direcao"] },
    { id:"calendario",  label:"Calendário",   icon:"📅", roles:["aluno","professor","coordenador","direcao"] },
    { id:"comunicados", label:"Comunicados",  icon:"📋", roles:["aluno","professor","coordenador","direcao"] },
    { id:"horarios",    label:"Horários",     icon:"🕐", roles:["aluno","professor","coordenador","direcao"] },
    { id:"merenda",     label:"Merenda",      icon:"🍽️", roles:["aluno","professor","coordenador","direcao"] },
    { id:"gerenciar",   label:"Gerenciar",    icon:"✏️", roles:["professor","coordenador","direcao"] },
    { id:"usuarios",    label:"Usuários",     icon:"👥", roles:["direcao"] },
  ];
  const tabs = ALL_TABS.filter(t => t.roles.includes(user.tipo));

  function getDays(date) {
    const y=date.getFullYear(), m=date.getMonth();
    const first=new Date(y,m,1).getDay(), total=new Date(y,m+1,0).getDate();
    const arr=[];
    for(let i=0;i<first;i++) arr.push(null);
    for(let i=1;i<=total;i++) arr.push(i);
    return arr;
  }
  function evDay(day) {
    if(!day) return [];
    const ds=`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return eventos.filter(e=>e.data===ds);
  }

  // ── Conteúdo das abas (sem inputs — só visualização + botões) ─────────────
  function renderTab() {
    // INÍCIO
    if (activeTab==="inicio") return (
      <div>
        <div style={{ background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.1))", border:"1px solid rgba(139,92,246,0.2)", borderRadius:20, padding:mob?"18px":"26px 30px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div>
            <p style={{ color:"#a78bfa", fontSize:12, fontWeight:600, margin:0 }}>Bem-vindo(a)</p>
            <h2 style={{ fontSize:mob?20:26, fontWeight:800, color:"#f1f5f9", margin:"4px 0 6px", letterSpacing:-0.5 }}>{user.nome}</h2>
            <p style={{ color:"#64748b", fontSize:13, margin:0 }}>{user.tipo==="aluno"?`Turma: ${user.turma}`:user.tipo==="professor"?`Disciplina: ${user.disciplina||""}`:user.cargo||rLabel(user.tipo)}</p>
          </div>
          <div style={{ width:mob?50:62, height:mob?50:62, flexShrink:0, borderRadius:16, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
            <RoleIcon tipo={user.tipo} size={mob?24:30}/>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:mob?10:14, marginBottom:18 }}>
          {[{label:"Avisos",v:avisos.length,color:"#3b82f6",icon:"📢"},{label:"Comunicados",v:comunicados.length,color:"#ec4899",icon:"📋"},{label:"Eventos",v:eventos.filter(e=>e.data>="2026-06-04").length,color:"#8b5cf6",icon:"📅"}].map(s=>(
            <div key={s.label} style={{ background:`${s.color}11`, border:`1px solid ${s.color}33`, borderRadius:14, padding:mob?"12px 8px":"18px", textAlign:"center" }}>
              <div style={{ fontSize:mob?20:24, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:mob?22:28, fontWeight:800, color:s.color }}>{s.v}</div>
              <div style={{ fontSize:mob?10:12, color:"#64748b", fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={CARD}>
          <h3 style={{ margin:"0 0 12px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>📢 Últimos Avisos</h3>
          {avisos.length===0 && <p style={{color:"#64748b",margin:0,fontSize:13}}>Nenhum aviso ainda.</p>}
          {[...avisos].reverse().slice(0,3).map(a=>(
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
        <div style={CARD}>
          <h3 style={{ margin:"0 0 12px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>📅 Próximos Eventos</h3>
          {eventos.filter(e=>e.data>="2026-06-04").slice(0,4).map(ev=>(
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

    // AVISOS
    if (activeTab==="avisos") return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>📢 Avisos</h2>
          {isEdu && <button style={obtn("#3b82f6")} onClick={()=>setModal("aviso")}>+ Novo Aviso</button>}
        </div>
        {avisos.length===0 && <p style={{color:"#64748b"}}>Nenhum aviso no momento.</p>}
        {[...avisos].reverse().map(a=>(
          <div key={a.id} style={{ ...CARD, borderLeft:"4px solid #3b82f6" }}>
            <span style={badge("aviso")}>Aviso</span>
            <h3 style={{ margin:"8px 0 6px", color:"#f1f5f9", fontSize:16, fontWeight:700 }}>{a.titulo}</h3>
            <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 8px" }}>{a.descricao}</p>
            <span style={{ fontSize:11, color:"#475569" }}>{a.data} · {a.autor}</span>
          </div>
        ))}
      </div>
    );

    // COMUNICADOS
    if (activeTab==="comunicados") return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>📋 Comunicados da Direção</h2>
          {["direcao","coordenador"].includes(user.tipo) && <button style={obtn("#ec4899")} onClick={()=>setModal("comunicado")}>+ Novo</button>}
        </div>
        {comunicados.length===0 && <p style={{color:"#64748b"}}>Nenhum comunicado.</p>}
        {[...comunicados].reverse().map(c=>(
          <div key={c.id} style={{ ...CARD, borderLeft:"4px solid #ec4899" }}>
            <span style={badge("comunicado")}>Comunicado Oficial</span>
            <h3 style={{ margin:"8px 0 6px", color:"#f1f5f9", fontSize:16, fontWeight:700 }}>{c.titulo}</h3>
            <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 8px" }}>{c.descricao}</p>
            <span style={{ fontSize:11, color:"#475569" }}>{c.data} · {c.autor}</span>
          </div>
        ))}
      </div>
    );

    // CALENDÁRIO
    if (activeTab==="calendario") {
      const days = getDays(currentDate);
      const today = "2026-06-04";
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>📅 Calendário</h2>
            {isEdu && <button style={obtn("#8b5cf6")} onClick={()=>setModal("evento")}>+ Evento</button>}
          </div>
          <div style={CARD}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <button style={{ ...obtn("#8b5cf6"), padding:"6px 12px", fontSize:13 }} onClick={()=>setCurrentDate(d=>new Date(d.getFullYear(),d.getMonth()-1,1))}>‹</button>
              <span style={{ fontSize:16, fontWeight:800, color:"#f1f5f9" }}>{MESES[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <button style={{ ...obtn("#8b5cf6"), padding:"6px 12px", fontSize:13 }} onClick={()=>setCurrentDate(d=>new Date(d.getFullYear(),d.getMonth()+1,1))}>›</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:mob?2:4, marginBottom:4 }}>
              {DIAS_SEM.map(d=><div key={d} style={{ textAlign:"center", fontSize:mob?10:12, fontWeight:700, color:"#64748b", padding:"4px 0" }}>{d}</div>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:mob?2:4 }}>
              {days.map((day,i)=>{
                const de=evDay(day);
                const ds=day?`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`:"";
                const isTd=ds===today;
                return (
                  <div key={i} style={{ minHeight:mob?46:66, borderRadius:8, padding:mob?3:6, background:isTd?"rgba(139,92,246,0.2)":"rgba(255,255,255,0.03)", border:isTd?"1px solid rgba(139,92,246,0.5)":"1px solid rgba(255,255,255,0.05)" }}>
                    {day&&<>
                      <div style={{ fontSize:mob?11:13, fontWeight:isTd?800:500, color:isTd?"#a78bfa":"#94a3b8", marginBottom:2 }}>{day}</div>
                      {de.slice(0,mob?1:2).map(ev=>(
                        <div key={ev.id} title={ev.nome} style={{ fontSize:9, background:ev.cor+"33", color:ev.cor, borderRadius:3, padding:"1px 3px", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:600 }}>{mob?"●":ev.nome}</div>
                      ))}
                      {de.length>(mob?1:2)&&<div style={{fontSize:9,color:"#64748b"}}>+{de.length-(mob?1:2)}</div>}
                    </>}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
            {["prova","trabalho","evento","feriado"].map(t=>(
              <div key={t} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:tc(t) }}/><span style={{color:"#64748b"}}>{tl(t)}</span>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#f1f5f9", marginBottom:12 }}>Eventos em {MESES[currentDate.getMonth()]}</h3>
          {eventos.filter(e=>e.data.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}`)).map(ev=>(
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

    // HORÁRIOS
    if (activeTab==="horarios") {
      const dias=Object.keys(horarios), aulas=horarios[horarioDia]||[];
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>🕐 Horário Escolar</h2>
            {isEdu && <button style={obtn("#f59e0b")} onClick={()=>setModal("editarHorario")}>✏️ Editar</button>}
          </div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
            {dias.map(d=>(
              <button key={d} onClick={()=>setHorarioDia(d)} style={{ padding:"8px 14px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, flexShrink:0, background:horarioDia===d?"linear-gradient(135deg,#8b5cf6,#7c3aed)":"rgba(255,255,255,0.07)", color:horarioDia===d?"white":"#94a3b8" }}>{d}</button>
            ))}
          </div>
          <div style={CARD}>
            <h3 style={{ margin:"0 0 14px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>📚 {horarioDia}</h3>
            {aulas.map((mat,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:10, padding:"6px 10px", textAlign:"center", minWidth:mob?48:62, flexShrink:0 }}>
                  <div style={{ fontSize:10, color:"#a78bfa", fontWeight:700 }}>{i+1}ª aula</div>
                  <div style={{ fontSize:mob?8:10, color:"#7c3aed", fontWeight:600 }}>{HORARIOS[i]}</div>
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:"#e2e8f0" }}>{mat}</div>
              </div>
            ))}
          </div>
          {!mob && (
            <div style={CARD}>
              <h3 style={{ margin:"0 0 14px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>Visão Semanal</h3>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>
                      <th style={{ padding:"8px 12px", color:"#64748b", textAlign:"left" }}>Horário</th>
                      {dias.map(d=><th key={d} style={{ padding:"8px 12px", color:"#a78bfa", fontWeight:700, textAlign:"center" }}>{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {HORARIOS.map((h,i)=>(
                      <tr key={i} style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                        <td style={{ padding:"8px 12px", color:"#64748b", fontSize:11 }}>{h}</td>
                        {dias.map(d=><td key={d} style={{ padding:"8px 12px", textAlign:"center", color:"#e2e8f0" }}>{horarios[d]?.[i]||"—"}</td>)}
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

    // MERENDA
    if (activeTab==="merenda") {
      const card=merenda.find(m=>m.dia===merendaDia);
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>🍽️ Cardápio da Merenda</h2>
            {isEdu && <button style={obtn("#10b981")} onClick={()=>setModal("editarMerenda")}>✏️ Editar</button>}
          </div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
            {merenda.map(m=>(
              <button key={m.dia} onClick={()=>setMerendaDia(m.dia)} style={{ padding:"8px 14px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, flexShrink:0, background:merendaDia===m.dia?"linear-gradient(135deg,#10b981,#059669)":"rgba(255,255,255,0.07)", color:merendaDia===m.dia?"white":"#94a3b8" }}>{m.dia}</button>
            ))}
          </div>
          <div style={CARD}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <span style={{ fontSize:36 }}>🍱</span>
              <div>
                <h3 style={{ margin:0, color:"#f1f5f9", fontSize:17, fontWeight:700 }}>Cardápio de {merendaDia}</h3>
                <p style={{ margin:0, color:"#64748b", fontSize:13 }}>Escola Estadual</p>
              </div>
            </div>
            {card ? (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {card.cardapio.map((item,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:10 }}>
                    <span style={{ fontSize:18 }}>{FOOD_EMOJI[i%FOOD_EMOJI.length]}</span>
                    <span style={{ color:"#e2e8f0", fontSize:14 }}>{item}</span>
                  </div>
                ))}
              </div>
            ) : <p style={{color:"#64748b",fontSize:13}}>Sem cardápio para este dia.</p>}
            <div style={{ marginTop:14, padding:"10px 14px", background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:10 }}>
              <p style={{ margin:0, color:"#10b981", fontSize:12, fontWeight:600 }}>🌿 Cardápio elaborado conforme diretrizes do PNAE</p>
            </div>
          </div>
          {!mob && (
            <div style={CARD}>
              <h3 style={{ margin:"0 0 14px", color:"#f1f5f9", fontSize:15, fontWeight:700 }}>Semana Completa</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
                {merenda.map(m=>(
                  <div key={m.dia} style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:12, padding:14 }}>
                    <div style={{ fontWeight:700, color:"#34d399", fontSize:13, marginBottom:8 }}>{m.dia}</div>
                    {m.cardapio.map((item,i)=><div key={i} style={{ fontSize:11, color:"#94a3b8", marginBottom:4 }}>• {item}</div>)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // GERENCIAR
    if (activeTab==="gerenciar") return (
      <div>
        <h2 style={{ margin:"0 0 20px", fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>
          {["direcao","coordenador"].includes(user.tipo)?"⚙️ Gerenciamento":"✏️ Meu Espaço"}
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"repeat(3,1fr)", gap:14 }}>
          {[
            { icon:"📢", label:"Publicar Aviso",   desc:"Informe alunos",         m:"aviso",         c:"#3b82f6", roles:["professor","coordenador","direcao"] },
            { icon:"📅", label:"Adicionar Evento",  desc:"Provas e eventos",       m:"evento",        c:"#8b5cf6", roles:["professor","coordenador","direcao"] },
            { icon:"📋", label:"Comunicado",        desc:"Comunicados oficiais",    m:"comunicado",    c:"#ec4899", roles:["coordenador","direcao"] },
            { icon:"🕐", label:"Editar Horário",    desc:"Alterar grade",          m:"editarHorario", c:"#f59e0b", roles:["coordenador","direcao"] },
            { icon:"🍽️", label:"Editar Merenda",   desc:"Atualizar cardápio",      m:"editarMerenda", c:"#10b981", roles:["coordenador","direcao"] },
          ].filter(it=>it.roles.includes(user.tipo)).map(it=>(
            <div key={it.m} style={{ ...CARD, cursor:"pointer", textAlign:"center" }} onClick={()=>setModal(it.m)}>
              <div style={{ fontSize:28, marginBottom:10 }}>{it.icon}</div>
              <h3 style={{ margin:"0 0 4px", color:"#f1f5f9", fontSize:14, fontWeight:700 }}>{it.label}</h3>
              <p style={{ margin:0, color:"#64748b", fontSize:12 }}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );

    // USUÁRIOS
    if (activeTab==="usuarios") return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h2 style={{ margin:0, fontSize:mob?20:24, fontWeight:800, color:"#f1f5f9" }}>👥 Usuários</h2>
          <button style={obtn("#8b5cf6")} onClick={()=>setModal("novoUsuario")}>+ Cadastrar</button>
        </div>
        {users.length===0 && <p style={{color:"#64748b"}}>Nenhum usuário cadastrado ainda.</p>}
        {users.map(u=>(
          <div key={u.id} style={{ ...CARD, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:40, height:40, flexShrink:0, borderRadius:12, background:rColor(u.tipo)+"33", display:"flex", alignItems:"center", justifyContent:"center", color:rColor(u.tipo) }}>
              <RoleIcon tipo={u.tipo} size={20}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14 }}>{u.nome}</div>
              <div style={{ fontSize:12, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</div>
            </div>
            <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", background:rColor(u.tipo)+"22", color:rColor(u.tipo), borderRadius:20, fontSize:11, fontWeight:700, border:`1px solid ${rColor(u.tipo)}44`, flexShrink:0 }}>{rLabel(u.tipo)}</span>
          </div>
        ))}
      </div>
    );
  }

  const SW = 220;
  return (
    <div style={{ fontFamily:"system-ui,sans-serif", minHeight:"100vh", background:"#0f172a", color:"#e2e8f0" }}>
      {/* NAVBAR */}
      <nav style={{ background:"rgba(15,23,42,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(139,92,246,0.2)", padding:"0 14px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {mob && <button onClick={()=>setSideOpen(v=>!v)} style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#a78bfa", display:"flex", marginRight:2 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg></button>}
          <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 3L1 9l4 2.18V15c0 3.31 4.03 6 7 6s7-2.69 7-6v-3.82L22 9 12 3z"/></svg></div>
          <span style={{ fontWeight:800, fontSize:mob?15:17, color:"#f1f5f9", letterSpacing:-0.5 }}>EduConnect</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {!mob && <div style={{ textAlign:"right" }}><div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{user.nome}</div><div style={{ fontSize:11, color:"#64748b" }}>{rLabel(user.tipo)}</div></div>}
          <button onClick={()=>{ setUser(null); setScreen("login"); }} style={{ padding:"6px 12px", background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, color:"#f87171", fontSize:13, fontWeight:600, cursor:"pointer" }}>Sair</button>
        </div>
      </nav>

      {mob && sideOpen && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:150 }} onClick={()=>setSideOpen(false)}/>}

      {/* SIDEBAR */}
      <aside style={{ width:SW, background:"rgba(15,23,42,0.92)", borderRight:"1px solid rgba(139,92,246,0.15)", padding:"18px 12px", display:"flex", flexDirection:"column", gap:2, position:"fixed", top:mob?0:58, left:mob?(sideOpen?0:-SW-10):0, bottom:0, zIndex:mob?160:50, transition:"left 0.25s ease", overflowY:"auto" }}>
        {mob && (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center" }}><RoleIcon tipo={user.tipo} size={14}/></div>
            <div><div style={{ fontWeight:700, color:"#f1f5f9", fontSize:13 }}>{user.nome}</div><div style={{ fontSize:11, color:"#64748b" }}>{rLabel(user.tipo)}</div></div>
          </div>
        )}
        <p style={{ fontSize:10, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:1, padding:"0 10px", marginBottom:6 }}>Menu</p>
        {tabs.map(t=>(
          <div key={t.id} onClick={()=>{ setActiveTab(t.id); setSideOpen(false); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:500, background:activeTab===t.id?"rgba(139,92,246,0.2)":"transparent", color:activeTab===t.id?"#a78bfa":"#94a3b8", border:activeTab===t.id?"1px solid rgba(139,92,246,0.3)":"1px solid transparent" }}>
            <span style={{ fontSize:15 }}>{t.icon}</span><span>{t.label}</span>
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft:mob?0:SW, padding:mob?"18px 14px 88px":"26px 28px 48px", minHeight:"calc(100vh - 58px)" }}>
        {renderTab()}
      </main>

      {/* BOTTOM NAV */}
      {mob && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(15,23,42,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(139,92,246,0.2)", display:"flex", justifyContent:"space-around", padding:"6px 4px 10px", zIndex:100 }}>
          {tabs.slice(0,5).map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 6px" }}>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <span style={{ fontSize:9, fontWeight:600, color:activeTab===t.id?"#a78bfa":"#475569" }}>{t.label}</span>
            </button>
          ))}
          {tabs.length>5 && <button onClick={()=>setSideOpen(true)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 6px" }}><span style={{ fontSize:18 }}>⋯</span><span style={{ fontSize:9, fontWeight:600, color:"#475569" }}>Mais</span></button>}
        </nav>
      )}

      {/* MODAIS independentes — não causam re-render do App ao digitar */}
      {modal==="aviso"         && <ModalTexto tipo="aviso"      onClose={()=>setModal(null)} onSave={(t,d)=>{ setAvisos(p=>[...p,{id:Date.now(),titulo:t,descricao:d,data:new Date().toISOString().split("T")[0],autor:user.nome}]); ok("Aviso publicado!"); setModal(null); }} />}
      {modal==="comunicado"    && <ModalTexto tipo="comunicado" onClose={()=>setModal(null)} onSave={(t,d)=>{ setComunicados(p=>[...p,{id:Date.now(),titulo:t,descricao:d,data:new Date().toISOString().split("T")[0],autor:user.nome}]); ok("Comunicado publicado!"); setModal(null); }} />}
      {modal==="evento"        && <ModalEvento onClose={()=>setModal(null)} onSave={ev=>{ setEventos(p=>[...p,{id:Date.now(),...ev}]); ok("Evento adicionado!"); setModal(null); }} />}
      {modal==="novoUsuario"   && <ModalUsuario onClose={()=>setModal(null)} onSave={u=>{ if(users.find(x=>x.email===u.email)){err("E-mail já cadastrado.");return;} const extra=u.tipo==="aluno"?{turma:u.extra||"Sem turma"}:u.tipo==="professor"?{disciplina:u.extra}:{cargo:u.extra}; setUsers(p=>[...p,{id:Date.now(),nome:u.nome,email:u.email,senha:u.senha,tipo:u.tipo,...extra}]); ok("Usuário cadastrado!"); setModal(null); }} />}
      {modal==="editarHorario" && <ModalHorario horarios={horarios} onClose={()=>setModal(null)} onSave={(dia,aula,mat)=>{ setHorarios(prev=>{ const n={...prev}; const arr=[...(n[dia]||[])]; arr[aula]=mat; n[dia]=arr; return n; }); ok("Horário atualizado!"); setModal(null); }} />}
      {modal==="editarMerenda" && <ModalMerenda merenda={merenda} diaInicial={merendaDia} onClose={()=>setModal(null)} onSave={(dia,texto)=>{ const itens=texto.split("\n").map(s=>s.trim()).filter(Boolean); setMerenda(p=>p.map(m=>m.dia===dia?{...m,cardapio:itens}:m)); ok("Cardápio atualizado!"); setModal(null); }} />}

      {toast && <Toast toast={toast}/>}
    </div>
  );
}
