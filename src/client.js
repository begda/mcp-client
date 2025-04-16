import {Client} from "@modelcontextprotocol/sdk/client/index.js";
import {SSEClientTransport} from "@modelcontextprotocol/sdk/client/sse.js";
import {StdioClientTransport} from "@modelcontextprotocol/sdk/client/stdio.js";
import {buildSafeEnv} from "./ulits.js";

// sse服务的客户端
export const see_cli = async (baseUrl) => {
    const client = new Client(
        {name: `sse-client`, version: "1.0.0"},
        {capabilities: {prompts: {}, resources: {}, tools: {}}}
    );
    // console.log(item.baseUrl)
    const transport = new SSEClientTransport(new URL(baseUrl));
    await client.connect(transport); //连接mcp服务
    return client;
}

// stdio服务的客户端
export const stdio_cli = async (item) => {
    const client = new Client(
        {name: `stdio-client`, version: "1.0.0"},
        {capabilities: {prompts: {}, resources: {}, tools: {}}}
    );
    console.log('这里是本地运行,需要本地运行环境')
    const transport = new StdioClientTransport({
        command: item.command, // 使用 Node.js 运行 MCP 服务器
        args: [...item.args], // MCP 服务器的可执行文件路径
        //这里是在node运行的时候 给node命令行传递参数
        env: buildSafeEnv(item)

    });
    await client.connect(transport); //连接mcp服务
    return client;
}