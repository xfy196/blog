---
isTimeLine: true
title: ERC20 接口规范
date: '2026-01-16'
public: true
tags:
  - web3
  - solidity
categories:
  - web3
---
# ERC20 接口规范
`solidity`接口中有一种常见的标准叫`ERC20`标准，学习`ERC20`前我们先了解一下接口是什么？
![](https://www.duotin.com/wp-content/uploads/2023/04/2023040313265460.jpg)
比如不同的电子设备总有不同的接口，`typec use3.0`等，我们可以试想一下，如果不同的电子产品没有明确接口的标准，每个型号都有不同的接口，那么对于用户他的使用成本也会变高，对于企业他的研发成本也会变高，对于市场他的监管成本也会变高，于是有这样的一些自发性组织提出了接口的概念，他们统一了这些接口的标准，让我可以做到 A 手机设备可以给 B 手机充电。那么在`solidity`开发中也存在着这样的标准。定义完成一个功能的基本标准规范，却不限定你具体的实现逻辑，只确定你的输入和输出标准。
> tip: 接口的概念不限于 solidity，基本所有的面向对象语言都支持这个概念
### ERC20是以太坊上的一种合约标准。
它包含5个函数、2个事件。具体如下：
- totalSupply()： token的总量
- balanceOf() ：某个地址上的余额
- transfer() ： 发送token
- allowance() ：额度、配额、津贴
- approve() ： 批准给某个地址一定数量的token(授予额度、授予津贴)
- transferFrom()： 提取approve授予的token(提取额度、提取津贴)
- Transfer() ： token转移事件
- Approval() ：额度批准事件

这样的一个标注清晰的告诉你，实现某种合约的功能有这些标准的功能，你只需要按照这个标准实现具体的功能即可。
| 标准函数                                                                    | 含义                            |
|-------------------------------------------------------------------------|-------------------------------|
| totalSupply()                                                           | 代币总量                          |
| balanceOf(addresss account)                                             | account地址上的余额                 |
| transfer(address recipient, uint256 amount)                             | 向recipient发送amount个代币         |
| allowance(address owner, address spender)                               | 查询owner给spender的额度(总配额)       |
| approve(address spender, uint256 amount)                                | 批准给spender的额度为amount(当前配额)    |
| transferFrom(address sender, address recipient, uint256 amount)         | recipient提取sender给自己的额度       |
| Transfer(address indexed from, address indexed to, uint256 value)       | 代币转移事件：从from到to转移value个代币     |
| Approval(address indexed owner, address indexed spender, uint256 value) | 额度批准事件：owner给spender的额度为value |

**做个简单的钱包转账记录的 demo**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
contract ERC20 is IERC20 {
    // 代币总量
    uint public totalSupply;
    // account 上的余额
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name = "test";
    string public symbol = "TEST";
    uint public decimals = 18;
    
    function transfer(address recipient, uint256 amount) external returns (bool){
        balanceOf[msg.sender]  -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    function approve(address spender, uint256 amount) external returns (bool){
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool){
        allowance[sender][recipient] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
    function mint(uint amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }
}
```