// ======================================================
// 【V17 脚本：修复 UI 文本重复问题】
// * 移除 showInputPage 中多余的 label 视图，只保留输入框 placeholder
// * 保持所有功能、兼容性和逻辑的稳定性
// ======================================================

// 🎯 您的 GitHub Raw JSON URL
const JSON_URL = "https://raw.githubusercontent.com/losymear/cognition/refs/heads/main/files/json/1000code.json";
// 💾 本地缓存的文件名
const CACHE_KEY = "1000code_cache.json";

let number_encodings = {};
const MIN_NUM = 100;
const MAX_NUM = 999;


// --- 核心辅助函数 (保持不变) ---

function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * (MAX_NUM - MIN_NUM + 1)) + MIN_NUM;
    return String(randomNumber);
}

function getEncoding(numStr) {
    return number_encodings[numStr] || `[${numStr} 编码缺失!]`;
}


// --- 核心功能实现 (保持不变) ---

function drillRandomNumber() {
    if (!Object.keys(number_encodings).length) {
        $ui.alert({ title: "⚠️ 错误", message: "数据未加载，请在 App 内运行脚本并等待数据缓存。" });
        return;
    }

    const targetNumber = generateRandomNumber();
    const correctAnswer = getEncoding(targetNumber);

    $ui.alert({
        title: "🧠 随机数字训练",
        message: `请默想数字 ${targetNumber} 对应的编码。准备好了吗？`,
        actions: [{
            title: "查看编码",
            handler: () => {
                showResultUI(`✅ ${targetNumber} 的编码`,
                    `数字: ${targetNumber}\n\n编码: ${correctAnswer}`,
                    drillRandomNumber);
            }
        }]
    });
}


function drillMultipleNumbers(N) {
    const N_val = parseInt(N);

    const numbers = new Set();
    while (numbers.size < N_val) {
        numbers.add(generateRandomNumber());
    }
    const numberList = Array.from(numbers);

    const formattedList = numberList.map(numStr => {
        const encoding = getEncoding(numStr);
        return `${numStr}: ${encoding}`;
    }).join('\n');

    const plainNumberList = numberList.join(', ');

    $ui.alert({
        title: `🧠 ${N_val} 个数字随机训练`,
        message: `请尝试联想并记忆这组数字：\n**${plainNumberList}**\n\n准备好了吗？`,
        actions: [{
            title: "查看答案",
            handler: () => {
                showResultUI("✅ 编码答案",
                    `**数字列表:**\n${formattedList}`,
                    () => showInputPage("multi")
                );
            }
        }]
    });
}


// --- UI 视图函数 (修复重复文本) ---

/**
 * **V17 核心修改：移除 type: "label" 视图，只保留 type: "text" 中的 placeholder**
 */
function showInputPage(type) {
    if ($app.env !== $env.app) {
        $ui.alert({ title: "⚠️ 提示", message: "该功能需要 App 内的完整界面支持，请在 App 内部运行。" });
        return;
    }

    const isMulti = type === "multi";
    const pageTitle = isMulti ? "输入多重记忆数量 N" : "输入查询数字";
    const placeholder = isMulti ? "请输入数量 N (1-20)" : "请输入 100 到 999 的数字";

    $ui.push({
        props: {
            title: pageTitle,
        },
        views: [
            // ❌ 移除重复的 label 视图
            /*
            {
                type: "label",
                props: {
                    text: placeholder, // 移除此处重复的文本
                    font: $font(16),
                    color: $color("#888888")
                },
                layout: function(make) {
                    make.top.inset(20);
                    make.left.right.inset(15);
                }
            },
            */
            {
                type: "text",
                props: {
                    id: "input_view",
                    placeholder: placeholder, // 仅保留此处作为提示
                    font: $font(20),
                    keyboardType: $kbType.number,
                    bgcolor: $color("#f0f0f0"),
                    cornerRadius: 8,
                    insets: $insets(10, 10, 10, 10),
                },
                layout: function(make) {
                    // 调整布局，让输入框位于顶部下方
                    make.top.inset(20);
                    make.left.right.inset(15);
                    make.height.equalTo(50);
                }
            },
            {
                type: "button",
                props: {
                    title: "确定",
                    bgcolor: $color("systemBlue")
                },
                layout: function(make, view) {
                    make.top.equalTo(80); // 调整按钮位置
                    make.centerX.equalTo(view.super);
                    make.width.equalTo(200);
                    make.height.equalTo(45);
                },
                events: {
                    tapped: function() {
                        const inputView = $("input_view");
                        const input = inputView.text ? inputView.text.trim() : "";

                        if (input === "") {
                            $ui.toast("输入不能为空");
                            return;
                        }

                        $ui.pop();

                        if (isMulti) {
                            const N = parseInt(input);
                            if (N > 0 && N <= 20) {
                                drillMultipleNumbers(N);
                            } else {
                                $ui.alert({ title: "错误", message: "请输入 1 到 20 之间的有效数字。" });
                                showInputPage("multi");
                            }
                        } else {
                            const numStr = input;
                            const num = parseInt(numStr);
                            if (num >= MIN_NUM && num <= MAX_NUM) {
                                const encoding = getEncoding(numStr);
                                showResultUI(`🔎 ${numStr} 对应的编码`,
                                    `数字: ${numStr}\n\n编码: ${encoding}`,
                                    () => showInputPage("query")
                                );
                            } else {
                                $ui.alert({ title: "⚠️ 数字错误", message: `请输入有效的 ${MIN_NUM} 到 ${MAX_MAX} 的数字。` });
                                showInputPage("query");
                            }
                        }
                    }
                }
            }]
    });
}

/**
 * 显示结果和下一步操作的视图 (保持不变)
 */
function showResultUI(title, message, nextAction) {
    if ($app.env !== $env.app) {
        $ui.alert({ title: title, message: message });
        return;
    }

    $ui.push({
        props: {
            title: title
        },
        views: [{
            type: "text",
            props: {
                id: "result_text",
                text: message,
                font: $font("bold", 18),
                insets: $insets(10, 10, 10, 10),
                editable: false,
                bgcolor: $color("white")
            },
            layout: function(make) {
                make.top.left.right.equalTo(0);
                make.height.equalTo(250);
            }
        },
            {
                type: "button",
                props: {
                    title: nextAction ? "继续此项操作" : "返回主菜单",
                    bgcolor: nextAction ? $color("systemRed") : $color("systemBlue")
                },
                layout: function(make, view) {
                    make.top.equalTo($("result_text").bottom).offset(20);
                    make.centerX.equalTo(view.super);
                    make.width.equalTo(200);
                },
                events: {
                    tapped: () => {
                        if (nextAction) {
                            $ui.pop();
                            nextAction();
                        } else {
                            $ui.popToRoot();
                        }
                    }
                }
            }]
    });
}

/**
 * 主菜单视图，用于导航 (保持不变)
 */
function showMenuUI() {
    const listData = [
        { title: { text: "🧠 1. 单次随机训练" }, detail: { text: "随机一个数字，确认后显示编码" } },
        { title: { text: "🔢 2. 多重数字记忆" }, detail: { text: "输入数量 N，随机 N 个数字组进行记忆" } },
        { title: { text: "🔍 3. 查询桩子" }, detail: { text: "输入数字，立即显示对应编码" } }
    ];

    $ui.render({
        props: {
            title: "数字桩记忆训练 (数据: " + (Object.keys(number_encodings).length ? "已加载" : "缺失") + ")",
            navBarHidden: false
        },
        views: [{
            type: "list",
            props: {
                rowHeight: 60,
                template: [{
                    type: "label",
                    props: { id: "title", font: $font("bold", 18) },
                    layout: function(make) { make.left.top.inset(10); }
                },
                    {
                        type: "label",
                        props: { id: "detail", font: $font(14), color: $color("#888888") },
                        layout: function(make) { make.left.equalTo($("title").left); make.bottom.inset(10); }
                    }],
                data: listData
            },
            layout: $layout.fill,
            events: {
                didSelect: function(tableView, indexPath, data) {
                    if (!Object.keys(number_encodings).length) {
                        $ui.alert({ title: "⚠️ 错误", message: "数据未加载，请在 App 内运行脚本并等待数据缓存。" });
                        return;
                    }
                    switch (indexPath.row) {
                        case 0:
                            drillRandomNumber();
                            break;
                        case 1:
                            showInputPage("multi");
                            break;
                        case 2:
                            showInputPage("query");
                            break;
                    }
                }
            }
        }]
    });
}


// --- 核心加载与更新逻辑 (保持不变) ---

function loadFromCache() {
    const jsonStr = $file.read(CACHE_KEY)?.string;
    if (jsonStr) {
        try {
            number_encodings = JSON.parse(jsonStr);
            $ui.toast("使用本地缓存数据。");
            return true;
        } catch (e) {
            console.error("解析本地缓存失败:", e);
            $file.delete(CACHE_KEY);
            return false;
        }
    }
    return false;
}

async function updateFromRemote(isInitialLoad) {
    if (isInitialLoad) {
        $ui.loading(true);
    }

    const response = await $http.get({ url: JSON_URL });

    if (isInitialLoad) {
        $ui.loading(false);
    }

    if (response.error || !response.data) {
        if (isInitialLoad) {
            $ui.alert({
                title: "❌ 首次加载失败",
                message: `无法从 GitHub 加载数据，请检查网络和 URL。`,
            });
        } else {
            $ui.toast("网络不佳，未能更新数据。");
        }
        return false;
    }

    const newEncodings = response.data;

    if (JSON.stringify(newEncodings) !== JSON.stringify(number_encodings)) {
        number_encodings = newEncodings;
        $file.write({
            data: $data({"string": JSON.stringify(newEncodings)}),
            path: CACHE_KEY
        });
        $ui.toast("数据已更新并保存到本地缓存。");

        if ($app.env === $env.app) {
            $ui.title = "数字桩记忆训练 (数据: 已加载)";
        }

    } else {
        if (!isInitialLoad && $app.env === $env.app) {
            $ui.toast("数据已是最新版本。");
        }
    }
    return true;
}

// --- 脚本主流程 ---

function init() {
    const cacheLoaded = loadFromCache();

    if (cacheLoaded) {
        showMenuUI();
        updateFromRemote(false);
    } else {
        const success = updateFromRemote(true);
        if (success) {
            showMenuUI();
        }
    }
}

// 启动脚本
init();