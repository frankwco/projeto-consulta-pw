import { Link } from 'react-router-dom';
export default function NotFound(){return <div className="not-found"><h1>404</h1><p>Página não encontrada.</p><Link className="btn primary" to="/dashboard">Ir para o painel</Link></div>;}
