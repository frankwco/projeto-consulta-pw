import React, { useState } from 'react';
import { Heart, MessageCircle, Trash2, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../api/api';
import Avatar from './Avatar';

export default function PostCard({ post: initial, onDeleted, onUpdated }) {
  const [post,setPost]=useState(initial); const [error,setError]=useState('');
  async function toggleLike(){try{const {data}=post.likedByMe?await api.delete(`/posts/${post.id}/like`):await api.post(`/posts/${post.id}/like`);setPost(data);}catch(e){setError(errorMessage(e));}}
  async function remove(){if(!window.confirm('Excluir este post?'))return;try{await api.delete(`/posts/${post.id}`);onDeleted?.(post.id);}catch(e){setError(errorMessage(e));}}
  async function edit(){const content=window.prompt('Editar post:',post.content);if(content==null||!content.trim())return;try{const {data}=await api.put(`/posts/${post.id}`,{content,imageUrl:post.imageUrl||''});setPost(data);onUpdated?.(data);}catch(e){setError(errorMessage(e));}}
  return <article className="card post-card">
    <header><Link className="author" to={`/u/${post.author.username}`}><Avatar user={post.author}/><div><strong>{post.author.displayName}</strong><small>@{post.author.username} · {new Date(post.createdAt).toLocaleString('pt-BR')}</small></div></Link>{post.mine&&<div className="post-actions"><button className="icon" onClick={edit} title="Editar"><Pencil size={17}/></button><button className="icon danger" onClick={remove} title="Excluir"><Trash2 size={17}/></button></div>}</header>
    <p className="post-content">{post.content}</p>
    {post.imageUrl&&<img className="post-image" src={post.imageUrl} alt="Publicação"/>}
    <footer><button className={`metric ${post.likedByMe?'liked':''}`} onClick={toggleLike}><Heart size={19} fill={post.likedByMe?'currentColor':'none'}/>{post.likes}</button><Link className="metric" to={`/posts/${post.id}`}><MessageCircle size={19}/>{post.comments}</Link></footer>
    {error&&<p className="error">{error}</p>}
  </article>;
}
