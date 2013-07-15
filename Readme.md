
## 答题备份与恢复插件

*目前只支持ECNU*

**Licenced BY: [GNU GPLv3](http://www.gnu.org/licenses/gpl.html)**

========

### 本脚本由三部分组成：
* 第一部分为 [jQuery ](http://jquery.com/)代码，一切协议遵照原有协议执行
* 第二部分为 [Firebase Web Api ](https://www.firebase.com/)代码，同上
* 第三部分为 [自动填表器](https://github.com/halftan/odds_ends/blob/master/examination.coffee)

### 用途

你是否有过这样的经历：好不容易快把题目做完了，结果手一滑，直接把页面关掉\刷新了，辛辛苦苦填好的答案付诸流水。

有了这个插件，你就能随时随地保存你的答案，并随时恢复你的备份——就算题目顺序改变了也无所谓。

**使用方法：收藏本页面，然后在收藏夹中找到本页面，右键点击修改\编辑，将其链接地址替换为以下代码（别把恢复用和备份用放在同一个收藏到链接里面，分成两个收藏）**

恢复用：将下列代码放入收藏夹

    javascript:{var head = document.getElementsByTagName('head').item(0);var script= document.createElement('script');script.type = 'text/javascript';script.charset='utf-8';script.src='https://dl.dropboxusercontent.com/u/93195229/examination.js';head.appendChild(script);}

------

备份用：将下列代码放入收藏夹
    
    javascript:{var head = document.getElementsByTagName('head'\).item(0\);var script= document.createElement('script'\);script.type = 'text/javascript';script.charset='utf-8';script.src='https://raw.github.com/halftan/odds_ends/master/examination.push.js';head.appendChild(script\);})

------


