export default function Loading({ label = 'Carregando...' }) {
  return <div className="loading"><div className="spinner" />{label}</div>;
}
