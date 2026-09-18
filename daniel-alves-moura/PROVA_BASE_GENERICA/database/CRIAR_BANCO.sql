-- Opcional: application.properties já possui createDatabaseIfNotExist=true.
-- Use este arquivo no phpMyAdmin/XAMPP se preferir criar o banco manualmente.
CREATE DATABASE IF NOT EXISTS prova_base
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE prova_base;

-- As tabelas serão criadas pelo Hibernate (spring.jpa.hibernate.ddl-auto=update).
