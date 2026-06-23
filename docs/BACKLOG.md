# My Box — Backlog Completo

> Roadmap para transformar o myboxoficial em plataforma completa de gestão de academias, agendamentos, pagamentos e integrações.

**Stack alvo:** React (Cloudflare Pages) + Supabase + Edge Functions + filas assíncronas  
**Última atualização:** Jun/2025

---

## Visão do produto

Plataforma única onde:
- **Visitante** encontra unidade, agenda aula experimental, vira aluno
- **Aluno** gerencia plano, pagamentos, check-ins e histórico
- **Dono da unidade** opera CRM, agenda, alunos, financeiro e NF
- **Admin My Box** governa rede, franquias, integrações e relatórios
- **Canais externos** (Gympass, Wellhub, Google, WhatsApp) alimentam agenda e leads

---

## Legenda de prioridade

| Tag | Significado |
|-----|-------------|
| P0 | Bloqueador / MVP produção |
| P1 | Alto valor, próximo ciclo |
| P2 | Importante, médio prazo |
| P3 | Desejável / futuro |

| Status | Significado |
|--------|-------------|
| ✅ | Concluído |
| 🔄 | Em progresso |
| ⬜ | Pendente |

---

# ÉPICO 0 — Fundação (atual)

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 0.1 | Site marketing (home migrada) | P0 | ✅ |
| 0.2 | Lista e detalhe de unidades (JSON estático) | P0 | ✅ |
| 0.3 | Preview unidades com mapa + GPS | P1 | ✅ |
| 0.4 | Carrossel Swiper na página preview | P1 | ✅ |
| 0.5 | Modal premium de agendamento | P0 | ✅ |
| 0.6 | Supabase: schema (units, profiles, bookings, visits) | P0 | ✅ |
| 0.7 | Auth + perfis (admin, owner, student) | P0 | ✅ |
| 0.8 | Painel admin (dashboard, unidades, agendamentos, usuários) | P0 | ✅ |
| 0.9 | Painel dono (agenda, alunos, visitas, editar unidade) | P0 | ✅ |
| 0.10 | Painel aluno (agendamentos, perfil) | P0 | ✅ |
| 0.11 | Agendamento → magic link aluno | P1 | ✅ |
| 0.12 | Seed 92 unidades no Supabase cloud | P0 | ⬜ |
| 0.13 | Variáveis Supabase no Cloudflare Pages | P0 | ⬜ |
| 0.14 | Auth URLs configuradas no Supabase (redirect produção) | P0 | ⬜ |
| 0.15 | Usuários demo criados (admin/dono/aluno) | P1 | ⬜ |

---

# ÉPICO 1 — CRM & Operação da Unidade

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 1.1 | Kanban de leads (novo → contato → agendado → convertido → perdido) | P1 | ⬜ |
| 1.2 | Timeline de interações por lead/aluno | P1 | ⬜ |
| 1.3 | Tags e segmentação de alunos | P2 | ⬜ |
| 1.4 | Calendário visual (dia/semana/mês) por unidade | P0 | ⬜ |
| 1.5 | Capacidade máxima por horário/modalidade | P1 | ⬜ |
| 1.6 | Bloqueio de horários (feriados, manutenção) | P1 | ⬜ |
| 1.7 | Confirmação automática vs manual de agendamentos | P1 | ⬜ |
| 1.8 | Lembretes por e-mail/WhatsApp (24h e 2h antes) | P1 | ⬜ |
| 1.9 | Check-in do aluno na recepção (QR code) | P1 | ⬜ |
| 1.10 | No-show tracking e regras de reagendamento | P2 | ⬜ |
| 1.11 | Gestão de instrutores/personal trainers | P2 | ⬜ |
| 1.12 | Grade de aulas coletivas editável por unidade | P1 | ⬜ |
| 1.13 | Upload de fotos da galeria da unidade | P1 | ⬜ |
| 1.14 | SEO por unidade (meta, OG, schema LocalBusiness) | P2 | ⬜ |
| 1.15 | Substituir preview ribbon → produção em `/unidades/:slug` | P0 | ⬜ |
| 1.16 | Sincronizar edições da unidade (Supabase) → site público | P1 | ⬜ |
| 1.17 | Multi-unidade para owner (franqueado com várias lojas) | P2 | ⬜ |
| 1.18 | Permissões granulares (recepção, financeiro, gerente) | P2 | ⬜ |
| 1.19 | Export CSV/PDF de agendamentos e alunos | P2 | ⬜ |
| 1.20 | Dashboard com gráficos (visitas, conversão, receita) | P1 | ⬜ |

---

# ÉPICO 2 — Gympass / Wellhub (agendamentos externos)

> **Contexto:** Gympass (Wellhub) permite parceiros receberem check-ins e, em alguns modelos, agendamentos via API de parceiros. A integração exige credenciamento como parceiro Wellhub/Gympass.

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 2.1 | Pesquisa API oficial Wellhub Partner / Booking API | P0 | ⬜ |
| 2.2 | Credenciamento My Box como parceiro (por unidade ou rede) | P0 | ⬜ |
| 2.3 | Tabela `integrations` (provider, unit_slug, credentials, status) | P0 | ⬜ |
| 2.4 | Edge Function: webhook receiver Gympass | P0 | ⬜ |
| 2.5 | Mapeamento gympass_gym_id ↔ unit_slug | P0 | ⬜ |
| 2.6 | Importar agendamentos Gympass → `bookings` (source=gympass) | P0 | ⬜ |
| 2.7 | Sync bidirecional de slots disponíveis (My Box → Gympass) | P1 | ⬜ |
| 2.8 | Check-in Gympass registrado no painel | P1 | ⬜ |
| 2.9 | Reconciliação diária (Gympass vs sistema interno) | P1 | ⬜ |
| 2.10 | UI painel: conectar/desconectar Gympass por unidade | P1 | ⬜ |
| 2.11 | Logs de integração + alertas de falha | P1 | ⬜ |
| 2.12 | TotalPass / ClassPass (fase 2 de parceiros) | P3 | ⬜ |

**Arquitetura sugerida:**
```
Gympass → Webhook → Supabase Edge Function → bookings + notifications
My Box agenda → Cron/Edge Function → push availability → Gympass API
```

---

# ÉPICO 3 — Pagamentos Stone + Recorrência Asaas

> **Stone:** adquirência, POS, link de pagamento, split. **Asaas:** cobranças, boleto, PIX, cartão recorrente, assinaturas.

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 3.1 | Definir modelo comercial (mensalidade, plano anual, day use, experimental paga) | P0 | ⬜ |
| 3.2 | Tabela `plans` (nome, valor, periodicidade, unidade/rede) | P0 | ⬜ |
| 3.3 | Tabela `subscriptions` (aluno, plano, status, gateway) | P0 | ⬜ |
| 3.4 | Tabela `payments` (valor, método, status, gateway_id) | P0 | ⬜ |
| 3.5 | Integração Asaas: criar customer ao converter aluno | P0 | ⬜ |
| 3.6 | Asaas: assinatura recorrente (cartão/PIX automático) | P0 | ⬜ |
| 3.7 | Asaas: webhooks (PAYMENT_RECEIVED, OVERDUE, REFUND) | P0 | ⬜ |
| 3.8 | Edge Function: processar webhooks Asaas | P0 | ⬜ |
| 3.9 | Painel aluno: ver faturas, 2ª via, histórico | P1 | ⬜ |
| 3.10 | Painel dono: inadimplência, recebíveis, MRR por unidade | P1 | ⬜ |
| 3.11 | Stone: link de pagamento avulso (matrícula, produtos) | P1 | ⬜ |
| 3.12 | Stone: split de pagamento franqueado ↔ franqueadora | P2 | ⬜ |
| 3.13 | Stone POS / tap on phone (futuro app recepção) | P3 | ⬜ |
| 3.14 | Cupons e descontos promocionais | P2 | ⬜ |
| 3.15 | Trial gratuito pós-aula experimental (7 dias) | P2 | ⬜ |
| 3.16 | Dunning: fluxo automático cobrança atrasada (e-mail/WhatsApp) | P1 | ⬜ |
| 3.17 | Conciliação financeira (Asaas + Stone vs extrato) | P2 | ⬜ |
| 3.18 | Relatório DRE simplificado por unidade | P2 | ⬜ |

**Arquitetura sugerida:**
```
Aluno contrata plano → Asaas subscription
Webhook Asaas → Edge Function → atualiza subscription + libera acesso
Pagamento avulso → Stone Payment Link → webhook → payments
Dono vê tudo no painel financeiro
```

**Por que Stone + Asaas juntos?**
- **Asaas:** forte em recorrência, boleto/PIX automático, API simples, popular no Brasil
- **Stone:** forte em adquirência presencial, link, split para franquias
- Alternativa unificada: usar só Asaas (cartão recorrente + PIX) no MVP financeiro e Stone depois para POS

---

# ÉPICO 4 — Nota Fiscal (NF-e / NFS-e)

> Emissão fiscal depende do tipo de serviço (mensalidade = serviço, produtos = mercadoria) e município de cada unidade.

### Opções de integração (recomendações)

| Provider | Prós | Contras | Recomendação |
|----------|------|---------|--------------|
| **Focus NFe** | API madura, NFS-e nacional, boa doc | Custo por nota | ⭐ MVP NF |
| **PlugNotas (Tecnospeed)** | Muitas prefeituras, robusto | Setup mais complexo | Rede grande |
| **ENotas** | Focado academias/serviços | Menos flexível | SMB |
| **Bling / Omie** | ERP + NF + estoque | Overkill se só NF | Se quiser ERP |
| **NFe.io** | API simples | Cobertura municipal variável | Alternativa |

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 4.1 | Definir regime fiscal por unidade (CNPJ, IE, certificado A1) | P0 | ⬜ |
| 4.2 | Escolher provider NF (sugestão MVP: **Focus NFe**) | P0 | ⬜ |
| 4.3 | Tabela `fiscal_profiles` (CNPJ, certificado, município, CSC) | P0 | ⬜ |
| 4.4 | Tabela `invoices` (payment_id, nf_number, pdf_url, status) | P0 | ⬜ |
| 4.5 | Edge Function: emitir NFS-e ao confirmar pagamento | P1 | ⬜ |
| 4.6 | Emissão automática mensal (batch assinaturas) | P1 | ⬜ |
| 4.7 | Cancelamento e carta de correção | P2 | ⬜ |
| 4.8 | Envio automático NF por e-mail ao aluno | P1 | ⬜ |
| 4.9 | Painel dono: notas emitidas, pendentes, erros | P1 | ⬜ |
| 4.10 | Armazenamento seguro XML/PDF (Supabase Storage) | P1 | ⬜ |
| 4.11 | Integração contábil (export SPED / contador) | P3 | ⬜ |

**Fluxo sugerido:**
```
Pagamento confirmado (Asaas webhook)
  → Edge Function verifica fiscal_profile da unidade
  → Focus NFe API emite NFS-e
  → Salva invoice + envia PDF ao aluno
```

---

# ÉPICO 5 — Comunicação & Marketing

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 5.1 | WhatsApp Business API (Meta Cloud API ou Z-API/Evolution) | P1 | ⬜ |
| 5.2 | Templates: confirmação agendamento, lembrete, boas-vindas | P1 | ⬜ |
| 5.3 | E-mail transacional (Resend / SendGrid) | P1 | ⬜ |
| 5.4 | Push notifications (PWA) | P3 | ⬜ |
| 5.5 | Campanhas segmentadas (alunos inativos 30+ dias) | P2 | ⬜ |
| 5.6 | NPS pós-aula experimental | P2 | ⬜ |
| 5.7 | Integração Meta Pixel + Conversions API (já parcial) | P1 | ⬜ |
| 5.8 | Google Analytics 4 + eventos de conversão | P2 | ⬜ |
| 5.9 | Chat widget no site (bot triagem → humano) | P3 | ⬜ |

---

# ÉPICO 6 — Aluno & Experiência Mobile

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 6.1 | PWA instalável (manifest + service worker) | P1 | ⬜ |
| 6.2 | Login social (Google, Apple) | P2 | ⬜ |
| 6.3 | Carteirinha digital do aluno | P2 | ⬜ |
| 6.4 | QR check-in na recepção | P1 | ⬜ |
| 6.5 | Histórico de treinos / frequência | P2 | ⬜ |
| 6.6 | Avaliação física (upload PDF, evolução) | P3 | ⬜ |
| 6.7 | Indicação amigo (referral com desconto) | P2 | ⬜ |
| 6.8 | Contrato digital (ClickSign / D4Sign) | P1 | ⬜ |

---

# ÉPICO 7 — Admin Rede & Franquias

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 7.1 | CRUD completo de unidades no admin | P1 | ⬜ |
| 7.2 | Onboarding nova unidade (wizard) | P1 | ⬜ |
| 7.3 | Convite de dono por e-mail | P1 | ⬜ |
| 7.4 | Royalties automáticos (% sobre receita → Asaas split) | P2 | ⬜ |
| 7.5 | Ranking de unidades (conversão, receita, NPS) | P2 | ⬜ |
| 7.6 | Biblioteca de materiais (playbook franqueado) | P3 | ⬜ |
| 7.7 | Auditoria de ações (audit log) | P2 | ⬜ |
| 7.8 | Impersonate user (admin suporte) | P3 | ⬜ |

---

# ÉPICO 8 — Infra, Segurança & DevOps

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 8.1 | Cloudflare Pages deploy automático (GitHub) | P0 | 🔄 |
| 8.2 | Env vars produção (Supabase, Asaas, Stone, Focus) | P0 | ⬜ |
| 8.3 | Supabase Edge Functions (webhooks, NF, Gympass) | P1 | ⬜ |
| 8.4 | Secrets vault (Supabase Vault / CF Workers secrets) | P1 | ⬜ |
| 8.5 | Rate limiting em endpoints públicos | P1 | ⬜ |
| 8.6 | LGPD: termos, privacidade, export/delete data | P1 | ⬜ |
| 8.7 | Monitoramento (Sentry + uptime) | P2 | ⬜ |
| 8.8 | CI: lint + build + test em PR | P1 | ⬜ |
| 8.9 | Staging environment (branch preview CF) | P2 | ⬜ |
| 8.10 | Backup automático Supabase | P1 | ⬜ |
| 8.11 | RLS review + penetration test básico | P1 | ⬜ |

---

# ÉPICO 9 — Conteúdo & Site

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| 9.1 | Migrar termos de uso | P1 | ⬜ |
| 9.2 | Migrar política de privacidade | P1 | ⬜ |
| 9.3 | Blog / notícias (opcional Supabase CMS) | P3 | ⬜ |
| 9.4 | Landing franquias otimizada | P2 | ⬜ |
| 9.5 | Formulário investidor → CRM | P1 | ⬜ |
| 9.6 | Formulário contato → leads Supabase | P0 | ⬜ |

---

# Roadmap por fases

## Fase 1 — Produção MVP (4–6 semanas)
- Épico 0 completo (seed, deploy, auth produção)
- 1.15, 1.4, 1.12, 9.6
- 5.3 e-mail transacional básico

## Fase 2 — CRM & Financeiro (6–8 semanas)
- Épico 1 (kanban, calendário, lembretes)
- Épico 3 MVP (Asaas recorrência + webhooks)
- Épico 4 MVP (Focus NFe NFS-e)

## Fase 3 — Integrações & Escala (8–12 semanas)
- Épico 2 Gympass
- Stone link + split
- 5.1 WhatsApp API
- 6.1 PWA + 6.8 contrato digital

## Fase 4 — Rede & Inteligência (contínuo)
- Épico 7 franquias
- Dashboards avançados
- TotalPass, app nativo (avaliar)

---

# Modelo de dados futuro (extensões)

```sql
-- Integrações
integrations (id, unit_slug, provider, config_json, active)

-- Financeiro
plans, subscriptions, payments, payment_methods

-- Fiscal
fiscal_profiles, invoices

-- Gympass
gympass_gyms (unit_slug, external_gym_id, last_sync)

-- CRM
leads, lead_activities, tags, lead_tags

-- Comunicação
notification_templates, notification_logs
```

---

# Estimativa macro

| Fase | Escopo | Esforço estimado |
|------|--------|------------------|
| Fase 1 | MVP produção | 4–6 semanas |
| Fase 2 | CRM + Asaas + NF | 6–8 semanas |
| Fase 3 | Gympass + Stone + WhatsApp | 8–12 semanas |
| Fase 4 | Rede + analytics | contínuo |

**Total para solução “completa” comercializável:** ~6–9 meses com 1–2 devs + design part-time.

---

# Próximos 5 passos imediatos

1. ⬜ Adicionar `SUPABASE_SERVICE_ROLE_KEY` e rodar `npm run setup:supabase`
2. ⬜ Configurar env vars no Cloudflare Pages (Supabase URL + publishable key)
3. ⬜ Configurar Auth redirect URLs no Supabase dashboard
4. ⬜ Promover `/unidades-preview` → produção em `/unidades`
5. ⬜ Formulário home → tabela `leads` no Supabase

---

*Documento vivo — revisar a cada sprint.*
