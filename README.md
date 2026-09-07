# ConteAI - Assistente Financeiro Inteligente

O **ConteAI** é uma aplicação financeira full-stack que simplifica o registro e a análise de despesas pessoais. Por meio de comandos de voz e linguagem natural, o usuário pode registrar seus gastos, acompanhar o histórico de transações, visualizar a distribuição das despesas por categoria e consultar um assistente financeiro com inteligência artificial.
A aplicação possui um frontend mobile-first desenvolvido com **Angular, TypeScript e SCSS**, integrado a uma API construída com **Java e Spring Boot**. A integração com a **OpenAI** permite interpretar informações financeiras fornecidas pelo usuário e gerar análises com base nas transações cadastradas.
O backend foi estruturado seguindo os princípios da **Clean Architecture** e do **SOLID**, mantendo as regras de negócio independentes das tecnologias externas e promovendo separação de responsabilidades, baixo acoplamento, testabilidade e facilidade de evolução.
Mais do que um controle de despesas, o ConteAI explora a aplicação prática de inteligência artificial em uma experiência financeira simples, acessível e visualmente consistente.


---

##  Funcionalidades e Showcase

### Captura de Despesas por Voz
Cansado da digitação manual. Basta clicar no botão de gravar e relatar seus gastos naturalmente. A IA converte seu áudio em texto, extrai os valores, categoriza a despesa (Mercado, Automóvel, Farmácia, etc.) e atualiza seu painel em tempo real.

<div align="center">
  <img src="./assets/botao-gravar.png" width="300" alt="Botão Gravar Áudio">
  <img src="./assets/status-gravando.png" width="300" alt="Botão Gravando">
</div>

### Consultor Financeiro IA Integrado
Um consultor contextualizado com os seus dados. Faça perguntas sobre o seu orçamento, peça análises de gastos do mês ou simule cenários. A IA entende o contexto das suas finanças e devolve conselhos práticos e personalizados diretamente na sua tela.

<div align="center">
  <img src="./assets/assistente.png" alt="Demonstração do Consultor IA">
</div>

### Dashboard de Performance Premium
Acompanhe a saúde do seu negócio ou finanças pessoais através de uma interface minimalista estilo "Planner SaaS". Gráficos dinâmicos e tabelas atualizadas instantaneamente mostram a distribuição do seu capital e as últimas transações.

<div align="center">
  <img src="./assets/grafico.png" alt="Print do Dashboard Completo">
</div>

---

## Stack Tecnológico

O ConteAI utiliza Clean Architecture e princípios SOLID para separar as regras de negócio das camadas de interface, persistência e infraestrutura, facilitando a manutenção e a evolução do sistema.

* **Interface Web:** Angular, TypeScript, HTML5, SCSS, Angular Router, Signals e RxJS.
* **Core e API:** Java 25, Spring Boot 4.1.0 e API REST.
* **Inteligência Artificial:** Spring AI e OpenAI, com Whisper para transcrição de áudio, GPT para análise financeira e TTS para síntese de voz.
* **Persistência:** MySQL 9.6, Spring Data JPA e Hibernate.
* **Infraestrutura:** Docker, Docker Compose, Gradle e npm.

---

## Quick Start

### Pré-requisitos

Antes de iniciar, tenha instalado:

* Java 25;
* Node.js e npm;
* Docker Desktop;
* Git.

### 1. Clone o repositório

```bash
git clone https://github.com/PedroHenrique1801/ConteAI.git
cd ConteAI
```

### 2. Configure a chave da OpenAI

Configure a sua Chave da OpenAI No arquivo src/main/resources/application.properties, insira sua chave (ou configure via variável de ambiente na sua IDE):

spring.ai.openai.api-key=SUA_CHAVE_AQUI

### 3. Inicie o backend

Certifique-se de que o Docker Desktop esteja aberto. O Spring Boot utilizará o `compose.yml` para iniciar o container do MySQL automaticamente.

No Windows:

```powershell
.\gradlew.bat bootRun
```

No Linux ou macOS:

```bash
./gradlew bootRun
```

A API ficará disponível em:

http://localhost:8080

### 4. Inicie o frontend

Abra outro terminal na raiz do projeto e execute:

```bash
cd frontend
npm ci
npm start -- --open --proxy-config proxy.conf.json
```

A interface Angular será aberta em:

http://localhost:4200

O frontend utiliza o proxy de desenvolvimento para encaminhar as requisições da interface para a API executada na porta `8080`.
