---
title: 构建 macOS High Sierra 10.13.5 编译 AOSP 8.1 环境
date: 2018-08-06 14:15:56
tags: 
- android
- aosp
- macOS
category: 
- macOS
---

## 编译环境
- 系统 Hackintosh macOS High Seirra 10.13.5
- 处理器 Intel Core I7-4702MQ 2.2 GHz
- 内存 12 GB 1600 MHz DDR3L
- 硬盘 影驰 480 GB SATA

## 构建源码

- 创建支持区分大小写的 APFS 镜像文件，建议不小于 150G，我这里是300G
`
sudo hdiutil create -type SPARSE -fs 'Case-sensitive Journaled HFS+' -size 300g ~/Android.dmg
`
- 挂载分区
`
sudo hdiutil attach ~/Android.dmg -mountpoint ~/Android
`

## 安装 Xcode 等依赖工具

- 切换 Xcode 为 Developer 模式
`
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
`
- 同意 Xcode 的协议
`
sudo xcodebuild -license
`
- 通过 MacPorts 安装其他依赖

```
POSIXLY_CORRECT=1 sudo port install gmake libsdl git gnupg
```
- 设置打开文件数量限制，添加到.bashrc中

```
ulimit -S -n 1024
```
- GNU 工具

```bash
export PATH="$(brew --prefix coreutils)/libexec/gnubin:/usr/local/bin:$PATH"
brew install coreutils
brew install gnu-tar --with-default-names
brew install binutils
brew install diffutils
brew install ed --default-names
brew install findutils --with-default-names
brew install gawk
brew install gnu-indent --with-default-names
brew install gnu-sed --with-default-names
brew install gnu-which --with-default-names
brew install gnutls
brew install grep --with-default-names
brew install gzip
brew install screen
brew install watch
brew install wdiff --with-gettext
brew install wget
```
我的 PATH 变量为:

	/usr/local/opt/coreutils/libexec/gnubin:/opt/local/bin:/Users/bavelee/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

- 安装 OpenJDK 8

```bash
brew tap AdoptOpenJDK/openjdk
brew install adoptopenjdk-openjdk8
```

- 安装 repo 和同步源码这里就不再赘述了，提供一下 repo 命令

```bash
time repo sync --no-clone-bundle --no-tags -j16
```

## macOS 编译都会遇到的问题
- 不兼容 macOS High Sierra 10.13 SDK

```bash
修改 build/soong/cc/config/x86_darwin_host.go
增加 "10.13",
你没有看错，数组最后面元素还有一个逗号

darwinSupportedSdkVersions = []string{
    "10.8",
    "10.9",
    "10.10",
    "10.11",
    "10.12",
    "10.13",
}
```
- bison 问题

```bash
编译过程突然中断，报错信息可以看到
BISON_PKGDATADIR=external/bison/data prebuilts/misc/darwin-x86/bison/bison -d  --defines=/Users/bavelee/Android/HavocOS/out/soong/.intermediates/frameworks/compile/mclinker/lib/Script/libmcldScript/darwin_x86_64_static/gen/yacc/frameworks/compile/mclinker/lib/Script/ScriptParser.h -o /Users/bavelee/Android/HavocOS/out/soong/.intermediates/frameworks/compile/mclinker/lib/Script/libmcldScript/darwin_x86_64_static/gen/yacc/frameworks/compile/mclinker/lib/Script/ScriptParser.cpp frameworks/compile/mclinker/lib/Script/ScriptParser.yy
就是有 bison 字眼，后面的错误信息不用管
需要重新编译 bison
cd external/bison
git cherry-pick c0c852bd6fe462b148475476d9124fd740eba160
如果你 cherry-pick bad object，不用怕
cd .. && rm -r bison
git clone https://android.googlesource.com/platform/external/bison
cd bison && git cherry-pick c0c852bd6fe462b148475476d9124fd740eba160
croot
time mka bison -j32
cp -f ./out/host/darwin-x86/obj/EXECUTABLES/bison_intermediates/bison ./prebuilts/misc/darwin-x86/bison/bison
```

## 最后

```
. build/envsetup.sh
lunch aosp_<code_name>-<build_variant>
breakfast <code_name>
time mka bacon -j32 | tee -a build.log
```

## 参考文章
[mac android 8.0](https://github.com/yumodev/yumodev_notes/blob/45c704b929235da0de6d2613ad293303ef531713/android/source/mac_android_8.0.md)