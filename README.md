![Make Movies](https://github.com/axle-h/make-movies/actions/workflows/main.yml/badge.svg)

# Make Movies

Certified family proof (my family), movie library management on top of [Jellyfin](https://jellyfin.org) & [Transmission](https://transmissionbt.com/).

## API

[.NET API](api/README.md)

## UI

[Next.js UI](ui/README.md)

## VPN

[OpenVPN + Dante VPN proxy](openvpn/README.md)

## Reverse Proxy

The API + UI work well through a path routed reverse proxy. Example nginx.conf:

```
server {
	listen 8080;
	listen [::]:8080;

	location / {
        proxy_pass http://localhost:3000;
	}

	location ~ ^/(api|movie-images)/ /api {
        proxy_pass http://localhost:5000;
    }
}
```

## Kubernetes

Can be deployed fairly easily onto Kubernetes for e.g. [as plain resources](k8s/README.md).