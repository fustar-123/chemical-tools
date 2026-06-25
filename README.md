# chemical-tools

个人化工设计计算工具箱。

## 当前模块

- 泵扬程计算器
- 管道压降
- 管径计算
- 雷诺数
- NPSH
- 换热面积
- LMTD
- 换热器压降
- 管式反应器
- 停留时间
- 持液量
- 储罐容积
- 氮封
- 呼吸阀
- 安全阀

## 本地使用方式

双击 `index.html`，或在浏览器中打开项目根目录下的 `index.html`。

## GitHub Pages 发布方式

1. 在 GitHub 创建 `chemical-tools` 仓库，建议设置为 public。
2. 推送本地仓库到 GitHub：

   ```bash
   git remote add origin https://github.com/<你的用户名>/chemical-tools.git
   git branch -M main
   git push -u origin main
   ```

3. 在仓库页面进入 `Settings` -> `Pages`。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，`Folder` 选择 `/root`。
6. 保存后等待 GitHub Pages 发布完成。

发布后网站地址通常为：

```text
https://<你的用户名>.github.io/chemical-tools/
```

## 说明

本项目中的计算器用于工程初算和方案比较。正式设计应结合现行标准规范、物性数据、厂家资料和项目审查要求复核。
