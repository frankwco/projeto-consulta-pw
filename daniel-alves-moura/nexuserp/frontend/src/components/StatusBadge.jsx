const labels = {
  PENDING: 'Pendente', PAID: 'Pago', PROCESSING: 'Processando', SHIPPED: 'Enviado', COMPLETED: 'Concluído', CANCELED: 'Cancelado'
};

export default function StatusBadge({ status }) {
  return <span className={`status status-${String(status).toLowerCase()}`}>{labels[status] || status}</span>;
}
