FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8137

# 复制客户端、资源与服务端代码
COPY app/ ./app/
COPY assets/ ./assets/
COPY server/ ./server/
COPY DESIGN.md PIPELINE-V2.md ./

# 预建持久化数据挂载目录
RUN mkdir -p /app/.context/jobs /app/.context/events

EXPOSE 8137

# 启动旅册服务
CMD ["python3", "server/serve.py", "8137"]
