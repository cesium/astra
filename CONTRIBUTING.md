[mise]: https://mise.jdx.dev/

# 🚀 Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

## 📥 Prerequisites

The following software is required to be installed on your system:

- [Node.js 22+](https://nodejs.org/en/download)
- [Bun 1.2+](https://bun.sh/docs/installation)

You also need the Pombo backend ([atlas](https://github.com/cesium/atlas))
running, since this frontend consumes its API.

We recommend using [mise][mise] to install and manage all the programming
languages' requirements. The required versions are listed in the
`.tool-versions` file, which mise reads.

## 🔧 Setup

First, clone the repository:

```
git clone git@github.com:cesium/astra.git
cd astra
```

Then, if you are using mise, install the required tools:

```
mise install
```

Install the dependencies:

```
bun install
```

Finally, create your environment file and change it as needed:

```
cp .env.sample .env
```

| Variable              | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL of the backend API (defaults to `http://localhost:4000/v1`) |
| `UMAMI_URL`           | URL of your Umami analytics instance                            |
| `UMAMI_WEBSITE_ID`    | Umami website ID                                                |
| `PROD_DOMAIN`         | Production domain                                               |

## 🔨 Development

Start the development server and then open `http://localhost:3000`.

```
bun dev
```

Lint your code.

```
bun lint
```

Format your code.

```
bun format
```

Check the formatting.

```
bun test:format
```

Build for production.

```
bun run build
```

## 🔗 References

You can use these resources to learn more about the technologies this project
uses.

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
