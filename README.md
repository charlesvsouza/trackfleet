# TrackFleet — Instruções rápidas (Postgres Docker + Migrações)

1) Subir PostgreSQL com Docker
- Na raiz do repositório:

````````
docker-compose up -d
````````

2) Aplicar migrações
- A partir da raiz do repo:
````````
mix ecto.migrate
````````

# Dependências
- Certifique-se de ter as seguintes dependências instaladas:
  - Docker
  - Docker Compose
  - Elixir
  - Phoenix
  - Postgres
  - NodeJS
  - npm
  - yarn
  - Vulcan

# Scripts úteis
- Para ajudar no desenvolvimento, alguns scripts estão disponíveis:
  - `dev`: Inicia o servidor Phoenix e o banco de dados Docker
  - `test`: Executa os testes automatizados
  - `lint`: Executa o linting no código fonte
  - `format`: Formata o código fonte utilizando as configurações do projeto

# Dicas
- Sempre ative o ambiente virtual antes de instalar novas dependências ou executar scripts
- Mantenha as imagens e contêineres do Docker atualizados
- Consulte a documentação oficial do Phoenix e do Elixir para mais informações sobre como utilizar o framework
- Utilize o sistema de migrations do Ecto para gerenciar alterações no banco de dados
- Explore os painéis do Docker para monitorar o uso de recursos pelos contêineres
- Use o Tonic para testes de API
- Utilize o Insomnia ou Postman para testar os endpoints da aplicação
- Considere usar um gerenciador de versões do Elixir, como o asdf, para facilitar o gerenciamento de versões do Elixir e do Erlang
- Para uma melhor performance durante o desenvolvimento, utilize a versão mais recente do Docker e do Docker Compose
- Aproveite os recursos de debugging do VSCode, caso o utilize como editor
