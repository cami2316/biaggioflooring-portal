# Estimate Form Submission Audit

Date: 2026-03-03

## A1) Mapa do fluxo atual
- Step 1 (Project Info) → Step 2 (Areas) → Step 3 (Review)
- `handleNext()` valida Step 0 (`trigger` em campos base) e Step 1 (`trigger('areas')`)
- `onSubmit()` faz POST `/api/estimate`, salva em Firestore e redireciona para `/estimate/[id]`
- Validações principais:
  - `step1Valid` exige ao menos 1 area com `sqft > 0` e material/surface/showerType quando aplicável
  - `isEstimateReady` controla a mensagem do Review
  - Botão Submit depende de `step1Valid`

## A2) Reproduzir e isolar a causa
- A área inicial existia, mas era possível ficar com `areas.length === 0` em alguns fluxos do `useFieldArray`.
- O Review exibindo “Complete all required fields” vinha de `isEstimateReady === false`.
- A tela final exibia erro quando tentava depender de refetch; agora não depende mais de refetch.
- `sqft` string ou vazio podia invalidar o estado; foi normalizado para número com fallback `0`.
- Material/surface/showerType são obrigatórios somente quando `sqft > 0` e tipo exige.

## A3) Logs de diagnóstico (temporários)
- A análise foi feita por inspeção do fluxo e ajustes diretos.
- Nenhum log de diagnóstico foi mantido no código final.

## Correções aplicadas (resumo)
- Garantir sempre 1 área inicial (default) e permitir envio com 1 área preenchida.
- Tela final fixa confirma envio e não mostra “não encontramos detalhes”.
- Envio de email teste não existe no submit real; apenas emails interno + cliente.

## Testes manuais mínimos
1. Caso A: 1 área floor 100 sqft + material → submit OK → confirmação + spam warning.
2. Caso B: shower com surface + showerType → submit OK.
3. Verificar emails: cliente (range + spam) e interno (detalhes completos), sem email test.

## Comandos
- npm run build
- npm run lint (falha atual: “Invalid project directory provided, no such directory: /Users/migraciosa/biaggioflooring/lint”)
