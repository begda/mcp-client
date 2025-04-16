import {see_cli, stdio_cli} from './client.js'
import {clientData, mergeClientData, uuidToMcp, uuidv4,_} from './ulits.js'

// sse服务器所有信息
const server_sse = async (item) => {
    const client = await see_cli(item.baseUrl)
    // const sessionId = client._transport._endpoint.searchParams.get('sessionId')
    const sessionId = uuidv4()
    //给工具添加服务器信息,和服务类型 sse代表http连接的服务
    const mcp_server = {
        ...item, //mcp服务注册系统的信息
        mcp_server: client.getServerVersion(), //这是注册完以后加载的mcp真实服务的版本信息和名字
        type: 'sse'
    }
    const {tools, resources, prompts} = await clientData(client);
    return {
        tools: uuidToMcp(tools, sessionId, mcp_server),
        resources: uuidToMcp(resources, sessionId, mcp_server),
        prompts: uuidToMcp(prompts, sessionId, mcp_server),
    };
}

// stdio服务器所有信息
const server_stdio = async (item) => {
    const client = await stdio_cli(item)
    const sessionId = uuidv4()
    //给工具添加服务器信息,和服务类型 stdio代表在本地运行的服务,目前本地运行只支持node 其他不支持
    const mcp_server = {
        ...item, //mcp服务注册系统的信息
        mcp_server: client.getServerVersion(), //这是注册完以后加载的mcp真实服务的版本信息和名字
        type: 'stdio',  //在本地运行是stdio
    }
    const {tools, resources, prompts} = await clientData(client);
    return {
        tools: uuidToMcp(tools, sessionId, mcp_server),
        resources: uuidToMcp(resources, sessionId, mcp_server),
        prompts: uuidToMcp(prompts, sessionId, mcp_server),
    };
}

export const mcp_server = async (config) => {
    if (!config) {
        throw new Error('缺少 MCP 配置，程序终止'); // 阻止程序运行
    }
    // 转换成数组，每个元素带上 key, 把传入的mcp服务器列表转换成数组
    const configArray = _.map(config, (value, key) => ({key, ...value}));
    //获取mcp配置列表里所有服务器的 工具,资源,和提示词
    // 遍历所有配置，尝试建立连接
    const results = await Promise.allSettled(
        configArray.map(async (item) => {
            try {
                let client_sees = null;
                let client_stdios = null;

                // 根据类型选择客户端连接方式
                if (item.type === 'sse') {
                    client_sees = await server_sse(item);
                } else if (item.type === 'stdio') {
                    client_stdios = await server_stdio(item);
                }

                return {client_sees, client_stdios};
            } catch (error) {
                // 如果某个连接失败，直接抛出让 allSettled 捕捉
                throw new Error(`连接失败: ${item.key}, 错误信息: ${error.message}`);
            }
        })
    );
    //打印失败的服务器信息（便于排查）
    results
        .filter(result => result.status === 'rejected')
        .forEach(result => console.warn('部分mcp服务器连接失败：', result.reason));

    // 筛选出成功的连接结果
    const fulfilledResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

    return mergeClientData(fulfilledResults)
}