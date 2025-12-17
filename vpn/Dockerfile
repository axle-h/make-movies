FROM alpine:3.23

RUN apk -U upgrade && \
    apk -v add tor curl && \
    chmod 700 /var/lib/tor && \
    rm -rf /var/cache/apk/* && \
    tor --version
COPY --chown=tor:root torrc /etc/tor/

HEALTHCHECK --timeout=20s --start-period=300s \
    CMD curl --fail --socks5 localhost:9150 'https://api.ipify.org?format=json' || exit 1

USER tor
EXPOSE 8853/udp 9150/tcp

CMD ["/usr/bin/tor", "-f", "/etc/tor/torrc"]