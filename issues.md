# Issues para Rheology Dashboard

A seguir estão 14 issues detalhadas (título, descrição, prioridade, estimativa, critérios de aceitação, labels e checklist). Pode copiar/colar cada seção como descrição de uma issue no GitHub.

---

## Issue 1 — Validação e limpeza de dados (Data QA)
- Prioridade: alta
- Estimativa: 3–5 dias
### Descrição
Validação robusta de dados ao importar arquivos (CSV/XLSX). Funcionalidades:
- Detectar tipos de colunas (numérico vs texto) automaticamente.
- Normalizar números (vírgula → ponto), remover espaços e caracteres não numéricos.
- Identificar valores faltantes por coluna e permitir opções: preencher, ignorar linha ou abortar import.
- Detectar outliers via IQR e z-score e permitir marcação/filtragem.
- Exibir um resumo QA (nº pontos válidos, nº rejeitados, colunas problemáticas) antes de aplicar os dados.
- Gerar warnings/erros amigáveis e logs para console.

### Critérios de aceitação
- Ao importar, a UI mostra warnings se houver colunas não numéricas onde se esperam números.
- O usuário pode aplicar filtros para remover linhas inválidas antes de popular a tabela.
- Gráficos não quebram com NaN; pontos inválidos são ignorados.
- Um resumo QA é exibido com contagens de aceitos/rejeitados.

Labels: enhancement, high priority, data-quality

Checklist:
- [ ] Normalização de decimal implementada
- [ ] Detecção de tipos por coluna
- [ ] Relatório QA visual
- [ ] UI/ações para remoção/substituição de linhas inválidas
- [ ] Testes básicos de parsing e edge-cases

---

## Issue 2 — Export completo do experimento (pacote ZIP)
- Prioridade: alta
- Estimativa: 2–3 dias
### Descrição
Botão "Exportar pacote" que gera um ZIP contendo:
- CSV(s) originais e CSV(s) processados (tabelas visíveis).
- PNGs dos gráficos ativos (um por seção).
- arquivo JSON com mapeamentos usados, metadados do experimento e observações.
- relatório HTML simples (ou PDF) com resumo dos parâmetros, tabelas e imagens dos gráficos.

### Critérios de aceitação
- Clique em “Exportar pacote” baixa um ZIP com estrutura previsível (ex.: /raw, /processed, /charts, report.html, mapping.json).
- O report.html abre localmente e mostra tabela + imagens.

Labels: enhancement, high priority, export

Checklist:
- [ ] Gerar CSVs processados
- [ ] Exportar gráficos como PNG
- [ ] Criar JSON de metadados e mapeamentos
- [ ] Empacotar tudo em ZIP e disponibilizar download
- [ ] Gerar HTML de relatório simples (template)

---

## Issue 3 — Persistência remota / backend mínimo (API)
- Prioridade: média-alta
- Estimativa: 1–2 semanas (backend + front integration)
### Descrição
Criar endpoints REST simples para:
- Autenticação básica por token (sem SSO por enquanto).
- Upload de experimentos (arquivos + metadata) → retorna experiment_id.
- Listagem e download de experimentos salvos.
- Endpoints: POST /experiments, GET /experiments, GET /experiments/:id, DELETE /experiments/:id.
Implementar front-end “Salvar no servidor” e “Abrir experimento remoto”.

### Critérios de aceitação
- Backend aceita upload e retorna ID; front-end consegue salvar/recuperar por esse ID.
- Autenticação via token configurável no front-end.
- Permissões básicas: apenas token válido permite escrever.

Labels: backend, api, medium priority

Checklist:
- [ ] Esqueleto do backend (ex.: Node/Express ou Flask)
- [ ] Endpoints de CRUD para experimentos
- [ ] Validação mínima de payloads
- [ ] Integração front-end (botão salvar/carregar)
- [ ] Documentação de uso e token

---

## Issue 4 — Modelagem rheológica automática
- Prioridade: média
- Estimativa: 2–3 semanas
### Descrição
Implementar análises automáticas científicas:
- Ajustes de modelos viscoelásticos (Maxwell 1/2 elementos, Burgers) para dados de creep.
- Cálculo de tempo(ões) de relaxação a partir de frequency sweep (ex.: ω onde G' = G'').
- Cálculo de área do loop histerético e índice tixotrópico (para tixotropia).
- Quantificação de overshoot para start-up (amplitude do pico relativo e tempo até pico).
- UI: botão “Ajustar modelo” que exibe parâmetros e curva ajustada (overlay).

### Critérios de aceitação
- Ajustes convergem e exibem parâmetros com métricas de qualidade de fit (ex.: R²).
- Visualização com curva ajustada sobreposta.
- Cálculo de métricas (τ, área do loop, overshoot %) acessíveis no painel.

Labels: analysis, scientific, medium priority

Checklist:
- [ ] Biblioteca de ajuste (e.g., MathJS, optim)
- [ ] Implementar Maxwell e Burgers (fit + bounds)
- [ ] UI para executar ajuste e visualizar resultados
- [ ] Testes com datasets exemplo

---

## Issue 5 — Visualizações avançadas e interatividade
- Prioridade: média
- Estimativa: 4–6 dias
### Descrição
Melhorias de UX nos gráficos:
- Zoom/pan interativo, seleção por box e reset.
- Tooltips melhorados com valores e metadados.
- Seleção de intervalo no eixo X e cálculo de estatísticas (mean, std, count).
- Export SVG além de PNG.

### Critérios de aceitação
- Usuário pode fazer zoom e dar reset; seleção exibe estatísticas do intervalo.
- Export SVG funcional e gráfico permanece legível.

Labels: enhancement, ux, medium priority

Checklist:
- [ ] Ativar zoom/pan (Chart.js plugin ou outra lib)
- [ ] Seleção de área e painel de estatísticas
- [ ] Export SVG/PNG integrado
- [ ] Tooltips customizados

---

## Issue 6 — Mapeamentos persistentes e heurística aprimorada
- Prioridade: média
- Estimativa: 2–3 dias
### Descrição
Permitir múltiplos mapeamentos salvos por padrão de arquivo (nome/regex) e aplicar automaticamente no upload:
- Gerenciar mapeamentos (listar, editar, renomear, deletar).
- Fuzzy matching para detectar colunas parecidas (levenshtein ou heurística).
- Permitir salvar mapeamento como “por arquivo” (ex.: pattern: "run_.*_amp.csv").

### Critérios de aceitação
- Upload de arquivo com nome correspondente aplica mapeamento automaticamente.
- UI apresenta qual mapeamento foi aplicado e permite override.

Labels: enhancement, low-medium priority

Checklist:
- [ ] CRUD de mapeamentos no front-end (localStorage)
- [ ] Interface para regex/nome do arquivo
- [ ] Heurística fuzzy implementada
- [ ] Testes manuais

---

## Issue 7 — Suporte a pacotes/ZIP e pré-processamento
- Prioridade: baixa-média
- Estimativa: 3–5 dias
### Descrição
- Aceitar ZIPs contendo múltiplos CSV/XLSX e processar cada run.
- UI para escolher “unir” múltiplos arquivos em uma tabela ou importar separadamente.
- Possibilidade de executar scripts de pré-processamento (plugins JS simples) — primeiro como template/placeholder.

### Critérios de aceitação
- Upload de ZIP processa arquivos dentro; interface lista cada run.
- Usuário escolhe “merge” ou “separate”.

Labels: enhancement, medium priority

Checklist:
- [ ] Parser de ZIP (JS Zip lib)
- [ ] UI para visualizar arquivos internos e escolher operações
- [ ] Merge básico de colunas compatíveis
- [ ] Documentação de formato esperado

---

## Issue 8 — Testes automatizados e CI
- Prioridade: média
- Estimativa: 3–5 dias
### Descrição
- Escrever testes unitários para parsing (CSV/XLSX), mapeamento e QA.
- Testes E2E para fluxo de import → mapear → visualizar → exportar (Playwright/Cypress).
- Configurar CI (GitHub Actions) para rodar linter + testes em cada PR.

### Critérios de aceitação
- Pipeline que roda linter e testes e falha se regressão detectada.
- Cobertura mínima para parsing e funções críticas.

Labels: ci, tests, medium priority

Checklist:
- [ ] Unit tests para parse/normalize
- [ ] E2E básico (import-export)
- [ ] GitHub Actions workflow
- [ ] Documentação para rodar localmente

---

## Issue 9 — Internacionalização e acessibilidade (a11y)
- Prioridade: média
- Estimativa: 2–3 dias
### Descrição
- Separar strings para permitir PT/EN (i18n simples).
- Revisar contraste, adicionar ARIA labels e garantir navegação por teclado.
- Rodar checks com axe-core e corrigir problemas críticos.

### Critérios de aceitação
- Painel alterna idioma (PT/EN) para strings principais.
- axe-core sem erros críticos na página principal.
- Elementos importantes têm ARIA e foco navegável.

Labels: accessibility, i18n, medium priority

Checklist:
- [ ] Extrair strings para arquivo i18n
- [ ] Implementar toggle PT/EN
- [ ] Corrigir erros de a11y reportados por axe
- [ ] Documentar práticas de a11y

---

## Issue 10 — UI/UX refinamentos e responsividade
- Prioridade: média
- Estimativa: 3–5 dias
### Descrição
- Melhorar mobile layout, toasts (sucesso/erro), indicadores de carregamento durante parsing e export.
- Componentes reutilizáveis e consistência visual.
- Pequenas animações e feedbacks para ações longas.

### Critérios de aceitação
- Parsers e export mostram loader; operações longas não bloqueiam UI.
- Toaster visível para sucesso/erro.
- Layout responsivo testado em 320–1440 px.

Labels: ux, enhancement, medium priority

Checklist:
- [ ] Implementar toasts
- [ ] Loaders para parsing/export
- [ ] Ajustes CSS responsivos
- [ ] Testes visuais em dispositivos

---

## Issue 11 — Histórico de versões / undo local
- Prioridade: opcional
- Estimativa: 3–5 dias
### Descrição
- Manter histórico local das ações críticas (import, edição de célula, mapeamento) e permitir undo/redo e salvar checkpoints.
- Interface “histórico” com timestamps e opção de restaurar.

### Critérios de aceitação
- Usuário pode desfazer a última ação e restaurar uma versão anterior.
- Histórico persiste localmente entre sessões (opcional).

Labels: enhancement, optional

Checklist:
- [ ] Implementar estrutura de histórico (stack)
- [ ] Undo/redo para edições de célula e importações
- [ ] UI de histórico e restauração

---

## Issue 12 — Segurança e privacidade (se houver backend)
- Prioridade: alta (se backend)
- Estimativa: 2–4 dias
### Descrição
- Garantir comunicação via HTTPS, armazenar tokens com segurança no cliente e no servidor (se aplicável).
- Políticas de retenção de dados, endpoints protegidos e revisão de exposição de dados.

### Critérios de aceitação
- Todas as chamadas ao backend usam HTTPS.
- Tokens não expostos em logs; documentação de retenção.
- Autenticação básica testada.

Labels: security, high priority

Checklist:
- [ ] Forçar HTTPS no server
- [ ] Armazenar tokens de forma segura no cliente
- [ ] Política de retenção documentada
- [ ] Revisão de endpoints públicos

---

## Issue 13 — Documentação e exemplos
- Prioridade: alta
- Estimativa: 1–2 dias
### Descrição
- README com instruções de instalação e uso.
- Pasta /examples com CSV/XLSX de exemplo para cada tipo de teste.
- Guia de interpretação detalhado (amplitude, frequency, tixotropy, creep, startup).
- Pequeno tutorial (slides ou gifs) para os fluxos principais.

### Critérios de aceitação
- README cobrindo setup, exemplos e uso do mapeador.
- Arquivos de exemplo disponíveis e carregam sem erros.

Labels: docs, high priority

Checklist:
- [ ] README atualizado
- [ ] /examples com pelo menos 1 arquivo por teste
- [ ] Guia de interpretação em docs/interpretation.md
- [ ] Capturas/gifs de tutorial

---

## Issue 14 — Integração com LIMS/ELN e automações (opcional)
- Prioridade: opcional/baixa
- Estimativa: 1–3 semanas dependendo do endpoint
### Descrição
- Implementar adaptadores para enviar resultados a sistemas externos (LIMS, ELN) via API.
- Automatizar criação de PR/relatório com resultados (opcional).

### Critérios de aceitação
- Exemplo de integração com endpoint externo (mock) que aceita JSON do experimento.
- Documentação sobre como configurar uma integração.

Labels: integration, optional

Checklist:
- [ ] Adapter básico para POST de experimento
- [ ] Exemplo de configuração
- [ ] Documentação