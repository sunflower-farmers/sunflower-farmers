// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Minter.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract GoldenEgg is ERC721, Minter {
    uint public totalSupply;

    constructor() public ERC721("Sunflower Farmers Golden Egg", "SFGE") {
        minter = msg.sender;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= 300);

        return "https://sunflower-farmers.com/play/nfts/golden-egg/metadata";
    }


    function mint(address account, uint256 amount) public onlyMinter {
        require(amount == 1);
        require(totalSupply < 300, "Only 300 eggs can be minted");

        uint256 tokenId = totalSupply + 1;
        _mint(account, tokenId);

        totalSupply = totalSupply + 1;
	}
}