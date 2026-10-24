FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css game.js /usr/share/nginx/html/
COPY sounds/ /usr/share/nginx/html/sounds/
EXPOSE 80
