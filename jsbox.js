/* JSBox 随机文章复习工具 - 最终稳定版本 */

// --- 配置区域 ---
const GITHUB_BASE_URL = "https://raw.githubusercontent.com/losymear/cognition/main/memo/";
// <<<--- 请务必修改为您实际的文章总数 n
const ARTICLE_COUNT = 1;

// --- 主函数 ---

function fetchAndDisplayRandomArticle() {
    if (ARTICLE_COUNT < 1) {
        $ui.alert({ title: "配置错误", message: "ARTICLE_COUNT 必须大于等于 1。" });
        return;
    }

    // 1. 随机生成文件编号 (1 到 ARTICLE_COUNT)
    let randomFileNumber = Math.floor(Math.random() * ARTICLE_COUNT) + 1;
    let fileName = `${randomFileNumber}.md`;
    let fullUrl = GITHUB_BASE_URL + fileName;

    console.log(`尝试获取: ${fullUrl}`);

    // 2. 获取文件内容
    $ui.loading(true);

    $http.get({
        url: fullUrl,
        handler: function(resp) {
            $ui.loading(false);

            if (resp.error) {
                $ui.alert({
                    title: "网络错误",
                    message: `无法获取文件：${fileName}。请检查网络。`
                });
                return;
            }

            let articleContent = resp.data ? resp.data.toString() : "";

            // 检查内容是否为空或异常
            if (articleContent.length < 50) {
                $ui.alert({
                    title: "文件内容异常",
                    message: `随机选取的文章 ${fileName} 可能不存在或内容为空。请检查 ARTICLE_COUNT 或 URL。`
                });
                return;
            }

            // 3. 使用 $ui.render 渲染主页面视图 (替代 $ui.push)
            renderArticleView(randomFileNumber, articleContent);
        }
    });
}

/**
 * 渲染文章视图（使用 $ui.render）
 * @param {number} articleNum 文章编号
 * @param {string} content 文章的 Markdown 文本内容
 */
function renderArticleView(articleNum, content) {
    // 渲染一个带有 TextView 的新页面
    $ui.render({
        props: {
            // 注意：render 渲染的是脚本的主视图，如果当前不在脚本主界面，
            // 可能会覆盖当前界面，但可以确保视图被正确创建。
            title: `复习文章 ${articleNum}.md`,
            navBarHidden: false // 确保导航栏显示标题
        },
        views: [
            {
                type: "markdown", // 使用原生 TextView
                props: {
                    content: content,
                    editable: false,
                    // 尝试使用系统默认字体，减少兼容性问题
                    font: $font(16),
                    insets: $insets(10, 10, 10, 10) // 添加边距
                },
                layout: $layout.fill // 视图占满整个屏幕
            }
        ]
    });
}

// 运行主函数
fetchAndDisplayRandomArticle();