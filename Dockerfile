FROM nginx:alpine

# Copiar os arquivos estáticos para o diretório raiz do nginx
COPY . /usr/share/nginx/html/

# Configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
