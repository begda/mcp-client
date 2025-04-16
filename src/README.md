# mcp-cli 使用说明

```js
import {mcp_ollama_tools, mcp_server, run_tools} from './mcp-cli/index.js'
import ollama from "ollama";

const config = {

    "server-filesystem": {
        "name": "文件操作",
        "type": "stdio",
        "description": "文件增加,删除,修改 智能体",
        "isActive": true,
        "registryUrl": "",
        "command": "npx",  //加载npm的 stdio服务 可以用npx 也可以用node,用node需要再本地环境下安装这个包
        "args": [
            "-y",
            "@modelcontextprotocol/server-filesystem",
            "/Users/liaohui1080/Desktop/mcp-test-type/src/ddd",
            "/Users/liaohui1080/Desktop/mcp-test-type/src/bb"
        ]
    },
    "zidonghua": {
        "name": "自动化服务",
        "type": "sse",
        "description": "自动化智能体服务",
        "isActive": true,
        "baseUrl": "http://localhost:3002/sse"
    },
    "echo": {
        "name": "本地的stdio服务",
        "type": "stdio",
        "description": "",
        "isActive": true,
        "registryUrl": "",
        "command": "node", //本地调用需要用node
        "args": [
            "./echo.js"
        ]
    },
}

//启动服务
const {mcp_tools, mcp_resources, mcp_prompts} = await mcp_server(config)

//设置ollama的工具配置
const ollama_tools = mcp_ollama_tools(mcp_tools)

//创建对话消息
let messages = [
    {
        role: "user",
        content: `
          你是一个智能助手，你只能调用工具,如果没有工具返回文本:没有可调用工具.
          用户输入:25年8月5日打开测试智能体的3号通风机
        `
    }]

// 运行模型
const response = await ollama.chat({
    model: 'qwen2.5:7b', // 选择使用的模型
    messages, // 传递用户输入的消息
    tools: ollama_tools, // 传递工具信息
    options: {temperature: 0} // 设置温度为 0，使回复尽可能稳定、确定
});

//获取大模型返回的工具主体信息,这里面已经包含了调用的参数和返回结果
const tool_calls = response.message.tool_calls

// 运行工具返回结果
try {
    // 执行工具函数，按顺序运行 tool_calls 中的所有工具
    const results = await run_tools(tool_calls, mcp_tools);
    // 所有函数成功运行结束
    console.log('✅ 所有工具函数执行完成');
    console.log('📦 执行结果:', JSON.stringify(results, null, 2)); // 美化输出
} catch (error) {
    // 捕获整个执行流程中的任何异常
    console.error('❌ 工具执行过程中发生错误:');
    // 打印错误信息，更易调试
    if (error instanceof Error) {
        console.error('错误消息:', error.message);
        console.error('堆栈信息:', error.stack);
    } else {
        console.error('未知错误:', error);
    }
}
```