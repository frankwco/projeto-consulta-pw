import React, { useState } from 'react';
import { Image, Send } from 'lucide-react';
import { api, errorMessage } from '../api/api';

export default function PostComposer({ onCreated }) {
  const [content,setContent]=useState(''); const [imageUrl,setImageUrl]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  async function submit(e){e.preventDefault();if(!content.trim())return;try{setLoading(true);setError('');const {data}=await api.post('/posts',{content,imageUrl});setContent('');setImageUrl('');onCreated?.(data);}catch(err){setError(errorMessage(err));}finally{setLoading(false);}}
  return <form className="card composer" onSubmit={submit}>
    <textarea value={content} onChange={e=>setContent(e.target.value)} maxLength={2000} placeholder="O que está acontecendo?" />
    <div className="composer-row"><label className="image-field"><Image size={18}/><input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="URL de imagem (opcional)" /></label><button className="primary" disabled={loading||!content.trim()}><Send size={17}/>{loading?'Publicando...':'Publicar'}</button></div>
    {error&&<p className="error">{error}</p>}
  </form>;
}
