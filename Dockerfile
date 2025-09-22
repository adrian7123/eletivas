FROM nginx:alpine

# Copiar apenas os arquivos estáticos necessários
COPY index.html /usr/share/nginx/html/
COPY 404.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY imgs/ /usr/share/nginx/html/imgs/

# Configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajustar permissões
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Remover arquivos desnecessários e potencialmente sensíveis
RUN find /usr/share/nginx/html -name "*.env*" -delete && \
    find /usr/share/nginx/html -name "*.md" -delete && \
    find /usr/share/nginx/html -name "*.log" -delete && \
    find /usr/share/nginx/html -name ".*" -delete 2>/dev/null || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
