FROM node:latest

# install ethereum testrpc
RUN npm install -g ethereumjs-testrpc

ADD start.sh /bin/start-testrpc.sh

EXPOSE 8545

ENTRYPOINT [ "/bin/start-testrpc.sh"]