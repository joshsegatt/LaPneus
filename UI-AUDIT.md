# L.A Pneus — Auditoria UI (nível arquivo)

Fonte: maquete atual (prints 2026-09-17) + van.
Uso: colar no repo como UI-AUDIT.md. O agente não redesenha o site. Ele fecha item por item.

---

## Método (não abrir Figma em branco)

Figma aqui é o rigor, não o software. Arquivo Figma só vale se alguém vai entregar layout ao cliente. A fonte de verdade deste projeto é o repo.

### Passo 1. Três viewports fixos
- 390 (iPhone)
- 768 (Tablet)
- 1440 (Desktop)
Screenshot de home, prestations (bloco), contact. Sem scroll infinito. Uma dobra por arquivo.

### Passo 2. Folha de tokens
Eyedrop na van e no mock. Um hex por papel:
- **amarelo frota :** `#F5C400` (adesivo da van / CTA principal)
- **preto header :** `#131417`
- **preto página :** `#0E0E10`
- **creme página :** `#F3F1EA`
- **branco card :** `#FFFFFF`
- **texto principal :** `#131417` (no creme) / `#FFFFFF` (no escuro)
- **texto secundário :** `#555962` (no creme) / `#D0D4DC` (no escuro, contraste WCAG AA)
- **linha :** `#2C303A` (no escuro) / `#DDD9CE` (no creme)
*Proibir terceiro amarelo, rosa de badge, vermelho de filete.*

### Passo 3. Type ramp escrito em px / line-height / weight / tracking
- **display (H1) :** 48px desktop / 36px mobile • line-height 1.05 • weight 800 • tracking 0.5px
- **title (H2) :** 32px desktop / 26px mobile • line-height 1.15 • weight 800 • tracking 0.5px
- **eyebrow :** *Removido da maioria das seções (o H2 já basta).*
- **body :** 18px • line-height 1.5 • weight 400
- **body-sm :** 15px • line-height 1.45 • weight 400
- **label :** 13–14px • line-height 1.2 • weight 700 • uppercase
- **phone (tabular) :** 24–28px • line-height 1 • weight 800 • tabular-nums
- **button :** 18px • height 48px • weight 700 • tracking 0.5px • uppercase
*Uma família condensada no display/title (`Barlow Condensed`). Uma grotesca no resto (`Source Sans 3`). Sem eyebrow em toda seção.*

### Passo 4. Espaço em escala de 8
4, 8, 16, 24, 32, 48, 64, 96. Medir padding real dos cards, gap do hero, altura do header, margem da foto. Tudo que cair em 13, 18, 22, 28 vira o degrau mais próximo.

### Passo 5. Inventário de componentes (uma instância só)
Header, topbar, logo lockup, botão primário, botão secundário, botão telefone, campo, select, textarea, card serviço, passo, pergunta, footer, barra mobile.
Para cada um: default, hover, focus, disabled, error, current.

### Passo 6. Stitch (opcional)
Só depois dos tokens. Quatro telas: home 390, home 1440, contact 390, contact 1440. Stitch gera DESIGN.md. Antigravity aplica. Não gerar 12 telas.

### Passo 7. Review
Diff visual lado a lado. Se o componente não existe no inventário, não entra.

---

## O que a maquete já acertou (não mexer)
- H1: Pneus et freins changés chez vous. Onex et Genève.
- Foto real da van
- Dois tel: visíveis
- Topbar com endereço + linhas
- Prestação dupla (pneu / freio)
- FAQ operacional (ficar ao lado do carro, pneu já comprado)
- Condições de acesso (solo plano, 1,5 m, chave / antivol)
- Nota nLPD no form
- Mentions + confidentialité no footer
- Horário: lundi–samedi sur rendez-vous

---

## Type e lockup

### Header
- Tagline de 3 linhas sob o wordmark aperta o logo e empurra o menu. → *Lockup em 1 linha: escudo + L.A PNEUS.*
- Menu quebra palavra: Comment ça / marche, Secteur Onex & / Genève. → *Menu limpo: Prestations, Secteur, Contact.*
- CTA do header diz APPELER L ATELIER. → *Vocabulário travado: Appeler 078 605 43 01.*

### Hero
- Badge com ícone de camionete é decoração. → *Remover.*
- Terceiro botão DEMANDER UN DEVIS órfão sob o amarelo. → *Alinhar ao lado ou no fluxo dos telefones.*
- Corpo do hero em cinza médio no preto. → *Subir contraste para `#D0D4DC`.*

### Seções
- Eyebrow em tudo: DOUBLE COMPÉTENCE, FONCTIONNEMENT TRANSPARENT, RAYON D ACTION, etc. → *Cortar eyebrows.*

---

## Grid, ritmo, cartão

### Hero 1440
- Coluna de texto e foto não compartilham baseline. Foto tem radius de card de produto e seta de carousel. → *Retirar setas, radius 4 ou 0, alinhar baseline.*
- Faixa amarela cheia com 3 ícones: primeiro item quebra em duas linhas, outros não. → *Cortar a faixa amarela inteira.*

### Serviços
- Card esquerda (cinza/preto) vs Card direita (rosa/vermelho 2px). → *Um sistema unificado. Sem rosa, sem filete vermelho. Um card, uma regra.*

### Passos 01–04
- Quatro tiles desiguais que somem no fundo. → *Lista numerada 1–4 com regra/divisor técnico.*

### Zona
- Parágrafo cortado no meio. → *Texto completo e fluido.*
- Chips de commune + botão sem estado. → *Lista em tipografia limpa, remover botão morto.*
- Card "conditions d'accès" desalinhado. → *Alinhar rigorosamente ao grid.*

### FAQ
- Cada pergunta é card branco com sombra residual. → *Virar lista limpa com divisores.*

### Contact
- Dois cards de alturas diferentes, campos com estilo inconsistente, sem estado de erro/sucesso. → *Grid 12 colunas (col 5 + col 7), alturas harmonizadas, estados :focus-visible, error e success implementados.*
- Placeholder `079 000 00 00` incorreto. → *Ajustar para exemplo suíço padrão.*

### Footer
- Tél 1 / Tél 2 parecia planilha. → *Numeração direta.*
- Cinza no preto WCAG falhando. → *Subir contraste.*
- Copyright limpo sem parênteses jurídicos desalinhados.
- Vocabulário travado em "agglomération genevoise".

---

## Escala alvo (travar no DESIGN.md)
- Topbar: height 36px.
- Header: height 64px.
- Content width: 1120px, gutter 24 mobile / 32 desktop.
- Radius: 4px (ou 0px). A van é chapa.
- Shadow: nenhuma no v1 (zero box-shadow).
- Hairline amarela: 2px, um lugar só (sob o header).
- Botão primário: amarelo `#F5C400`, texto `#131417`, height 48px, pad 0 24px, weight 700.
- Botão secundário: fundo transparente, linha 1px, texto branco no dark / preto no cream.
- Telefone: o primário, `tabular-nums`, área de toque 56px no contact.
- Rótulo único de chamada: `Appeler 078 605 43 01`.
- Campo: height 48px, fundo `#111`, linha `#333` default, amarelo no focus, label acima 13–14px.
