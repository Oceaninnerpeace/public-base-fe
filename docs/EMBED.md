# iframe 嵌入集成

将本系统作为子应用嵌入第三方系统时，可只展示**页面内容区**（无侧栏、顶栏、标签栏）。

## 启用方式

| 方式 | 说明 |
|------|------|
| URL 参数 | `?embed=1` 或 `?iframe=1`（推荐显式指定，便于联调） |
| 自动检测 | 页面在 iframe 内且 `VITE_APP_EMBED_AUTO_IFRAME` 不为 `false` 时自动启用 |
| 构建变量 | `VITE_APP_EMBED=true` 强制全站内容区模式 |

关闭（仍在 iframe 内时）：`?embed=0`

内容区内边距：`?embedPadding=0`（默认 16px）

## 父页面示例

```html
<iframe
  id="adminFrame"
  src="https://your-admin.com/system/user?embed=1"
  style="width:100%;height:100%;border:0"
></iframe>

<script>
  const frame = document.getElementById('adminFrame');
  const ADMIN_ORIGIN = 'https://your-admin.com';

  window.addEventListener('message', (e) => {
    if (e.origin !== ADMIN_ORIGIN) return;
    const { source, type } = e.data || {};
    if (source !== 'vue-admin') return;

    if (type === 'ready') {
      // 子应用已就绪，可下发 token 或跳转
      frame.contentWindow.postMessage(
        { source: 'vue-admin-parent', type: 'setToken', token: 'YOUR_ACCESS_TOKEN' },
        ADMIN_ORIGIN,
      );
    }
    if (type === 'route') {
      console.log('子应用路由:', e.data.path, e.data.title);
    }
    if (type === 'logout') {
      // 子应用内退出，父系统同步登出
    }
  });

  function openPage(path) {
    frame.contentWindow.postMessage(
      { source: 'vue-admin-parent', type: 'navigate', path },
      ADMIN_ORIGIN,
    );
  }
</script>
```

## 一次性 Token（URL 传参）

父系统可在 iframe `src` 上带 token（进入后自动从地址栏移除）：

```
https://your-admin.com/dashboard?embed=1&token=YOUR_ACCESS_TOKEN
```

也支持 `access_token` 参数名。

## postMessage 协议

**父 → 子**（`source: 'vue-admin-parent'`）

| type | 字段 | 说明 |
|------|------|------|
| `setToken` | `token` | 写入登录态并拉取用户信息 |
| `navigate` | `path` | 路由跳转，如 `/system/user` |
| `refresh` | — | 刷新当前内容区 |
| `logout` | — | 触发子应用退出 |

**子 → 父**（`source: 'vue-admin'`）

| type | 说明 |
|------|------|
| `ready` | 嵌入模式就绪 |
| `route` | 路由变化，含 `path`、`fullPath`、`title` |
| `logout` | 用户在子应用内点击退出 |

生产环境请配置 `VITE_APP_EMBED_PARENT_ORIGIN` 为父系统 origin，避免使用 `*`。

## 环境变量

```env
# iframe 内自动进入内容区模式（默认 true，可设 false 仅允许 ?embed=1）
VITE_APP_EMBED_AUTO_IFRAME=true

# 父页面 origin，用于 postMessage 校验与发送目标
# VITE_APP_EMBED_PARENT_ORIGIN=https://parent.example.com

# 强制整站内容区模式（一般不需要）
# VITE_APP_EMBED=true
```

## 注意

- 父系统需允许 iframe 加载（CSP `frame-ancestors`、X-Frame-Options 等）。
- 未登录且未传 token 时仍会进入登录页（登录页保留完整表单，便于独立调试）。
- 嵌入模式下不记录多标签页（Tabbar）。
