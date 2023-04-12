Desenvolvendo uma aplicação web de página única utilizando html, css e javascript para controle de finanças pessoais que atenda aos seguintes requisitos:

- Aplicação deverá utilizar a biblioteca json-server para simular um backend que armazena transações financeiras.
- Transações devem possuir, pelo menos, as propriedades id (gerenciado pelo json-server), nome e valor.
- A aplicação deverá mostrar na página todas as transações salvas no backend.
- A aplicação deverá ter um formulário para criar uma nova transação no backend (sem atualizar a página) através de uma requisição POST.
- Novas transações criadas devem aparecer na lista de todas as transações assim que são criadas, tudo isso sem atualizar a página.
- A aplicação deverá permitir editar os dados de uma transação através de uma requisição PUT (o PUT funciona da mesma forma que o POST, enviando dados a serem atualizados no body e com o id do recurso a ser editado na url).
- A aplicação deverá permitir excluir uma transação através de uma requisição DELETE (as requisições DELETE não precisam de um body, apenas do id do recurso a ser excluído na url).
- A aplicação também deverá mostrar na página o saldo total, que é calculado somando todos os valores das transações (que podem ser positivos ou negativos).
- O valor do saldo total deve estar sempre atualizado na tela, ou seja, ao criar, editar ou excluir uma transação o saldo deverá refletir o novo valor.
