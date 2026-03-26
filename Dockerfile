# ─── Redirect HTTP to HTTPS ───────────────────────────────────────────────────
server {
    listen 80;
    server_name games.henrywalters.dev;
    return 301 https://$host$request_uri;
}

# ─── games.henrywalters.dev ───────────────────────────────────────────────────
server {
    listen 443 ssl;
    server_name games.henrywalters.dev;

    ssl_certificate     /etc/letsencrypt/live/games.henrywalters.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/games.henrywalters.dev/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://frontend:4321;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}