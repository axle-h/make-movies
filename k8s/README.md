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

## Migrating from the two container deployment

The UI used to be its own deployment behind the ingress, doing OpenID Connect itself and
reverse proxying to the API. Deleting those manifests from the repo does not delete them
from the cluster, so on an existing install:

```shell
# 1. Register the new redirect uris at the identity provider FIRST, see below. Until that
#    is done nobody can log in.

# 2. Add Auth__Authority, Auth__ClientId and Auth__ClientSecret to your real configmap,
#    then apply it and roll the api so it picks up both them and the new image.
kubectl -n make-movies apply -f ./api/configmap.axh.yml
kubectl -n make-movies rollout restart deployment/api
kubectl -n make-movies rollout status deployment/api

# 3. Move the ingress over. The api serves the UI now.
kubectl -n make-movies apply -f ./ingress.yml

# 4. Only once that works, delete the old UI tier. The configmap holds the now unused
#    AUTH_SECRET, NEXTAUTH_URL, AUTH_TRUST_HOST and the old client secret, so do not
#    leave it lying around.
kubectl -n make-movies delete deployment/ui service/ui configmap/make-movies-ui

# 5. Check nothing is left over
kubectl -n make-movies get all
```

Steps 3 and 4 are separate on purpose: if the new deployment misbehaves you can point the
ingress back at `ui` and be serving again immediately.

The `ghcr.io/axle-h/make-movies-ui` package on ghcr is orphaned after this and can be
deleted from the GitHub UI whenever.

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
