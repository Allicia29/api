Esta é uma API RESTful desenvolvida em Node.js/JavaScript que tem a finalidade de gerenciar pedidos em um sistema.

O termo técnico completo é CRUD API para Gestão de Pedidos.



API (Interface de Programação de Aplicativos): Permite que outros sistemas de software (como um e-commerce, um aplicativo móvel ou um sistema de faturamento) enviem e recebam informações sobre pedidos de forma padronizada via internet.

RESTful: Ela segue as convenções da arquitetura REST, utilizando métodos HTTP padrão (POST, GET, PUT, DELETE) para realizar operações em recursos (os pedidos).

Node.js/JavaScript: É a tecnologia de backend escolhida para sua implementação.

A principal utilidade desta API é ser o ponto central de dados para os pedidos, realizando as quatro operações fundamentais do CRUD:

1. Criação de Pedidos (Create)

Endpoint: POST /order

Serviço: Recebe dados brutos (como numeroPedido, valorTotal) e é responsável por fazer o Data Mapping (mapeamento de dados).

Mapeamento: Transforma a estrutura dos dados de entrada (numeroPedido, valorTotal) para a estrutura de armazenamento no banco de dados (orderId, value), garantindo que a informação seja salva corretamente nas tabelas Order e Items.

2. Consulta de Pedidos (Read)

Endpoints: GET /order/:orderId e GET /order/list

Serviço: Permite a busca por um pedido específico ou a listagem de todos os pedidos salvos no banco de dados.

3. Atualização de Pedidos (Update)

Endpoint: PUT /order/:orderId

Serviço: Permite modificar o estado ou os dados de um pedido existente (ex: mudar a quantidade de um item, alterar o endereço).

4. Exclusão de Pedidos (Delete)

Endpoint: DELETE /order/:orderId

Serviço: Permite remover um pedido e todos os seus itens relacionados do banco de dados, mantendo a integridade dos dados.
