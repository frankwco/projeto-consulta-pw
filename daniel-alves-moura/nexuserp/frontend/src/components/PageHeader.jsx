export default function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      <div className="actions">{actions}</div>
    </div>
  );
}
