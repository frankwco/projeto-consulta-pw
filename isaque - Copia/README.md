TERMINAL BACKEND
no spring initializr, criar um projeto maven jar com as seguintes dependencias e jogar dentro da pasta backend:
    Lombok, Spring Boot DevToolsl, MySQL Driver SQL, Spring Data, Validation, Spring Web
- rodar:
    mvnw clean install
    mvnw spring-boot:run


TERMINAL FRONTEND
- rodar:
    npx create-react-app . (se ja estiver na pasta frontend)
    npm install 
    npm install (react-router-dom / axios / ...(outras))
    npm start


PROPERTIES
- configurar a porta do localhost (varia de acordo com o start do mysql e apache no xampp) e inserir o nome do banco que será criado
- após o start, criar o banco no localhost/phpmyadmin com o mesmo nome que foi inserido na configuração acima

conteúdo:
    spring.application.name=backend

    spring.datasource.url=jdbc:mysql://localhost:(porta)/(nomeBanco)
    spring.datasource.username=root
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

    spring.jpa.hibernate.ddl-auto=update

