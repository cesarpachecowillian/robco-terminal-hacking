FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css manifest.json /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/
COPY icons/ /usr/share/nginx/html/icons/
COPY sounds/ /usr/share/nginx/html/sounds/
EXPOSE 80
