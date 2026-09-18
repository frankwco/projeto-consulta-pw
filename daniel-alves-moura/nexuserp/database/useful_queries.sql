USE nexuserp;

-- Conferir tabelas
SHOW TABLES;

-- Produtos com categoria
SELECT p.id, p.sku, p.name, p.price, p.stock, p.active, c.name AS category
FROM products p
JOIN categories c ON c.id = p.category_id
ORDER BY p.name;

-- Pedidos com cliente
SELECT o.id, c.name AS customer, o.status, o.total, o.created_at
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY o.created_at DESC;

-- Itens de um pedido
SELECT oi.order_id, p.name AS product, oi.quantity, oi.unit_price, oi.subtotal
FROM order_items oi
JOIN products p ON p.id = oi.product_id
WHERE oi.order_id = 1;

-- Faturamento por status
SELECT status, COUNT(*) AS quantity, SUM(total) AS total
FROM orders
GROUP BY status;

-- Estoque baixo
SELECT sku, name, stock
FROM products
WHERE stock <= 5
ORDER BY stock ASC;

-- Exemplo de transação manual
START TRANSACTION;
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0;
-- COMMIT;
ROLLBACK;
