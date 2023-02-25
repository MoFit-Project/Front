# 이미지 기반으로 ubuntu를 사용합니다.
FROM ubuntu:18.04

# 필요한 패키지들을 설치합니다.
RUN apt-get update && apt-get install -y apt-utils && npm install -g yarn &&apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_16.x | bash && apt-get install -y nodejs

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 프로젝트 파일을 이미지 내에 복사합니다.
COPY . .

# 의존성을 설치합니다.
RUN yarn install

# Next.js 앱을 빌드합니다.
RUN yarn build

# 앱을 실행합니다.
CMD ["yarn", "start"]

