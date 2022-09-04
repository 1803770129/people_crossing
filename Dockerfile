FROM node:14
WORKDIR /app
COPY . /app

# 设置时区
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# 安装
RUN npm install

# 启动
CMD echo $a && npm run dev

# 
ENV a="100"