#!/usr/bin/env bash

#! /bin/bash
echo "================================"
echo ""
echo "可选参数:"
echo "1 - 打包"
echo "2 - 上线"
echo "3 - 调试"
echo "4 - 同步master"
echo "other - 自定义commit提交"
echo ""
echo "请输入您的选择: $1"

commit_message="update";

if test -z "$1"
then
    read dataOne
else
    dataOne=$1
fi

case ${dataOne} in
  1)
    ./gradlew bootJar
    exit
   ;;
  2)
    commit_message="release new version"
  ;;
  3)
#    ./gradlew bootrun -Dspring.profiles.active=dev
    cd domain &&  mvn package install && cd ../client-api && mvn clean package -DskipTests -Pprod
    git status && git add -A && git commit -m "release" && git push origin "${current_branch}"
    exit
  ;;
  4)
    git status && git add -A && git commit -m "commit for merge" && git pull origin master
    exit
  ;;
  5)
    cd domain &&  mvn package install && cd ../client-api && mvn clean package -DskipTests -Pprod
    scp ./target/client-api-1.0.0.jar root@hjb-server:/opt/app/hb-api/clent-api/app.jar
    ssh -t -p 22 root@hjb-server "docker restart hb-client-api"
    git status && git add -A && git commit -m "release" && git push origin "${current_branch}"
    exit
  ;;
  *)
    commit_message=${dataOne};
  ;;
esac

branch_list=$(git branch | grep '*')
current_branch=${branch_list:2}

git status && git add -A && git commit -m "${commit_message}" && git push origin ${current_branch}
