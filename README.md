![Make Movies](https://github.com/axle-h/make-movies/actions/workflows/main.yml/badge.svg)

# Make Movies

Certified family proof (my family), movie library management on top of [Jellyfin](https://jellyfin.org) & [Transmission](https://transmissionbt.com/).

The API serves the UI as static files and owns authentication for both, so this ships as a
single container. See the [Dockerfile](Dockerfile).

## API

[.NET API](api/README.md)

## UI

[React + Vite UI](ui/README.md)

## VPN

[tor proxy](vpn/README.md)

## Reverse Proxy

Everything is one upstream. Example nginx.conf:

```
server {
  listen 8080;
  listen [::]:8080;

  location / {
    proxy_pass http://localhost:5000;

    # Required. Tls is terminated here, and the API builds its OpenID Connect redirect
    # uri from these, so without them it sends the identity provider an http:// uri.
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Kubernetes

Can be deployed fairly easily onto Kubernetes for e.g. [as plain resources](k8s/README.md).