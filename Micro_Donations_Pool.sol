pragma solidity ^0.8.0;

contract DonationPool {
    address public owner;
    uint256 public totalDonations;
    
    mapping(address => uint256) public donations;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    function donate() public payable {
        require(msg.value > 0, "Must send some ether");
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;
    }
    
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds available");
        payable(owner).transfer(amount);
    }
}

