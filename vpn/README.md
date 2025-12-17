# Tor Proxy

Expose a socks5 proxy on port 9050.

```shell
# 1. see your ip
curl 'https://api.ipify.org?format=json'

# 2. build & run
docker build -t tor-proxy .
docker run -d -p 9050:9050 tor-proxy

# 3. see exit node ip
curl --socks5 localhost:9050 'https://api.ipify.org?format=json'
```