pragma solidity >=0.4.25 <0.6.0;

contract SimpleStorage {
  string IPFS_Hash = '{"hash":"Sample"}';

  function set(string memory new_Hash) public {
    IPFS_Hash = new_Hash;
  }

  function get() public view returns (string memory) {
    return IPFS_Hash;
  }
}
