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
