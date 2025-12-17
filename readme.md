## memo


- /memo目录  需要多看看的笔记
- files/json/1000code.json  1000数字桩。由大模型根据常用词汇生成。
- files/json/1000story.json  1000数字桩故事，大模型生成。这里的故事是反复提问大模型“更生动、符合道德与对相关人物的尊重”后得到的。
  - prompt：太复杂了，故事简单一点，但是要生动。数字保持从小到大。  括号和数字以外，需要在80-90字以内完成。给出的结果不要带"*"。
- files/json/config.json  配置文件。比如maxMemoId记录的是memo最大id。


https://www.losymear.top/digitalpile/ 数字桩游戏
https://www.losymear.top/randomMemo/ 随机文章


todo:
- [] 添加npm run build脚本（或其它脚本），判断`config.json`中`maxMemoId` 是否是正确值，如果不是就更新掉。
- [] randomMemo 添加一个配置记录笔记的熟悉大程度。然后随机笔记时根据熟悉度选择




