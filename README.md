[![CI/CD Frond](https://github.com/MoFit-Project/Front/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/MoFit-Project/Front/actions/workflows/npm-publish.yml)

# Front

Front Tech Stack

&#160;   
<img src="https://img.shields.io/badge/NGINX-009638?style=flat&logo=NGINX&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat&logo=Amazon AWS&logoColor=white"/> 
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=white"/>
<img src="https://img.shields.io/badge/GameEngine-Phaser-blueviolet"/>
&#160;   
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=Next.js&logoColor=white"/> 
<img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=flat&logo=GitHub Actions&logoColor=white"/>
<img src="https://img.shields.io/badge/WebRTC-333333?style=flat&logo=WebRTC&logoColor=white"/> 
<img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=TensorFlow&logoColor=white"/>  



---

### 배포방법

#### 1. Github Action을 이용하여 빌드 및 배포

```
# This workflow will run tests using node and then publish a package to GitHub Packages when a release is created
# For more information see: https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages

name: CI/CD Frond


on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]



jobs:
  build-and-publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3.2.0

      - name: Cache node modules
        uses: actions/cache@v2
        with:
          path: '**/node_modules'
          key: ${{ runner.os }}-node-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'


      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: make env.production
        if: contains(github.ref, 'main') # branch가 main일 때
        run: | 

          #touch ./env.production # env.production 파일 생성 

          # GitHub-Actions에서 설정한 값을 /env.production 파일에 쓰기
          echo "${{ secrets.PRODUCTION }}" > .env.production
        shell: bash


      - name: Build
        run: yarn build

      - name: Docker build & push
        if: contains(github.ref, 'main')
        run: |
            docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
            docker build -f Dockerfile -t ${{ secrets.DOCKER_REPO }}/mofit-front:latest .
            docker push ${{ secrets.DOCKER_REPO }}/mofit-front
      ## deploy to develop
      - name: Deploy to dev
        uses: appleboy/ssh-action@master
        id: deploy
        if: contains(github.ref, 'main')
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          port: 22
          script: |
              cd ../home/ubuntu/mofit
              sudo docker rm -f $(docker ps -qa)
              sudo docker pull ${{ secrets.DOCKER_REPO }}/mofit-front
              docker-compose up -d
              docker image prune -f
```

- Docker file 

```
# base image
FROM node:16

# set working directory
WORKDIR /app

# copy package.json and yarn.lock
COPY package.json yarn.lock /app/

# install dependencies
RUN yarn install --frozen-lockfile

# copy source code
COPY . /app/

# build app
RUN yarn build

# expose port
EXPOSE 3000

# start app
CMD ["yarn", "start"]

```

- 위의 방법을 통해 build한 이미지를 ubuntu내의 docker-compse.yml 파일을 통해 실행

```
version: '3'

services:
  mofit-front:
    image: eenaa/mofit-front:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - API_BASE_URL=http://localhost:8080
      - NODE_ENV=production

~
```

#### 2. Nginx를 통한 역프록시
WebRTC기능을 이용하기 때문에, https 인증을 받아야 한다. 

- Nginx 다운로드
```
# 설치
sudo apt-get install nginx

# 설치 확인 및 버전 확인
nginx -v
```

- letsencrypt 설치
```
sudo apt-get install letsencrypt

sudo systemctl stop nginx

sudo letsencrypt certonly --standalone -d www제외한 도메인 이름
```

- Congratulations 로 시작하는 문구가 보이면 인증서 발급이 완료됐으며
- ```/etc/nginx/live/```도메인이름 으로 들어가면 key파일들이 있을 것이다.
- 이후 ```/etc/nginx/sites-available```로 이동한 후, 적당한이름.conf 파일을 만들어 준다.

```
server {
         listen 443 ssl; # managed by Certbot
    server_name mofit.kraftonjungle.shop;
    #https websocket
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;

        location /mofit {
        proxy_pass https://mofit.bobfriend.site:8080/mofit;
        }


    location / {
        proxy_pass http://localhost:3000;
    }


    ssl_certificate /etc/letsencrypt/live/mofit.kraftonjungle.shop/fullchain.pem; 
    ssl_certificate_key /etc/letsencrypt/live/mofit.kraftonjungle.shop/privkey.pem; 

}

server {
    if ($host = mofit.kraftonjungle.shop) {
        return 301 https://$host$request_uri;
    } 
```

- https 통신 및  ```/mofit``` 으로 오는 분기요청을 reverse-proxy를 통해 API 서버로 처리한다
- 80 포트로 오는 요청을 리다이렉트 해서 https통신을 이용하게 한다.


- 위의 처리가 끝난 후 차례로 명령을 실행한다.
```
sudo ln -s /etc/nginx/sites-available/[파일명] /etc/nginx/sites-enabled/[파일명]

# 다음 명령어에서 successful이 뜨면 nginx를 실행할 수 있다.
sudo nginx -t

sudo systemctl restart nginx
```
