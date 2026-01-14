---
isTimeLine: true
title: Delegatecall(委托调用)
date: '2026-01-13'
public: false
tags:
  - web3
  - solidity
categories:
  - web3
---
# Delegatecall(委托调用)
Delegatecall(委托调用) 是 Solidity 中一种强大的功能，它允许一个合约调用另一个合约的函数，并且使用调用合约的存储。这意味着被调用的合约可以修改调用合约的存储，从而实现一些有趣和有用的功能。
>**简单的看个demo**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TestDelegateCall{
    uint public num;
    address public sender;
    uint public value;
    function setVars(uint _num) external payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}
contract DelegateCall {
    uint public num;
    address public sender;
    uint public value;

// 委托调用 调用别的合约方法来修改自己的状态变量
    function setVars(address _test, uint _num) external payable {
        // _test.delegatecall(abi.encodeWithSignature("setVars(uint256)", _num));
       (bool success, bytes memory data) = _test.delegatecall(abi.encodeWithSelector(TestDelegateCall.setVars.selector, _num));
       require(success, "delegatecall failed");
    }
}
```
这个demo的结果是，调用`TestDelegateCall`合约的`setVars`方法，但是改变的却并不是`TestDelegateCall`的状态变量，而是`DelegateCall`合约的状态变量。
