"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Status = "waiting" | "collected";
type RecordItem = { pickupNumber: number; status: Status; updatedAt: string };
type Board = { restaurant: { code: string; name: string }; cycle: { id: string; number: number }; records: RecordItem[] };
type HistoryItem = { number: number; endedAt: string; uncollected: number[] };
const pad = (n: number) => String(n).padStart(3, "0");

async function api(path: string, options?: RequestInit) {
  const response = await fetch(`/api/${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "操作失敗");
  return data;
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("處理中…");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await api(tab, { method: "POST", body: JSON.stringify(data) });
      if (tab === "register") await api("login", { method: "POST", body: JSON.stringify({ code: data.code, pin: data.pin }) });
      onLogin();
    } catch (error) { setMessage(error instanceof Error ? error.message : "未能登入"); }
  }
  return <main className="login-shell"><section className="login-brand"><img src="/mcdonalds-logo.png" alt="McDonald's 標誌"/><p>智能取餐看板</p><span>清楚記錄每一張取餐單</span></section><section className="login-card"><div className="tabs"><button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setMessage(""); }}>登入</button><button className={tab === "register" ? "active" : ""} onClick={() => { setTab("register"); setMessage(""); }}>首次登記</button></div><form onSubmit={submit}><h1>{tab === "login" ? "歡迎回來" : "建立餐廳"}</h1><label>餐廳號碼<input name="code" inputMode="numeric" maxLength={3} placeholder="000" required /></label>{tab === "register" && <label>餐廳名稱<input name="name" placeholder="例如：麥當勞叔叔之家" required /></label>}<label>{tab === "login" ? "PIN" : "設定 PIN"}<input name="pin" type="password" inputMode="numeric" minLength={4} maxLength={8} placeholder="4–8 位數字" required /></label><button className="primary" type="submit">{tab === "login" ? "進入取餐板" : "建立餐廳"}</button>{message && <p className="form-message">{message}</p>}</form></section></main>;
}

function BoardApp({ board, onLogout }: { board: Board; onLogout: () => void }) {
  const [records, setRecords] = useState(new Map(board.records.map((item) => [item.pickupNumber, item]))); const [history, setHistory] = useState<HistoryItem[]>([]); const [number, setNumber] = useState(""); const [notice, setNotice] = useState("請輸入或點擊取餐號碼"); const [duplicate, setDuplicate] = useState<number | null>(null); const [cycleOpen, setCycleOpen] = useState(false); const [clearOpen, setClearOpen] = useState(false); const [clearPin, setClearPin] = useState(""); const [error, setError] = useState("");
  const waiting = useMemo(() => [...records.values()].filter((item) => item.status === "waiting").length, [records]); const collected = records.size - waiting;
  useEffect(() => { api("history").then((data) => setHistory(data.history)).catch(() => undefined); }, []);
  async function updateNumber(value: number, mode: "record" | "toggle") { try { const data = await api("records", { method: "POST", body: JSON.stringify({ pickupNumber: value, mode }) }); setRecords((current) => new Map(current).set(value, data.record)); setNotice(data.message); if (data.duplicateCollected && mode === "record") setDuplicate(value); } catch (err) { setNotice(err instanceof Error ? err.message : "操作失敗"); } }
  async function submitNumber(event: FormEvent) { event.preventDefault(); if (!/^\d{1,3}$/.test(number)) return setNotice("請輸入 0–999"); await updateNumber(Number(number), "record"); setNumber(""); }
  async function completeCycle() { try { await api("cycles/complete", { method: "POST" }); window.location.reload(); } catch (err) { setError(err instanceof Error ? err.message : "操作失敗"); } }
  async function clearRecords() { try { await api("restaurant/clear-records", { method: "POST", body: JSON.stringify({ pin: clearPin }) }); window.location.reload(); } catch (err) { setError(err instanceof Error ? err.message : "PIN 不正確"); } }
  return <main className="board"><header><div className="brand"><img src="/mcdonalds-logo.png" alt="McDonald's 標誌"/><div><b>智能取餐看板</b><span>第 {board.cycle.number} 輪 · 0–999</span></div></div><div className="restaurant"><b>{board.restaurant.name}</b><span>{board.restaurant.code}</span></div><button className="logout" onClick={onLogout}>登出</button></header><div className="content"><aside><section className="card entry"><label>輸入取餐號碼</label><form onSubmit={submitNumber}><input value={number} onChange={(event) => setNumber(event.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={3} placeholder="例如 123" autoFocus/><button>✓ 確認取餐</button></form><p className="notice">{notice}</p></section><section className="stats"><div className="green"><span>已取餐</span><b>{collected}</b></div><div className="yellow"><span>未取餐</span><b>{waiting}</b></div></section><button className="new-cycle" onClick={() => setCycleOpen(true)}>↻　完成並開始下一輪</button><section className="card history"><h2>↶　未取餐紀錄</h2>{history.length ? history.slice(0, 8).map((item) => <article key={item.number}><b>第 {item.number} 輪</b><small>{item.uncollected.length ? item.uncollected.map(pad).join(" · ") : "全部已取餐"}</small></article>) : <p>尚未有已完成的輪次</p>}</section><button className="clear-link" onClick={() => { setClearOpen(true); setClearPin(""); setError(""); }}>清除本餐廳全部紀錄</button></aside><section className="card grid-card"><div className="grid-title"><div><h1>{board.restaurant.name} · 號碼看板</h1><p>點一下已取餐，再點一下未取餐</p></div><div className="legend"><span><i className="green-dot"/>已取餐</span><span><i className="yellow-dot"/>未取餐</span></div></div><div className="number-grid">{Array.from({ length: 1000 }, (_, pickupNumber) => <button key={pickupNumber} className={records.get(pickupNumber)?.status ?? "empty"} onClick={() => updateNumber(pickupNumber, "toggle")}>{pad(pickupNumber)}</button>)}</div></section></div>{duplicate !== null && <div className="modal-backdrop"><section className="modal duplicate"><div>!</div><span>重複取餐提醒</span><strong>{pad(duplicate)}</strong><h2>客人已取餐</h2><p>此號碼在本輪已被標記為已取餐。</p><button onClick={() => setDuplicate(null)}>知道了</button></section></div>}{cycleOpen && <div className="modal-backdrop"><section className="modal"><h2>完成本輪？</h2><p>{waiting ? `本輪仍有 ${waiting} 個號碼未取餐，完成後會保存到歷史紀錄。` : "本輪所有已記錄號碼都已取餐。"}</p>{error && <small>{error}</small>}<div className="actions"><button onClick={() => setCycleOpen(false)}>取消</button><button className="confirm" onClick={completeCycle}>確認開新輪</button></div></section></div>}{clearOpen && <div className="modal-backdrop"><section className="modal danger"><h2>清除全部紀錄</h2><p>這會永久清除目前餐廳的所有輪次、取餐狀態及歷史紀錄。請輸入 PIN 確認。</p><input value={clearPin} onChange={(event) => setClearPin(event.target.value)} type="password" inputMode="numeric" placeholder="輸入 4–8 位 PIN"/>{error && <small>{error}</small>}<div className="actions"><button onClick={() => setClearOpen(false)}>取消</button><button className="delete" onClick={clearRecords}>確認清除</button></div></section></div>}</main>;
}

export default function Home() { const [board, setBoard] = useState<Board | null>(null); const [loading, setLoading] = useState(true); async function load() { try { setBoard(await api("board")); } catch { setBoard(null); } finally { setLoading(false); } } useEffect(() => { load(); }, []); if (loading) return <main className="loading">載入取餐看板…</main>; return board ? <BoardApp board={board} onLogout={async () => { await api("logout", { method: "POST" }); setBoard(null); }} /> : <Login onLogin={load} />; }
