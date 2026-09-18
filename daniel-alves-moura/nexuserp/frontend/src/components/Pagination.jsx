export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button className="btn secondary" disabled={page === 0} onClick={() => onChange(page - 1)}>Anterior</button>
      <span>Página {page + 1} de {totalPages}</span>
      <button className="btn secondary" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>Próxima</button>
    </div>
  );
}
