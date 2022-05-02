pragma solidity 0.8.1;

contract AcademyWallet {

    mapping(address => uint256) private _balances;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }

    receive() external payable  {
        _balances[msg.sender] += msg.value;
    }

    function deposit() payable public returns (bool) {
        _balances[msg.sender] += msg.value;
        return true;
    }

    function withdraw() public returns (bool) {
        address payable sender = payable(msg.sender);
        uint256 withdrawAmount = _balances[sender];
        _balances[sender] = 0;
        sender.transfer(withdrawAmount);
        return true;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function thisBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
}
