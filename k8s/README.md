# Kubernetes Deployment

I use k3s. This might not work otherwise.

First, add your keys to `api/configmap.yml`.

```shell
# Create the namespace
kubectl create namespace make-movies

# Create VPN resources
kubectl -n make-movies apply -f ./vpn

# Check VPN is UP
kubectl -n make-movies get all

# Create API resources. This serves the UI too.
kubectl -n make-movies apply -f ./api

# Check everything is UP
kubectl -n make-movies get all

# Create the http -> https redirect middleware, then the ingress that references it
kubectl -n make-movies apply -f ./redirect-http-https.yml
kubectl -n make-movies apply -f ./ingress.yml
```

## Identity provider

The API is a confidential OpenID Connect client. Register these against the `make-movies`
client, they changed when auth moved out of the UI and into the API:

| | |
|---|---|
| Redirect uri | `https://movies.ax-h.com/signin-oidc` |
| Post logout redirect uri | `https://movies.ax-h.com/signout-callback-oidc` |

PKCE must be permitted, and the client needs the `roles` scope. A user needs the
`make-movies` role, which is `Auth__Role` if you want to change it.

Note the ingress terminates tls, so the API relies on `X-Forwarded-Proto` from traefik to
build those uris as https. Traefik sets it by default.

## Sessions

The session cookie is encrypted with the data protection key ring, which is persisted to
`/data/keys` on the `data` hostPath. Do not point `Db__Path` at anything ephemeral or every
restart will sign everybody out.
