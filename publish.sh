#!/usr/bin/env bash

# 发生错误时立即退出
set -e

# 确保脚本在根目录运行
if [ ! -f "package.json" ]; then
    echo "错误: 未找到 package.json，请在项目根目录运行此脚本。"
    exit 1
fi

# 检查当前分支（建议在 main/master 分支发布）
current_branch=$(git symbolic-ref --short -q HEAD)
if [ "$current_branch" != "main" ]; then
    echo "警告: 您当前在 '$current_branch' 分支，通常建议在 'main' 分支发布。"
fi

# 询问更新类型
echo "请选择更新类型:"
echo "1) Patch (补丁, 1.0.x)"
echo "2) Minor (功能, 1.x.0)"
echo "3) Major (大版本, x.0.0)"
read -p "选择 [1-3]: " choice

case $choice in
    1) type="patch" ;;
    2) type="minor" ;;
    3) type="major" ;;
    *) echo "取消发布"; exit 1 ;;
esac

echo "正在准备发布 $type 版本..."

# 1. 确保 Git 工作区整洁
if [[ -n $(git status -s) ]]; then
    echo "错误: Git 工作区有未提交的代码，请先提交或暂存。"
    exit 1
fi

# 2. 升级版本 (这会更新 package.json 并自动创建 git tag)
npm version $type -m "release: %s"

# 3. 推送代码和 Tag 到 GitHub
echo "正在推送代码到 GitHub..."
git push origin main --tags

# 4. 发布到 NPM
echo "正在发布到 NPM..."
npm publish

echo "成功！新版本已发布。"
