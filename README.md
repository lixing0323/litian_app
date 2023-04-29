# `rpi-mini-program`

> Rui Pu Instrument Data Management System
121d394334390bc0d5c1342c3a2c1c11
> 瑞谱分析仪数据管理平台-小程序端

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
npm run dev:app-plus
npm run dev:custom
npm run dev:h5
npm run dev:mp-alipay
npm run dev:mp-weixin
```

### Compiles and minifies for production
```
npm run build
npm run build:app-plus
npm run build:custom
npm run build:h5
npm run build:mp-alipay
npm run build:mp-weixin
```

- class不支持绑定Obejct变量（使用字符串的形式绑定）
- 不支持事件修饰符：prevent、passive（在App与小程序平台，使用stop修饰符，既可以阻止冒泡也能阻止默认行为）
- 不支持render、inline-template、X-Templates、keep-alive、transition
- 不支持使用 Vue.use 的方式注册全局组件（在main.js使用Vue.component的方式引入）
- 升级时注意异常注意 cli-plugin-babel 的版本号，可下载最新版项目查看package.json
- 下载最新版项目 cd 任意目录，执行 vue create -p dcloudio/uni-preset-vue app

### 包名
com.itkairui.manjk.article.tv

### 生成签名证书
keytool -genkey -alias manjkarticletv -keyalg RSA -keysize 2048 -validity 36500 -keystore manjkarticletv.keystore
姓名: jxk
单位: kairui
组织: kairui
城市: hangzhou
省: zhejiang
国家: china

