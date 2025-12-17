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

# Create API & UI resources
kubectl -n make-movies apply -f ./api
kubectl -n make-movies apply -f ./ui

# Check everything is UP
kubectl -n make-movies get all

# Create ingress
kubectl -n make-movies apply -f ./ingress.yml
```