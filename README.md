#  ConteAI - Consultor Financeiro Inteligente

Um painel financeiro inteligente e moderno que transforma a maneira como você registra e analisa suas despesas. Desenvolvido com **Inteligência Artificial (OpenAI)** e fundamentado em **Clean Architecture**, o sistema oferece processamento de linguagem natural e RAG para interações financeiras intuitivas.

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

![Demonstração do Consultor IA](./assets/chat.png)

### Dashboard de Performance Premium
Acompanhe a saúde do seu negócio ou finanças pessoais através de uma interface minimalista estilo "Planner SaaS". Gráficos dinâmicos e tabelas atualizadas instantaneamente mostram a distribuição do seu capital e as últimas transações.

![Print do Dashboard Completo](./assets/painel.png)

---

##  Stack Tecnológico

A aplicação isola as regras de negócio de frameworks web e bancos de dados, garantindo máxima escalabilidade:

- **Interface (Client):** HTML5, CSS3 (Custom Properties & Flexbox), Vanilla JS, Chart.js.
- **Core & API:** Java 25, Spring Boot 3+.
- **Inteligência Artificial:** Spring AI (Integração com Whisper para transcrição, GPT para o consultor e TTS).
- **Persistência:** MySQL 9.6, Spring Data JPA, Hibernate.
- **Infraestrutura:** Docker (Spring Boot Docker Compose).

---

### Quick Start

O ambiente de banco de dados é orquestrado de forma transparente via Docker Compose, integrado nativamente ao Spring Boot.

**1. Configure a sua Chave da OpenAI**
No arquivo `src/main/resources/application.properties`, insira sua chave (ou configure via variável de ambiente na sua IDE):

```properties
spring.ai.openai.api-key=SUA_CHAVE_AQUI
```

**2. Inicie os Containers**
Certifique-se de que o **Docker Desktop** está em execução na sua máquina.

**3. Rode a Aplicação**
Execute o comando abaixo na raiz do projeto (a imagem do MySQL será baixada e instanciada automaticamente):

```bash
./gradlew bootRun
```

**4. Acesse o Painel**
A interface completa e os endpoints estarão disponíveis em:  
👉 **http://localhost:8080**
