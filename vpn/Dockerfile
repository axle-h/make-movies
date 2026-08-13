FROM alpine:3.24.1

RUN apk -U upgrade && \
    apk -v add tor curl su-exec && \
    chmod 700 /var/lib/tor && \
    rm -rf /var/cache/apk/* && \
    tor --version
COPY --chown=tor:root torrc /etc/tor/
COPY --chmod=755 tor-health entrypoint /usr/local/bin/

HEALTHCHECK --timeout=20s --start-period=300s \
    CMD /usr/local/bin/tor-health || exit 1

# Deliberately no USER: the entrypoint needs root to take ownership of a freshly mounted
# DataDirectory, then drops to tor for tor itself.
EXPOSE 8853/udp 9050/tcp

ENTRYPOINT ["/usr/local/bin/entrypoint"]
CMD ["/usr/bin/tor", "-f", "/etc/tor/torrc"]