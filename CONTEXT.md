# L.A Pneus — Memória e Contexto do Projeto (Handover & Brain)

Este documento registra todo o conhecimento acumulado, decisões de arquitetura, configurações de produção, credenciais públicas e regras de negócio para permitir continuidade perfeita entre sessões ou contas do Antigravity.

---

## 1. Identidade e Contatos Oficiais da Empresa
- **Nome Oficial :** L.A Pneus (Atelier Mobile de Pneumatiques & Freinage)
- **Área de Atuação :** Cantão de Genebra (Genève) e Cantão de Vaud (Suíça Romande)
- **Domínio Oficial :** [https://www.lapneus.ch](https://www.lapneus.ch) (com redirecionamento de `https://lapneus.ch`)
- **E-mail Oficial :** `info.lapneus@gmail.com`
- **Telefone Dépannage Urgent (24/7) :** `078 605 43 01` (`href="tel:+41786054301"`)
- **Telefone Secundário :** `076 642 96 95`
- **Conta TWINT (Club Privilège) :** `076 771 86 87`

---

## 2. Infraestrutura, Hospedagem e CI/CD
- **Repositório GitHub :** [https://github.com/joshsegatt/LaPneus](https://github.com/joshsegatt/LaPneus) (branch `main`)
- **Hospedagem de Produção :** Vercel Edge CDN (`https://lapneus.vercel.app` e `https://www.lapneus.ch`)
- **Configuração Vercel :** [`vercel.json`](file:///c:/Users/Joshsegatt/Desktop/LApneus/vercel.json) (`framework: null`, `cleanUrls: true`)
- **DNS Registrar :** Namecheap (`lapneus.ch`) apontando para Vercel via A Record (`216.198.79.1` ou `76.76.21.21`) e CNAME (`cname.vercel-dns.com` / `vercel-dns-017.com`).
- **Certificados SSL :** Let's Encrypt gerenciado automaticamente pela Vercel com HSTS ativo.

---

## 3. Arquitetura do Código
- **Estrutura de Arquivos :**
  - Raiz (`index.html`, `tarifs.html`, `styles.css`, `component-explorer.js`, `horizon-slider.js`, `assets/`) -> Servidos diretamente pela CDN.
  - `preview/` -> Código fonte editável e sincronizado.
  - `dist/` -> Pasta compilada gerada pelo build.
  - `scripts/build.js` -> Sincroniza `preview/` e `public/` para a raiz e para `dist/`.
  - `scripts/dev-server.js` -> Servidor Node.js local para testes rápidos (`npm start` na porta 3000).
- **Comandos :**
  - `npm start` : Inicia o servidor local em `http://localhost:3000`.
  - `npm run build` : Compila os assets e gera a versão de produção.
  - `npm test` : Roda a bateria de testes de conformidade, links telefônicos e design tokens.

---

## 4. Formulários e Fluxos de Dados
1. **Formulário de Devis (Landing Page) :**
   - Transmissão assíncrona via `https://formsubmit.co/ajax/info.lapneus@gmail.com`.
   - Organizado com assunto formatado: `Nouvelle Demande de Devis — L.A Pneus`.
   - 100% isolado do sistema de assinaturas VIP.
2. **Formulário de Assinaturas (Club Privilège na Página de Tarifas) :**
   - Integrado via webhook ao Google Apps Script ([`google-sheets/Code.gs`](file:///c:/Users/Joshsegatt/Desktop/LApneus/google-sheets/Code.gs)).
   - Registra dados na planilha do Google e envia instruções de pagamento via TWINT (`076 771 86 87`).

---

## 5. SEO, Schema.org e Metadados
- **Título Oficial (Sem hífens) :** `L.A Pneus • Montage Pneus et Freins à Domicile Genève et Vaud`
- **Descrição de Alto CTR :** *Atelier mobile certifié sur Genève et Vaud. Montage de pneus et entretien freins chez vous ou au travail. Tarifs clairs et dépannage rapide au 078 605 43 01.*
- **Schema.org JSON-LD :** Configurado com `AutoRepair`, `LocalBusiness`, `FAQPage` e tags geolocalizadas suíças (`CH-GE`, `CH-VD`).
- **Arquivos SEO :** [`sitemap.xml`](file:///c:/Users/Joshsegatt/Desktop/LApneus/sitemap.xml) e [`robots.txt`](file:///c:/Users/Joshsegatt/Desktop/LApneus/robots.txt) apontando para o domínio canônico `https://lapneus.ch/`.
