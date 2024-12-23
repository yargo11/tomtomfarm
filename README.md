## Project Overview

### Nome do Projeto: Tomtom Farm

### Objetivo:

Tomtom Farm é uma aplicação projetada para o cadastro e gestão de fazendas. O sistema permite que os usuários registrem fazendas, com informações detalhadas como nome, endereço, email, tamanho do terreno, unidade de medida do tamanho, data de criação e data de atualização. Além disso, é possível associar plantios específicos a cada fazenda.

### Funcionalidades Principais:

Cadastro de Fazendas: Os usuários podem cadastrar fazendas, informando dados como nome, endereço, tamanho do terreno e as datas de criação e atualização.
Cadastro de Plantios: É possível registrar plantios (como milho, soja, etc.), que possuem dois estados: Irrigados e Seguros.
Associação de Plantios a Fazendas: Após cadastrar plantios, o usuário pode adicioná-los à fazenda, permitindo que ele crie fazendas com diferentes tipos de cultivo, como uma fazenda que produza milho, por exemplo.
Gerenciamento de Dados: Os dados das fazendas e dos plantios podem ser facilmente atualizados conforme necessário.
Tecnologias Usadas:

### Frontend: [React, NextJS, NextUI, Nivo-Charts, Tailwind]

### Banco de dados: [json-server]

## Local Development Instructions

Pré-requisitos
Antes de começar o desenvolvimento localmente, você precisará ter as seguintes ferramentas instaladas:

Node.js (versão 16.x ou superior)
npm ou yarn (gerenciadores de pacotes)
Git (para clonar o repositório)

Passos para Rodar Localmente

### Clonar o Repositório

```bash
git clone https://github.com/yargo11/tomtomfarm.git
cd tomtomfarm
```

### Instalar Dependências

Instale as dependências do projeto usando o npm ou yarn:

```bash
npm install
# ou
yarn install
```

### Rodar o Projeto

Para iniciar o ambiente de desenvolvimento local, execute o seguinte comando:

```bash
npm run dev
# ou
yarn dev
```

### Instalar e Rodar o JSON-Server

O projeto utiliza o json-server para simular uma API local. Para rodá-lo, execute:

```bash
npm install -g json-server
# ou
yarn global add json-server
```

Em seguida, inicie o json-server com o comando:

```bash
json-server --watch db.json --port 3000
```

Isso criará uma API local acessível em http://localhost:3000.

O projeto estará acessível em http://localhost:3001 no seu navegador.

### Construir o Projeto

Para gerar a versão de produção do projeto, use o comando:

```bash
npm run build
# ou
yarn build
```

## Dependências do Projeto

Frontend:

next: Framework para React.
react e react-dom: Bibliotecas essenciais do React.
@nextui-org/react: Biblioteca de componentes de UI.
framer-motion: Biblioteca para animações.
tailwindcss e postcss: Para estilos e design responsivo.
Ferramentas de Desenvolvimento:

biome: Ferramenta de linting para garantir a qualidade do código.
prettier: Ferramenta para formatação automática do código.
typescript: Superset do JavaScript para tipagem estática.

## License

# Next.js & NextUI Template

This is a template for creating applications using Next.js 14 (app directory) and NextUI (v2).

[Try it on CodeSandbox](https://githubbox.com/nextui-org/next-app-template)

## Technologies Used

- [Next.js 15](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [nivo-charts](https://nivo.rocks/)
- [uuid](https://www.npmjs.com/package/uuid)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/nextui-org/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
