![Logo of the project](https://w.wallhaven.cc/full/qd/wallhaven-qdolvd.png)

# Dashboard

## ***Still in development***

Dashboard for social media, communication and connect everything into one tool.

### Notes

It is small application so why I made local packages like vault, redis, service, crypto or common instead of keeping it in server directory?
For now it looks stupid but I wanted to have control over some functionality and keep it separated. Reuse it in other projects/platforms.
Few versions earlier all functionality I was keeping in server package but with time and more "experience" it was better choice to separate some things.
I want to learn more about redis, create own implementation of client (for learning purposes) but for now it uses ioredis.
For vault I could use node-vault but like redis package, I want to make my own implementation.
I'm not experienced nor can't call myself "developer" but I'm trying and wants to learn more and more.
Trying my best to keep code clean and write simple/complex things without using google/stackoverflow or existing packages.
Earlier I was writing some functionality like omit/pick from lodash, reactivex functionality without using reactivex library, virtual dom like vdom from react (client-vanilla package as proof for myself)
but as time goes by and learned how things works, I started to use existing libraries.

For now only few packages works crypto, common, redis, service, vault, server. Client needs to be fixed and client-vanilla is still here as proof for myself that I can write somehow complex things.

## TODO

[ ] Add option for offline/online storage. Offline will be only encrypted file and online will contain postgres and vault.

[ ] Create mobile version with offline/online storage.

[ ] Rewrite service/crypto/vault package in rust and compile to WASM.


## Used tools

__Backend__
* Node.js
* TypeScript
* TypeORM
* ApolloServer
* Redis
* Vault

__Frontend__
* Vue.js (Earlier I was using react but for such a small project it was overkill)
* RxDB
* Sass
* Apollo Boost

---
## Installing / Getting started

A quick introduction of the minimal setup you need to get up & running.

```shell
git clone https://gitlab.com/V3rn0n/flerovium.git
cd flerovium/
docker-compose -f config/service.yml up --build
docker-compose -f config/run.yml up --build
```

### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing the project further:

```shell
docker-compose -f config/service.yml -f config/service.dev.yml up --build
docker-compose -f config/run.yml -f config/run.dev.yml up --build
```

Service.yml will start `redis`, `vault`, `traefik` and `postgres`

Run.yml - `node.js`

### Deploying / Publishing

```shell
docker-compose -f config/service.yml up --build
docker-compose -f config/run.yml up --build
```

Building packages
```shell
lerna exec yarn deploy
```

---
## Read it first

Every request send to graphql must contains `authorization: Bearer ...token...` header. You will get `token` when you create account and authenticate it.
Before use packages you need to set few environment variables.
> REDIS_ADDR - http://127.0.0.1:7777 - path to redis

> VAULT_ADDR - path to vault service eg. http://127.0.0.1:8305/v1/ - only if you want dynamic passwords for encryption

> VAULT_TOKEN - for now I have implemented only one token in vault authentication. Default vault-dev

> POSTGRES_USER - postgres user - default it's vernontest

> POSTGRES_PASSWORD - postgres password - default without password

> POSTGRES_DB - postgres database name - default FleroviumTest

> POSTGRES_HOST - postgres path - http:// or localhost. It's up to you. Default localhost

> POSTGRES_PORT - postgres port - default 5432

To change CORS settings, use cors.ts in server package, config directory.
Setup your own traefik configuration in config/traefik.toml.
Just change
```
[docker]
domain

[acme]
email
```

## Setting up services (vault, redis, postgres) -->

Vault needs few **v1 k/v** secrets created before running app.
If you want to use vault for encryption then you need create `keys` engine of key/value v1.
Then create secret `services` with values `postgres - random value`.
Otherwise you can use env file for storing keys.


## API

**Every request must contain token in header**

### Query
>   - `authenticate(email: String!, password: String!): User`
>   - `fetch_user(email: String): User`
>   - `fetch_token(email: String): Token`
>   - `refresh_service(email: String): User`

### Mutations
>   - `add_user(data: UserInput!): User`
>   - `modify_user(data: UserUpdate!): Boolean!`
>   - `delete_user(): Boolean!`
>   - `add_token(data: TokenInput!): Boolean!`
>   - `modify_token(data: ModifyTokenInput!): Boolean!`
>   - `delete_token(name: String!): Boolean!`
>   - `request_authentication_uri(service: String, type: String!): String` # Type can be "implicit" or "code", which later needs to be exchanged for a   token. Implicit get access token immediately and without refresh token.
>   - `request_access_token(service: String!, code: String!): Boolean!`
>   - `request_refresh_token(service: String!): Boolean!`

### Types
```graphql
type User {
  email: String!
  services: String
}
type UserWithToken {
  token: String!
  email: String!
  services: String
}

input UserInput {
  email: String!
  password: String!
}
input UserUpdate {
  email: String
  password: String
}

type Token {
  name: String!
  access_token: String
  refresh_token: String
  expires_in: String
  scope: [String!]
  client_id: String
  client_secret: String
  api_uri: String!
  refresh_token_uri: String
  authorize_uri: String
  redirect_uri: String
  user_data_paths: [String!]!
  user_data_selectors: [String!]!
  token_type: String!
}

input TokenInput {
  name: String!
  access_token: String
  refresh_token: String
  expires_in: String
  scope: [String!]
  client_id: String
  client_secret: String
  api_uri: String
  refresh_token_uri: String
  authorize_uri: String
  redirect_uri: String
  user_data_paths: [String!]!
  user_data_selectors: [String!]!
  token_type: String!
}

input ModifyTokenInput {
  name: String!
  access_token: String
  refresh_token: String
  expires_in: String
  scope: [String]
  client_id: String
  client_secret: String
  api_uri: String
  refresh_token_uri: String
  authorize_uri: String
  redirect_uri: String
  user_data_paths: [String]
  user_data_selectors: [String]
  token_type: String
}
```

---
## How it works

- Client request new service
- Send request to server with user token
- Prepare url for requesting token from third party service
- Send back prepared url to user
- Redirect user to prepared url
- User authenticates his account then he is redirected back to client with new tokens
- Send new tokens to server and retrieve new data with that tokens
- Send new data to user

## How to work with API

- To create your account use `add_user` method
- Modify or delete your account use `modify_user` or `delete_user`
- To download your data use `fetch_user` or `fetch_token`
- To create, update or delete token use `add/modify/delete_token`

## Steps to authenticate third party service

1. First you need to save your tokens in database. If your selected service don't have authentication and use only API token starting by `Bearer ...token...` then you need pass only:
> name - Service name

> access_token - here is your api token but without Bearer prefix

> token_type - just write "Bearer", I have added it for future-proofing

> user_data_paths - just save paths in array eg. ["https://example.com/api/v1/some/useless/path", "https://exmaple.not.com/not_api"]

> user_data_selectors - array of items to select from above paths. It uses `omit` function from lodash so if your service returns object like that

```javascript
{
  account: {
    name: "TEST";
    obj: {
      literal: "OR NOT literal";
    }
    other: {
      names;
    }
  }
}
```

then you have to write path like `["account.name.obj.literal", "account.other.names"]`. For now you need to write full path.

2. Use `request_authentication_uri`, pass in arguments which service you want to authenticate and specify authentication type (`implicit` or `code`).
   It can be implicit grant or authorization code. Implicit is perfect for client side where you don't want to store access tokens
   and be sure that no one will steal your tokens. Implicit grant doesn't use refresh token (at least in Spotify) so every hour (in Spotify expiration time is 1 hour) you need to download new access token.
   Authorization code is best for server side use, however in this project i'm using it on client side, just like implicit grant. Authorization gives you refresh token so you don't need to authenticate yourself in service every time when you want to receive new data.
   For now I have implemented storing tokens on server side, but in future I will add option to store them in encrypted file or encrypted in browser. I'm planning to bypass redirect_uri in most services so you can use it on your phone/pc without connecting with server. For now redirecting to localhost works but it's a bit dangerous. For development purposes it works great.
   Back to our authentication uri. After invoking `request_authentication_uri` you will get uri which you must use in order to authenticate your account with this application. If authentication is successful, it redirects you to application with access_token or code (depends on your choose) in url. If you choosed implicit grant then you have to send back received codes to server using `modify_token` and you are good to go and can use `refresh_service` function. But if you selected authentication code then you have few more steps to do. You need to use `request_access_token` and pass received `code` parameter in redirected url from successful authentication. All done, you are able to fetch new data from services with `refresh_service`.

## Licensing

#### LICENSE MIT
