// 模拟执行单个函数的函数

import {see_cli, stdio_cli} from "./client.js";
import {_} from "./ulits.js";

/**
 * 执行单个函数
 * @param {Object} tools - 包含函数信息的对象
 * @param {Array} mcp_tools - 工具服务器信息数组
 * @returns {Promise<Object>} - 返回函数执行结果和服务器信息
 */
async function executeFunction(tools, mcp_tools) {
    const name_uuid = tools.function.name;  // 带有 uuid 的 name 用来确定是哪个智能体的工具
    const argumentss = tools.function.arguments;  // 从大模型获取的参数
    const name = name_uuid.split('/')[0];  // 纯工具 name 在运行工具时用到
    // 在工具表里检索获取工具的 server 信息
    const toolServer = _.find(mcp_tools, {name: name_uuid});

    // 异步操作,每次运行一个, 返回一个 Promise
    const result = await new Promise(async resolve => {
        if (toolServer) {
            let client;
            //这里重新建立一个客户端连接,去运行工具
            if (toolServer.server.type === 'sse') {
                client = await see_cli(toolServer.server.baseUrl);
            } else if (toolServer.server.type === 'stdio') {
                client = await stdio_cli(toolServer.server);
            }
            try {
                //用mcp运行工具
                const result = await client.callTool({
                    arguments: argumentss,
                    name: name
                });
                // 返回工具调用的结果和工具服务器信息
                resolve({
                    ...result,
                    mcp_server: {
                        tool_name: name,
                        name: toolServer.server.name,
                        server: toolServer.server.mcp_server,
                    },
                    role: "tool"
                });
            } catch (error) {
                resolve({
                    role: "tool",
                    content: [{
                        type: 'error',
                        text: '工具调用失败',
                        data: error.message
                    }]
                });
            }

        } else {
            resolve({
                role: "tool",
                content: [{
                    type: 'error',
                    text: '未找到工具服务器,可能是大模型参数太小,无法理解调用的工具',
                    data: name_uuid
                }]
            });
        }
    });

    console.log('🛼 运行了', result)
    console.log('======================end========================');
    return result;
}

/**
 * 顺序执行所有函数
 * @param {Array} tools - 函数数组
 * @param {Array} mcp_tools - 工具服务器信息数组,这里要拿到所有工具列表
 * @returns {Promise<Array>} - 返回所有函数执行结果
 */
async function run_tools(tools, mcp_tools) {
    const results = [];
    console.log('====================start==========================');
    for (const func of tools) {
        try {
            const result = await executeFunction(func, mcp_tools);
            results.push(result);
        } catch (error) {
            console.error(`执行函数 ${func.function.name} 时出错:`, error);
            throw error; // 可以选择继续执行或抛出错误中断
        }
    }
    return results;
}

// /**
//  * 尝试执行一个函数，最多重试 3 次，并返回最终结果（成功或失败）
//  * @param {Object} tool - 工具函数信息
//  * @param {Array} mcp_tools - 工具服务器信息数组
//  * @param {number} maxRetries - 最大重试次数（默认 3）
//  * @returns {Promise<Object>} - 成功或最终失败结构化结果
//  */
// async function run_tools(tool, mcp_tools, maxRetries = 3) {
//     let attempt = 0;
//
//     while (attempt < maxRetries) {
//         try {
//             const result = await executeFunction(tool, mcp_tools);
//             return result; // 执行成功，立即返回结果
//         } catch (error) {
//             attempt++;
//             console.warn(`⚠️ 第 ${attempt} 次执行失败:`, error.message || error);
//             if (attempt >= maxRetries) {
//                 return {
//                     role: "tool",
//                     content: [{
//                         type: 'error',
//                         text: `工具执行失败，已重试 ${maxRetries} 次`,
//                         data: error.message || String(error)
//                     }]
//                 };
//             }
//         }
//     }
// }

export {run_tools};