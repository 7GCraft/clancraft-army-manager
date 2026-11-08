# Clancraft Army Manager

Clancraft Army Manager is a Web application built using Vue/Tailwind CSS and Express.js to display, manage, and edit armies of states that are in the game "Clancraft" made for the server 7GCraft. The app features the ability to add and generate units, edit them, as well as editing their different values. It also includes a unit list that displays all the unit types that are available in the game at the moment. It has a simple backend using express.js that is responsible for storing and retrieving the army data responsible for every state.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
npm run serve-prod
```

## Docker deployment

Build and start the production application with Docker Compose:

```sh
docker compose up -d --build
```

The application listens on `http://127.0.0.1:3000` by default. Its data is
stored in the `army-manager-data` Docker volume, so it persists across
container recreation. Use `docker compose down -v` only when you intend to
delete all saved application data.

### Caddy reverse proxy

With Caddy installed on the host, proxy your domain to the loopback-bound
container:

```caddy
army.example.com {
  reverse_proxy 127.0.0.1:3000
}
```

Caddy manages HTTPS and forwards both the application and `/api` requests.
To use a different local port, set `PORT` when starting Compose:

```sh
PORT=8080 docker compose up -d
```

Set `BIND_ADDRESS=0.0.0.0` only when the application must be reachable without
a local reverse proxy.

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
