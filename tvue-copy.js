#!/bin/bash
WORK_PATH='/test_code/test-vue'
cd $WORK_PATH
echo "清除老代码"
# 硬回退
git reset --hard origin/main
git clean -f
echo "拉取最新代码"
git pull origin main
echo "开始执行构建"
docker build -t test-vue:1.0 .
echo "停止并删除旧容器"
docker stop test-vue-container
docker rm test-vue-container
echo "启动新容器"
# 端口映射 宿主机 - 映射到 - 容器内容的 3000端口
# -d 后台运行
docker container run -p 3000:3000 --name test-vue-container -d test-vue:1.0