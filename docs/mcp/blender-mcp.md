# Blender MCP Setup

This project can use `ahujasid/blender-mcp` for Blender-assisted 3D scene work, such as rendering a wind-blown desktop background for the Notes section.

## What Is Configured

- Project-level Cursor MCP config: `.cursor/mcp.json`
- MCP server command: `uvx blender-mcp`
- Blender socket target: `localhost:9876`
- Telemetry disabled for MCP server startup through `DISABLE_TELEMETRY=true`

## Requirements

- Blender 3.0 or newer
- `uv` / `uvx`
- Blender MCP add-on installed in Blender

`uvx` is already available on this machine. Blender was not found in the default `/Applications/Blender.app` path during setup, so install Blender before trying to render.

## Blender Add-on Setup

1. Download `addon.py` from `https://github.com/ahujasid/blender-mcp`.
2. Open Blender.
3. Go to `Edit > Preferences > Add-ons`.
4. Click `Install...` and select `addon.py`.
5. Enable `Interface: Blender MCP`.
6. In the 3D View sidebar, open the `BlenderMCP` tab.
7. Click `Connect to Claude`.

The Blender add-on starts a local socket server on `localhost:9876`. The MCP server connects to that socket.

## Codex Setup

Codex is also configured globally in `~/.codex/config.toml` with:

```toml
[mcp_servers.blender]
command = "uvx"
args = ["blender-mcp"]
env = { BLENDER_HOST = "localhost", BLENDER_PORT = "9876", DISABLE_TELEMETRY = "true" }
```

Restart Codex after changing MCP config. New MCP tools are loaded at session startup.

## Usage Notes

- Run only one Blender MCP server per client session.
- Keep Blender open and the add-on connected before asking the agent to operate Blender.
- Save Blender files before using arbitrary code execution tools.
- Use Blender for rendered background assets; keep webpage text and interactions in HTML/CSS/JS.
