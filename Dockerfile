
FROM ubuntu:18.04

# 필요한 패키지들을 설치합니다.
RUN apt-get update && \
    apt-get install -y apt-utils && \
    apt-get install -y npm && \
    npm install -g yarn && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash && \
    apt-get install -y nodejs && \
    apt-get install -y -y binutils binutils-common binutils-x86-64-linux-gnu build-essential \
    ca-certificates cpp cpp-7 dirmngr dpkg-dev fake*** file g++ g++-7 gcc gcc-7 \
    gcc-7-base gnupg gnupg-l10n gnupg-utils gpg gpg-agent gpg-wks-client \
    gpg-wks-server gpgconf gpgsm gyp javascript-common libalgorithm-diff-perl \
    libalgorithm-diff-xs-perl libalgorithm-merge-perl libasan4 libasn1-8-heimdal \
    libassuan0 libatomic1 libbinutils libc-ares2 libc-dev-bin libc6-dev libcc1-0 \
    libcilkrts5 libdpkg-perl libexpat1 libfake*** libfile-fcntllock-perl \
    libgcc-7-dev libgdbm-compat4 libgdbm5 libgomp1 libgssapi3-heimdal \
    libhcrypto4-heimdal libheimbase1-heimdal libheimntlm0-heimdal \
    libhttp-parser2.7.1 libhx509-5-heimdal libicu60 libisl19 libitm1 libjs-async \
    libjs-inherits libjs-jquery libjs-node-uuid libjs-underscore \
    libkrb5-26-heimdal libksba8 libldap-2.4-2 libldap-common \
    liblocale-gettext-perl liblsan0 libmagic-mgc libmagic1 libmpc3 libmpfr6 \
    libmpx2 libnghttp2-14 libnpth0 libperl5.26 libpython-stdlib \
    libpython2.7-minimal libpython2.7-stdlib libquadmath0 libreadline7 \
    libroken18-heimdal libsasl2-2 libsasl2-modules libsasl2-modules-db \
    libsqlite3-0 libssl1.0-dev libssl1.0.0 libssl1.1 libstdc++-7-dev libtsan0 \
    libubsan0 libuv1 libuv1-dev libwind0-heimdal linux-libc-dev make manpages \
    manpages-dev mime-support netbase node-abbrev node-ansi \
    node-ansi-color-table node-archy node-async node-balanced-match \
    node-block-stream node-brace-expansion node-builtin-modules \
    node-com

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

