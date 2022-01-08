// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Minter.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract SunflowerFarmersStatue is ERC721, Minter {
    uint public totalSupply;

    constructor() public ERC721("Sunflower Farmers Statue", "SFS") {
        minter = msg.sender;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= 1000);

        return "https://sunflower-farmers.com/play/nfts/statue/metadata";
    }


    function mint(address account, uint256 amount) public onlyMinter {
        require(amount == 1);
        require(totalSupply < 1000, "Only 1000 statues can be minted");
        require(balanceOf(account) < 1, "A farm can only have 1 statue");

        uint256 tokenId = totalSupply + 1;
        _mint(account, tokenId);

        totalSupply = totalSupply + 1;
	}
}