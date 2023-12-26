# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command


1 - Lógica de Sugestão de horários de acordo com ocupação

- Ter todos os qtd somadas por horários do dia
- Ordenar a lista asc quantidade
- A primeira metade (menos reservas nesses horários) será dividida em 2 novamente
- A primeira metade dessa lista 25%, os horários menos ocupados de todos receberam um desconto
- A segunda metade serão segundos lugares menos ocupados, o que vai levar eles a serem sugeridos... balancendo e otimizando a ocupação.

2 - Lógica de Sugestão de horários baseado nos últimos 7 dias
- Ter todos os hrarios somados por dia da semana dos 7 dias 
- A primeira metade (menos reservas nesses horários) será dividida em 2 novamente
- A primeira metade dessa lista 25%, os horários menos ocupados de todos receberam um desconto
- A segunda metade serão segundos lugares menos ocupados, o que vai levar eles a serem sugeridos... balancendo e otimizando a ocupação.
