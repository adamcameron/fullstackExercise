FROM node
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get update
RUN apt-get install vim --yes
WORKDIR  /usr/share/fullstackExercise/
COPY ./package.json .
COPY ./package-lock.json .
ENV NPM_CONFIG_CACHE=/var/cache/npm/
RUN npm install -g @vue/cli
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "serve"]
