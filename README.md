## RepairMIS
维修订单管理系统，前端+后台全栈式开发。


## 功能思维导图
<p><img src="http://xwh817.gitee.io/files/images/repair_mis/RepairMIS.png"></p>


## 技术栈
- VSCode开发工具，插件扩展，熟悉开发和调试
- React,体验MVVM开发模式，基于组件、数据驱动 vs 传统jQuery手动操纵DOM的区别。
  - redux 使用store对数据流和状态进行统一管理，这里只是为了demo而使用，对于层级不深的结构，过度设计反而变得麻烦。
  - redux-thunk 实现异步的action。
- Webpack，命令行脚手架的方式进行Web项目依赖管理和编译打包
- AntD，漂亮又好用的UI组件库，在没有设计和美工的情况下，开发风格美观的界面。
- Python, 体验其自由灵活小巧的语言风格，和传统Java严谨的差异。
- Flask，两三行代码实现Restful API，Python下丰富的工具，拿来就用。
- 使用Python操作Excel文件。
- MySQL，数据库表设计，sql脚本熟悉。
- SQLite，发现MySQL变得越来越重了，安装包就几百M，Windows下面安装更新繁琐。Python环境下面居然自带轻量级的SQLite，果断更换了。
- 项目编译打包
  - 前端项目：npm run build进行前端项目构建，需求配置package.json文件，prebuild、postbuild脚本，实现自动打包项目并移动到指定目录。
  - 后端项目：使用pyinstaller工具，将python运行文件包装成.exe文件，这样就可以直接在目标Windows机器上运行，不用安装Python环境(打包过程已封装到buildExE.bat脚本文件)。
  - CMD，命令行脚本使用，自动生成exe文件的快捷方式。

## 界面例图

### 维修项目
<img src="http://xwh817.gitee.io/files/images/repair_mis/repairItems.png">

### 配件管理
<img src="http://xwh817.gitee.io/files/images/repair_mis/partList.png">

### 配件修改
<img src="http://xwh817.gitee.io/files/images/repair_mis/partDetail.png">

### 订单管理
<img src="http://xwh817.gitee.io/files/images/repair_mis/orderList.png">

### 添加/修改订单
<img src="http://xwh817.gitee.io/files/images/repair_mis/orderDetail.png">


### 导出Excel表单
<img src="http://xwh817.gitee.io/files/images/repair_mis/orderExcel.png">
