import React,{useState,useEffect} from 'react'
import BankingContract from "../contracts/Banking.json";
import getWeb3 from "../getWeb3";



const useBasicDetails = () => {

  const [contract, setContract] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [contractAddress,setContractAddress]=useState(undefined)

    useEffect(() => {
        const getBasicDetails = async () => {
          try {
            const web3 = await getWeb3();
    
            const accounts = await web3.eth.getAccounts();
    
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = BankingContract.networks[networkId];
            setContractAddress(deployedNetwork.address)
            const instance = new web3.eth.Contract(
              BankingContract.abi,
              deployedNetwork && deployedNetwork.address
            );
            setWeb3(web3);
            setAccount(accounts[0]);
            setContract(instance);
          } catch (error) {
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`
            );
            console.error(error);
          }
        };
        getBasicDetails();
      }, []);
 
    return [web3,account,contract,contractAddress]
}

export default useBasicDetails
