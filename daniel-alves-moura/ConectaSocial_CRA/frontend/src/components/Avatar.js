import React from 'react';
export default function Avatar({ user, size = 44 }) {
  const initials = (user?.displayName || user?.username || '?').split(' ').map((x) => x[0]).join('').slice(0,2).toUpperCase();
  if (user?.avatarUrl) return <img className="avatar" src={user.avatarUrl} alt={user.displayName || user.username} style={{width:size,height:size}} />;
  return <div className="avatar avatar-fallback" style={{width:size,height:size}}>{initials}</div>;
}
