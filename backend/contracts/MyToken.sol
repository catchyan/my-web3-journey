// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    address owner; 
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        owner = msg.sender;
        _mint(owner, initialSupply); // 创建初始供应量的代币并发送给合约创建者
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner can mint");
        _mint(to, amount);
    }
    
}
