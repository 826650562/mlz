### 6.git提交时候如果出现冲突的情况下，使用mergetool配置说明，参考CSDN论坛说明。
http://blog.csdn.net/u010232305/article/details/51767887

### 5.git错误及解决方法：
failed to push some refs to 'git@github.com:******/Demo.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Merge the remote changes (e.g. 'git pull')
hint: before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

尝试使用如下指令：
$ git pull origin master
$ git push -u origin master


### 4.将“关于发布的”内容拷贝过来，删除关于发布。
	所有的配置项目均在db-*.properties
	其中开发环境使用db-dev.properties
	正式环境使用db-publish.properties
	
	-- 默认情况下
	mvn clean package -Dmaven.test.skip=true
	-- 发布命令
	mvn clean package -Dmaven.test.skip=true

### 3. 将图片上传和图片访问的URL加载到ServletContext中，实现发布“配置后端决定前端”的效果

### 2.从社区综合治理中拷贝出来的代码，刘支仁上传与2017-3-21 15:16:01，社区综合治理代码来源-党磊，获取时间2017-3-20晚。

### 1. 将图片上传和图片访问的URL加载到ServletContext中，实现发布“配置后端决定前端”的效果(2016.06.21)
