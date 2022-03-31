FROM nginx:alpine
MAINTAINER Qnvip

RUN mkdir -p /opt/htdocs
COPY ./dist /opt/htdocs/
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 443 80

CMD ["nginx", "-g", "daemon off;"]
