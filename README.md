# 项目简介

本项目是一个以测试**js打包和热更**为目的的cocos2d-js项目。



# 浏览器中运行

1. 进入项目根目录，执行以下命令，开启一个简单的本地http服务器。

   ```
   http-server ./
   ```

2. 执行以下命令，将所有js文件，打包为一个js文件

   ```
   browserify main.js > js/game.js
   ```

3. 在浏览器中，输入以下地址

   ```
   http://127.0.0.1:8081/
   ```



# 打包步骤

...



# 打包apk遇到的两个问题

* cmake版本不对：最后试了几个版本后，发现3.10.2.4988404报错最晚，因此确定了这个版本。

* build过程中，报错“CMake Error: CMake was unable to find a build program corresponding to "Ninja". CMAKE_MAKE_PROGRAM is not set”

  ```
  看报错信息，命令行找不到ninja，使用brew install ninja命令安装后，打包成功
  ```



# 热更新

* 游戏中的热更逻辑
* **编写生成ota的脚本**
* 搭建测试用的http服务器
* 打包测试热更
