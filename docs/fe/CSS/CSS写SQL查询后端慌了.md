---
isTimeLine: true
title: CSS写SQL查询后端慌了
date: 2026-01-02
origin: me
tags:
  - CSS
categories:
  - 前端
---

CSS 写 SQL 查询？后端慌了！
===================

![cover_image](https://static.xxytime.top/2026/01/02/55bd7944-ebd6-4f3b-b58e-e39e7a87dfd4.jpg)

初次接触到这个项目时，我的第一反应只有**四个字**：

![](https://static.xxytime.top/2026/01/02/33a1f186-3dec-4908-b317-762ea60d84e3.jpg)

**这也行？**

最近在 **X** 上大火的一个叫 **TailwindSQL** 的项目，引发了广泛讨论。

![](https://static.xxytime.top/2026/01/02/d00b126c-cb2a-4931-bf91-82c02533bad4.jpg)

其核心玩法非常简单——**通过 CSS 的 className 来实现 SQL 查询功能。**

前端发展到这个地步了吗？
------------

让我们先看一个示例：

    <DB className="db-users-name-where-id-1" />

如果你是**前端开发者**，可能会下意识地认为这是在`定义样式`；

但如果你是**后端开发者**，估计已经开始皱眉了。

然而实际上，这段代码执行的是：

    SELECT name FROM users WHERE id = 1;

看到这里，我确实愣了一下。

TailwindSQL 的本质
-----------------

简而言之，它将 **SQL** 语句拆解为一个个`「类名」`片段。

这种做法类似于 `TailwindCSS` 对 `CSS` 的处理方式：

    db-users
    db-users-name
    db-users-name-where-id-1
    db-products-orderby-price-desc

这些 **className** 最终会被解析为 `SQL` 语句，并在 **React Server Components** 中直接执行。

你甚至无需编写 **API** 接口，也无需使用 **ORM** 框架。

这个方案可靠吗？
------

从工程实践的角度来看，答案其实很明确：

**并不可靠。**

**SQL** 的复杂性，从来不是语法层面的问题。

真正的挑战在于：

*   **表关系管理**
    
*   **复杂 JOIN 操作**
    
*   **嵌套子查询**
    
*   **事务控制**
    
*   **权限验证**
    
*   **边界条件处理**
    

一旦查询逻辑稍显复杂，**className** 就会变得越来越冗长，最终形成一串难以维护的代码片段。

说实话，我很难想象在实际项目中，会有开发者认真地写出这样的代码：

    className="db-orders-user-products-joinwhere-user-age-gt-18and-order-status-paidgroupby-user-id"

这已经不再是 DSL（领域特定语言）了，而是一种折磨。

我认为 **TailwindSQL** 很难在生产环境中得到应用，它更像是 **vibe coding**（氛围编程）的产物。

是否使用？可以了解一下，然后继续编写你熟悉的 **SQL** 吧。

*   **TailwindSQL 官网**：`https://tailwindsql.com/`