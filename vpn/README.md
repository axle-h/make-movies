# Tor Proxy

Expose a socks5 proxy on port 9150.

```shell
# 1. see your ip
curl 'https://api.ipify.org?format=json'

# 2. build & run
docker build -t tor-proxy .
docker run -d -p 9150:9150 tor-proxy

# 3. see exit node ip
curl --socks5 localhost:9150 'https://api.ipify.org?format=json'
```