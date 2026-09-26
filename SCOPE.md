# L.A Pneus — Scope Blueprint

Site suíço de dépannage mobile. Onex / Genève. Fonte visual: van amarela, painéis pretos, logomarca escudo.
Data do brief: 2026-09-17
Status: blueprint. Não é build.

---

## 1. Leitura da van (o que o site herda)

A van é o ativo. Não é um garage com fachada. É oficina que chega.

O que a lateral comunica, em ordem de hierarquia:
- **Nome :** L.A Pneus (amarelo condensado, alto contraste, lê a 20 metros).
- **Celulares suíços :** `078 605 43 01` | `076 642 96 95`.
- **Oferta única na faixa preta :** changement de pneus, plaquettes et disques à domicile.
- **Endereço (constatado na van) :** Av. Bois-de-la-Chapelle 105 - 1213 Onex (nota: Av. de Bel-Air 51/B, 1225 Chêne-Bourg no briefing inicial).
- **Email :** Info@anjospneus.com
- **Escudo :** pneu + chaves cruzadas (plana e soquete) + chave de impacto pneumática laranja + chama + 3 estrelas + wordmark L.A Pneus.
- **Prova de produto :** stack de 3 pneus + disco de freio perfurado + pinça vermelha.

Isso não é marca de concierge. É marca de oficina móvel. Amarelo de frota, preto de painel, tipografia de adesivo. Se o site virar navy + Inter + cards de vidro, a van e o site mentem um para o outro.

### Problema de identidade (resolver antes do primeiro commit):
- Wordmark na van: **L.A Pneus**
- Domínio no email: `anjospneus.com`
- Decisão: marca pública = **L.A Pneus**. Razão social / domínio podem ficar Anjos. O site não mistura os dois no H1.

### O que a van NÃO prova (não inventar no copy):
- plantão 24/7
- estoque de 2000 pneus
- SLA de 30 minutos
- anos de casa
- club VIP
- cobertura de todo o cantão sem restrição

Concorrência em Genève já ocupa esse discurso (SOS Pneus, CaptainPneus). Copiar isso sem operação para cumprir é site genérico com mentira operacional.

**Diferencial real, escrito na van :** pneus E freio (plaquettes + disques) no endereço do cliente. A maior parte do mercado mobile de Genève vende só pneu.

---

## 2. Posicionamento (uma frase)

> **L.A Pneus troca pneus e freio no pátio, no prédio ou no escritório em Onex e na aglomeração de Genève. Você não leva o carro. A van amarela vai.**

### Público:
- particular em Onex, Lancy, Bernex, Confignon, Vernier, Meyrin, Plan-les-Ouates, Carouge, Genève
- frota pequena / PME com estacionamento
- quem precisa de hiver/été sem perder manhã no garage
- quem está com pastilha no fim e não quer desmontar a semana

### Não é:
- e-commerce de pneu
- garage com box e espera
- SOS 24h (a menos que a operação confirme)
- marca premium de jante 22"

**Categoria :** service mobile auto, Genève romande.
**Promessa mensurável no site :** deslocamento + montagem + equilibrage + serrage au couple + freio no local. Sem número inventado de minutos.

---

## 3. Decisões que o agente NÃO pode chutar

Bloqueiam copy, schema e mentions légales:
1. Nome público final e domínio (`lapneus.ch` / `anjospneus.ch` / outro).
2. Razão social, forma jurídica, IDE, TVA se houver.
3. Horário real e se existe urgência noturna.
4. Zona paga vs zona recusada. Lista de communes.
5. Eles vendem o pneu ou só montam o que o cliente já comprou.
6. Marcas trabalhadas (Michelin, Continental, etc.) só se for verdade.
7. WhatsApp oficial. Qual dos dois números.
8. Idiomas v1: FR obrigatório. EN para expatriados em Genève, só se houver tempo. DE não é v1.
9. Foto além da van: intervenção real, ferramentas, freio, pneu hiver. Sem stock Unsplash de mecânico sorrindo.
10. Preço: publicar faixa em CHF ou só "devis". Em Genève o concorrente publica. Transparência ganha. Sem número, não inventar.

Até essas respostas existirem, o site usa placeholders nomeados (`{{IDE}}`, `{{HORAIRE}}`, etc.) e o QA falha se um placeholder vazar.

---

## 4. Arquitetura do site (v1, poucas URLs, cada uma com trabalho)

Idioma canônico: `fr-CH`. URLs curtas, sem `/accueil`.

- `/` **Accueil.** Job: em 8 segundos o visitante sabe o que é, onde atua, e liga.
- `/services/changement-pneus` **Pneus à domicile.** Job: hiver/été, permutation, équilibrage, crevaison se for oferecida.
- `/services/plaquettes-disques` **Freio no local.** Job: o diferencial. Quem pesquisa "plaquettes Genève domicile" cai aqui.
- `/intervention` **Como funciona.** Job: 4 passos concretos, o que o cliente precisa deixar pronto (acesso, chave, tipo de jante).
- `/zones` **Onex + communes.** Job: SEO local e expectativa de deslocamento.
- `/contact` **Telefones, email, endereço, formulário curto, mapa.**
- `/mentions-legales` **UWG / impressum suíço.**
- `/confidentialite` **nLPD.** Sem misturar com mentions.

### Fora do v1:
- blog
- conta cliente
- shop
- club VIP
- 12 landing pages de bairro (gera-se 1 template de zona, não 12 páginas-clone)

---

## 5. Accueil: estrutura (não é template de agência)

Ordem da página, de cima para baixo:
1. **Barra de serviço, não hero cinema.** Van real em crop lateral, sem overlay roxo. H1 em francês, uma linha: o serviço, não o slogan ("Pneus et freins changés chez vous. Onex et Genève."). Dois botões: Appeler 078… e Appeler 076… (links `tel:`). Terceiro, menor: Demander un devis. Sem carousel. Sem H1 "Bienvenue chez L.A Pneus".
2. **Faixa de prova operacional.** Três fatos, não ícones inventados: à domicile / pneus + plaquettes + disques / Av. Bois-de-la-Chapelle 105, 1213 Onex.
3. **Os dois ofícios, lado a lado**, com foto de produto (pneu / disco), link para as páginas de serviço. Não seis cards.
4. **Como a van trabalha.** Quatro passos curtos. Foto da van no meio, não ilustração.
5. **Zona.** Mapa simples + lista de communes. Link para `/zones`.
6. **Bloco de dúvida concreta (não FAQ de 20 itens).** Preciso estar presente? Vocês trazem o pneu? Freio no estacionamento da residência é possível? Pagamento Twint/carte?
7. **Fecho :** de novo os dois números, endereço, email.
8. **Mobile :** barra fixa com Appeler (`tel:`).
9. **Footer em toda página :** nome, endereço, tel, email, Mentions légales, Confidentialité. Acessível em 1 clique.

---

## 6. Design system (tirado da van, não do Tailwind showcase)

Tokens derivados da van real:
- **amarelo frota / texto :** `#E9CF42` / `#F5C400`
- **amarelo carrosseria :** `#E5CD3F`
- **preto painel :** `#131417` / `#111111`
- **fundo de page :** `#F3F1EA` (papel off-white quente)
- **alerta / freio :** `#BD4747` / `#C62828` (vermelho da pinça, uso estrito)
- **laranja acento :** `#E67E22` (chama da van)

### Tipografia:
- **Display :** Grotesca condensada / Flared serif (`Barlow Condensed`, `Oswald` ou serifada lapidar para o wordmark).
- **Corpo :** Grotesca neutra suíça (`Source Sans 3` ou `IBM Plex Sans`), 18–20px no mobile.
- **Numeração de telefone :** tabular, grande, clicável. O telefone é o produto.

---

## 7. Critérios de aceitação e anti-slop

### Passa se:
- Um genebrino em Onex entende em 5 segundos que a van vai até ele
- O polegar acha o 078 e 076 sem caçar
- Pneus e freio têm seções/páginas distintas, técnicas e sem jargão vazio
- A van da foto e o site parecem a mesma empresa
- Mentions légales (UWG) + nLPD existem
- Zero `style=""`
- Zero inglês no UI francês
- NAP idêntico em header, footer, contact, schema

### Falha se:
- Hero "Votre partenaire de confiance" ou "Bienvenue"
- 3 cards "Pourquoi nous choisir" com ícones genéricos
- Preço ou 24/7 inventados
- Formulário opaco sem destino de dados
