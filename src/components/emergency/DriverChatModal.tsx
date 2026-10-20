"use client";

import React, {useState} from "react";
import { useTrobosStore } from "@/store/useTrobosStore";
import { ArrowRight, MessageCircle, Send, ShieldCheck, X } from "lucide-react";
import Link from "next/link";

export function DriverChatModal({isOpen,onClose}:{isOpen:boolean;onClose:()=>void}) {
  const trip=useTrobosStore(s=>s.currentTrip);
  const messages=useTrobosStore(s=>s.chatMessages);
  const send=useTrobosStore(s=>s.sendChatMessage);
  const [draft,setDraft]=useState("");
  if(!isOpen)return null;
  const tripMessages=trip?messages.filter(m=>m.sender!=="system"):[];
  return <div className="tr-chat-backdrop" role="dialog" aria-modal="true" aria-labelledby="tr-chat-title">
    <section className="tr-chat-dialog">
      <header className="tr-chat-head"><span><MessageCircle size={22}/></span>
        <div><h2 id="tr-chat-title">Pesan perjalanan</h2><p>Operator simulasi · pesan hanya di browser ini</p></div>
        <button type="button" onClick={onClose} aria-label="Tutup chat"><X size={20}/></button>
      </header>
      <div className="tr-chat-disclaimer"><ShieldCheck size={17}/>
        Tidak ada driver atau saluran telepon aktif. Buka workspace operator demo untuk membalas sebagai driver.
      </div>
      <div className="tr-chat-messages" aria-live="polite">
        {tripMessages.length===0 && <p className="tr-chat-empty">Belum ada pesan dalam perjalanan demo ini.</p>}
        {tripMessages.map(msg=><div key={msg.id} className={"tr-chat-bubble "+(msg.sender==="user"?"is-user":"is-operator")}>
          <small>{msg.sender==="user"?"Pengguna":msg.senderName}</small><p>{msg.text}</p>
        </div>)}
      </div>
      {trip && trip.status!=="COMPLETED" ? <form className="tr-chat-compose" onSubmit={e=>{e.preventDefault();if(!draft.trim())return;send(draft.trim().slice(0,300));setDraft("");}}>
        <label className="sr-only" htmlFor="tr-chat-input">Ketik pesan demo</label>
        <input id="tr-chat-input" maxLength={300} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Pesan untuk operator demo..."/>
        <button type="submit" aria-label="Kirim pesan simulasi"><Send size={18}/></button>
      </form> : <p className="tr-chat-empty">Mulai booking demo untuk menggunakan chat simulasi.</p>}
      <Link href="/driver" onClick={onClose} className="tr-chat-operator-link">Buka tampilan operator demo <ArrowRight size={16}/></Link>
    </section>
  </div>;
}
