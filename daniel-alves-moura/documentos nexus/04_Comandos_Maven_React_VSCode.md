# Comandos Essenciais — Maven, React/Vite e VS Code

Cheat sheet para terminal, build, dependências, execução, diagnóstico e atalhos de consulta rápida

**Projeto de referência:** NexusERP

Java 21 • Spring Boot 3.4.5 • React 19 • Vite • MySQL/XAMPP

| Objetivo: consulta rápida durante a prova, com teoria suficiente para entender e exemplos práticos para adaptar. |
| --- |

## Índice alfabético para consulta rápida

Procure pelo termo que apareceu na questão e vá direto à seção indicada. Os números de seção são estáveis e facilitam a busca no Markdown/GitHub.

| Termo | Seção | Lembrete rápido |
| --- | --- | --- |
| build | 5 | npm run build gera dist; mvn package gera JAR. |
| clean | 2.1 | mvn clean remove target. |
| code . | 6 | Abre pasta atual no VS Code. |
| compile | 2.2 | mvn compile compila main. |
| dependency:tree | 2.8 | Mostra árvore de dependências Maven. |
| effective-pom | 2.9 | Mostra POM após herança/profiles. |
| Git Bash/PowerShell | 8 | Diferenças básicas de variável de ambiente. |
| install Maven | 1 | Verifique mvn -v e JAVA_HOME/PATH. |
| jar | 3.2 | java -jar target/backend-1.0.0.jar. |
| JAVA_HOME | 1.2 | Deve apontar para JDK 21. |
| mvn package | 2.4 | Compila, testa e empacota. |
| mvn spring-boot:run | 3 | Executa Spring Boot sem abrir JAR manualmente. |
| Node version | 1.3 | node -v e npm -v. |
| npm ci | 4.2 | Instala exatamente lockfile; bom para CI. |
| npm install | 4.1 | Instala dependências e atualiza lock quando necessário. |
| npm outdated | 4.5 | Mostra dependências desatualizadas. |
| npm run dev | 5.1 | Inicia Vite. |
| npm run preview | 5.3 | Serve build localmente para conferência. |
| port 8080 | 9 | Como identificar conflito de porta. |
| profiles Maven | 2.10 | -P ativa profile Maven; Spring profile é outro conceito. |
| skip tests | 2.6 | -DskipTests compila testes, mas não executa. |
| test | 2.3 | mvn test executa testes. |
| VS Code Command Palette | 7 | Ctrl+Shift+P. |
| VS Code terminal | 7.2 | Ctrl+` abre terminal integrado. |

## 1. Verificação do ambiente

### 1.1 Java e Maven

```bash
java -version
javac -version
mvn -v
```

Para o NexusERP, Java deve ser 21. mvn -v também mostra qual Java o Maven está usando; isso ajuda quando java -version e Maven apontam para JDKs diferentes.

### 1.2 JAVA_HOME e PATH

```bash
# PowerShell
$env:JAVA_HOME
$env:Path

# CMD
echo %JAVA_HOME%
where java
where mvn
```

### 1.3 Node/npm

```bash
node -v
npm -v
where node   # Windows CMD/PowerShell
```

## 2. Maven: ciclo de vida e comandos principais

### 2.1 Limpar

```bash
mvn clean
```

Remove target/. Use quando suspeitar de artefato antigo ou antes de empacotamento limpo.

### 2.2 Compilar

```bash
mvn compile
```

Compila src/main/java e recursos necessários até a fase compile.

### 2.3 Testar

```bash
mvn test
```

Compila e executa testes da fase test.

### 2.4 Empacotar

```bash
mvn clean package
```

Executa fases até package e gera JAR em target/. Com spring-boot-maven-plugin, o JAR é executável.

### 2.5 Instalar no repositório local

```bash
mvn clean install
```

Além de package, copia artefato para ~/.m2/repository. Útil quando outro projeto local depende dele.

### 2.6 Pular execução de testes

```bash
mvn package -DskipTests
mvn package -Dmaven.test.skip=true
```

-DskipTests normalmente compila testes, mas não executa. -Dmaven.test.skip=true pula compilação e execução de testes. Para prova, lembrar da diferença pode render ponto.

### 2.7 Executar teste específico

```bash
mvn -Dtest=ProductServiceTest test
mvn -Dtest=ProductServiceTest#deveRejeitarSkuDuplicado test
```

### 2.8 Dependências

```bash
mvn dependency:tree
mvn dependency:list
mvn dependency:analyze
mvn dependency:purge-local-repository
```

dependency:tree é excelente para conflito transitivo. purge-local-repository força redownload quando cache local está corrompido.

### 2.9 POM efetivo

```bash
mvn help:effective-pom
```

Mostra o POM final após parent, dependencyManagement, plugins e profiles.

### 2.10 Profiles e propriedades

```properties
mvn clean package -Pmeu-profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"
```

| Não confunda: -Pxxx ativa profile do Maven definido no pom.xml. spring.profiles.active/dev é profile da aplicação Spring. Podem ser usados juntos, mas são mecanismos diferentes. |
| --- |

## 3. Executar o Spring Boot

### 3.1 Pelo plugin Maven

```bash
cd backend
mvn spring-boot:run
```

### 3.2 Pelo JAR

```bash
mvn clean package
java -jar target/backend-1.0.0.jar
```

### 3.3 Variáveis de ambiente no comando

```bash
# PowerShell
$env:DB_USERNAME="root"
$env:DB_PASSWORD=""
$env:FRONTEND_URL="http://localhost:5173"
mvn spring-boot:run

# CMD
set DB_USERNAME=root
set DB_PASSWORD=
set FRONTEND_URL=http://localhost:5173
mvn spring-boot:run
```

## 4. npm: instalar e gerenciar dependências

### 4.1 Instalação normal

```bash
cd frontend
npm install
```

Lê package.json, resolve versões e cria/atualiza package-lock.json e node_modules.

### 4.2 Instalação reprodutível

```bash
npm ci
```

Exige package-lock.json consistente e recria node_modules de forma previsível. Excelente em CI ou quando você quer exatamente o lockfile.

### 4.3 Adicionar/remover pacote

```bash
npm install axios
npm install -D eslint
npm uninstall axios
```

### 4.4 Ver pacotes instalados

```bash
npm list --depth=0
npm list axios
```

### 4.5 Atualizações e auditoria

```bash
npm outdated
npm audit
npm audit fix
```

| Cuidado: npm audit fix pode alterar dependências. Leia o resultado e rode build/testes depois. Não aplique atualizações grandes no meio da prova sem necessidade. |
| --- |

## 5. React/Vite: executar e buildar

### 5.1 Dev server

```bash
npm run dev
```

Executa o script vite. No NexusERP, vite.config.js fixa porta 5173.

### 5.2 Build

```bash
npm run build
```

Gera frontend/dist com assets otimizados. Erros de import/sintaxe normalmente aparecem aqui.

### 5.3 Preview

```bash
npm run preview
```

Serve o conteúdo de dist para validar o build. Não é servidor de produção.

### 5.4 Limpeza comum

```bash
# PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json   # só se realmente quiser re-resolver versões
npm install

# CMD
rmdir /s /q node_modules
npm install
```

| Preferência: Se existe package-lock saudável e o problema é node_modules, tente apagar só node_modules e usar npm ci. Apagar lockfile muda a resolução de versões. |
| --- |

## 6. VS Code pela linha de comando

```bash
code .                       # abre pasta atual
code frontend                # abre uma pasta
code arquivo.txt             # abre arquivo
code -r .                    # reutiliza janela atual
code -n .                    # nova janela
code --diff arquivo1 arquivo2
code --list-extensions
code --install-extension publisher.extensao
code --disable-extensions
```

Se code não for reconhecido, no VS Code procure “Shell Command: Install code command in PATH” quando disponível, ou habilite o instalador/atalho de PATH no Windows.

## 7. VS Code: atalhos e Command Palette

| Ação | Windows/Linux |
| --- | --- |
| Command Palette | Ctrl+Shift+P |
| Quick Open / arquivo | Ctrl+P |
| Terminal integrado | Ctrl+` |
| Buscar no projeto | Ctrl+Shift+F |
| Substituir no projeto | Ctrl+Shift+H |
| Ir para definição | F12 |
| Peek definition | Alt+F12 |
| Renomear símbolo | F2 |
| Formatar documento | Shift+Alt+F |
| Comentar linha | Ctrl+/ |
| Multi-cursor | Alt+Click |
| Mover linha | Alt+↑ / Alt+↓ |
| Duplicar linha | Shift+Alt+↓ |
| Abrir/fechar sidebar | Ctrl+B |
| Salvar tudo | Ctrl+K, S |

### 7.1 Command Palette útil para Java

- Java: Clean Java Language Server Workspace — útil quando cache do Java no VS Code fica estranho.
- Java: Restart Java Language Server — reinicia análise Java.
- Maven: Execute Commands — permite escolher goals Maven pela interface, se extensão Maven estiver instalada.
### 7.2 Terminais lado a lado

Abra dois terminais integrados: um em backend com mvn spring-boot:run e outro em frontend com npm run dev. O MySQL fica no XAMPP. Essa separação facilita identificar qual processo falhou.

## 8. PowerShell, CMD e Git Bash: diferenças rápidas

| Tarefa | PowerShell | CMD |
| --- | --- | --- |
| Variável env | $env:NOME="valor" | set NOME=valor |
| Mostrar env | $env:NOME | echo %NOME% |
| Listar arquivos | Get-ChildItem / ls | dir |
| Remover pasta | Remove-Item -Recurse -Force pasta | rmdir /s /q pasta |
| Achar executável | Get-Command java / where.exe java | where java |
| Mudar diretório | cd pasta | cd pasta |

Git Bash usa sintaxe de shell Unix, como export NOME=valor e rm -rf pasta.

## 9. Diagnóstico de portas e processos no Windows

### 9.1 Descobrir quem usa 8080/5173/3306

```text
netstat -ano | findstr :8080
netstat -ano | findstr :5173
netstat -ano | findstr :3306
```

### 9.2 Identificar/finalizar PID

```text
tasklist | findstr 12345
taskkill /PID 12345 /F
```

| Antes de matar processo: Confirme o PID. Porta 3306 provavelmente é o MySQL do XAMPP e não deve ser encerrada se você precisa do banco. |
| --- |

## 10. MySQL/XAMPP: comandos de verificação

```sql
# Se mysql estiver no PATH
mysql -u root -p

SHOW DATABASES;
USE nexuserp;
SHOW TABLES;
DESCRIBE products;
SELECT * FROM users;
SELECT * FROM products LIMIT 10;
```

No XAMPP também dá para usar phpMyAdmin. O terminal é melhor para copiar comandos durante prova e confirmar rapidamente schema/dados.

## 11. Receitas de emergência

| Problema | Sequência curta |
| --- | --- |
| Backend não sobe | mvn -v → conferir MySQL → ler primeiro Caused by → mvn clean spring-boot:run. |
| Dependência Maven estranha | mvn dependency:tree → mvn clean → opcional purge-local-repository. |
| Frontend não instala | node -v/npm -v → apagar node_modules → npm ci ou npm install. |
| Frontend build falha | npm run build → abrir primeiro erro de import/sintaxe. |
| 401 | Network → Authorization Bearer → localStorage token → backend security logs. |
| 403 | Usuário autenticado? role correta? @PreAuthorize? |
| CORS | URL exata do frontend, porta, SecurityConfig e FRONTEND_URL. |
| Banco não conecta | XAMPP MySQL verde → 3306 → URL JDBC → usuário/senha. |
| Porta ocupada | netstat -ano \| findstr :PORT → identificar PID. |

## 12. Comandos do NexusERP — sequência mínima

```bash
# 1) XAMPP: iniciar MySQL

# 2) backend
cd nexuserp/backend
mvn spring-boot:run

# 3) frontend (outro terminal)
cd nexuserp/frontend
npm install
npm run dev

# 4) abrir
# http://localhost:5173
# API: http://localhost:8080/api
```

| Credenciais iniciais do projeto: admin@nexuserp.com / Admin123! e user@nexuserp.com / User123! |
| --- |
