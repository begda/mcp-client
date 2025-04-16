import {see_cli, stdio_cli} from './client.js'
import {mcp_server} from './server.js'
import {mcp_ollama_tools} from './ulits.js'
import {run_tools} from './tools.js'

// 👇 命名导出，支持按需引用
export {
    see_cli,   //see客户端
    stdio_cli, //stdio客户端
    mcp_server,  // mcp服务器启动工具,需要先加载配置文件
    mcp_ollama_tools,  //把工具转换成ollamam格式工具
    run_tools    //运行工具,如果是多个工具,就顺序运行
};

