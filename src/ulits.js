import _ from "lodash";
import {v4 as uuidv4} from 'uuid';

// 导出工具库
export {
    _,
    uuidv4
}

//用uuid,用来区分不同的mcp服务
export const uuidToMcp = (data, sessionId, mcp_server) => {
    return data.map(item => ({
        ...item,
        name: `${item.name}/${sessionId}`,
        description: `${item.description}<[${mcp_server.name}]>}`,
        server: mcp_server
    }));
}


// 把mcp获取的工具转换为 ollama 工具的格式
export const mcp_ollama_tools = (obj) => {
    return obj.map((tool) => {
        // console.log(tool)
        return {
            type: "function",
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema,
            }
        };
    });
}

/**
 *
 * 异步获取 client 的 tools, resources 和 prompts 数据。
 * 每个调用独立 try...catch，便于调试和错误处理。,如果不处理这个异常,程序就会断开连接
 */
export const clientData = async (client) => {
    const 服务器信息 = JSON.stringify(client.getServerVersion())
    // 初始化结果对象
    const result = {
        tools: [],
        resources: [],
        prompts: []
    };

    // 处理 tools 获取
    try {
        const {tools} = await client.listTools();
        result.tools = tools;  // 注意 tools 是结构中的一部分
    } catch (e) {
        console.log(服务器信息 + '获取工具失败（tools）:', e.message || e);
        result.tools = null;
    }
    // 处理 resources 获取
    try {
        const {resources} = await client.listResources();
        result.resources = resources;
    } catch (e) {
        console.log(服务器信息 + '获取资源失败（resources）:', e.message || e);
        result.resources = [];
    }

    // 处理 prompts 获取
    try {
        const {prompts} = await client.listPrompts();
        result.prompts = prompts;
    } catch (e) {
        console.log(服务器信息 + '获取提示词失败（prompts）:', e.message || e);
        result.prompts = [];
    }
    // console.log(result)
    // 返回统一结构
    return result;
}


/** 合并 所有mcp服务器返回 tools resources prompts数据
 * 合并 client_sees 和 client_stdios 中的 tools/resources/prompts
 * @param {Array} dataArray - 包含 client_sees 和 client_stdios 的对象数组
 * @returns {{tools: Array, resources: Array, prompts: Array}}
 [
 {
 client_sees: null,
 client_stdios: { tools: [Array], resources: [], prompts: [Array] }
 },
 {
 client_sees: { tools: [Array], resources: [Array], prompts: [Array] },
 client_stdios: null
 },
 {
 client_sees: { tools: [Array], resources: [Array], prompts: [Array] },
 client_stdios: null
 }
 ]
 用gpt写的提示词
 把上面的client_stdios client_sees合并成一个数组 注意 有的值是null的
 */
export const mergeClientData = (dataArray) => {
    // 1. 将每个 item 的 client_sees 和 client_stdios 拆出来组成新数组
    //    例如: [{client_sees: A, client_stdios: B}] => [A, B]
    return _(dataArray)
        .flatMap(item => [item.client_sees, item.client_stdios])
        // 2. 过滤掉无效的值（null、undefined、false等）
        .filter(Boolean)
        // 3. 遍历每一个有效 client 对象，把它的 tools/resources/prompts 累加进最终结果中
        .reduce((acc, part) => {
            // 累加 tools，如果不存在就当空数组处理
            acc.mcp_tools.push(...(part.tools || []));
            // 累加 resources
            acc.mcp_resources.push(...(part.resources || []));
            // 累加 prompts
            acc.mcp_prompts.push(...(part.prompts || []));
            return acc;
        }, {
            // 初始化最终结果结构
            mcp_tools: [],
            mcp_resources: [],
            mcp_prompts: []
        });
}

/**
 * 构建跨平台安全环境变量对象，用于 child_process / StdioClientTransport。
 * 保留系统 PATH，避免 spawn ENOENT 错误；兼容 Windows/macOS/Linux。
 *
 * @param {Object} customEnv - 你要注入的环境变量，例如 { NODE_ENV: 'production' }
 * @returns {Object} 最终传入子进程的环境变量对象
 */
export const buildSafeEnv = (item) => {
    const pathKey = Object.keys(process.env).find(
        key => key.toLowerCase() === 'path'
    ) || 'PATH';

    const baseEnv = {
        [pathKey]: process.env[pathKey],
        LANG: process.env.LANG || 'en_US.UTF-8',
        NODE_ENV: 'production', // ✅ 默认注入生产环境标识
    };

    if (!item || !item.env || Object.keys(item.env).length === 0) {
        return baseEnv; // 没有额外 env，只返回基础环境
    }

    return {
        ...baseEnv,
        ...item.env, // 合并用户自定义变量（可以覆盖 NODE_ENV）
    };
}