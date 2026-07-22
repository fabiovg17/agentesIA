cuando hice lo del server entré a MCP configuraciones de usuario, debe estar un server y no tiene nada, debe agregar algo similar a esto, donde se debe colocar la ruta con la que estoy trabajando:

por ahora mi mcp.json tiene estas configuraciones
para hacer un ejemplo

{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/fabiovalverde/Documents/Aprendizaje/Agentes IA MCP/agentesIA"
      ]
    },
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time"
      ]
    },
    "git": {
      "command": "uvx",
      "args": [
        "mcp-server-git"
      ]
    }
  }
}


--
