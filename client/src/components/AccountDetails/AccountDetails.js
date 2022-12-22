import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import Loader from "react-loader-spinner";
import "./AccountDetails.css";
import useBasicDetails from "../../hooks/useBasicDetails";


const AccountDetails = () => {
  
 
  const [bankingAccount,setBankingAccount]=useState(undefined)
  const [createdDate,setCreatedDate]=useState(undefined)
  const [loading,setLoading]=useState(true)
  const [bankingAccountBalance,setBankingAccountBalance]=useState(undefined)
  const [balanceAdded, setBalanceAdded] = useState("");
  const [balanceWithdrawn, setBalanceWithdrawn] = useState("");

  
  //Use the same variable predefined after " :"
  const { id } = useParams();

  const [web3,account,contract,contractAddress]=useBasicDetails()

 
  
  useEffect(() => {
    const getContractDetails = async () => {
      console.log(id);
      await contract.methods
        .accounts(id)
        .call()
        .then((res) => {
          setBankingAccount(res);
          setBankingAccountBalance(res.balance)
          setCreatedDate(new Date(res.createdAt * 1000).toLocaleString());
          console.log(createdDate);
          console.log(res);
        })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });

      //Get the contact balance
      await contract.methods
        .getContractBalance()
        .call()
        .then((res) => {
          console.log(web3.utils.fromWei(res, "ether"));
        })
        .catch((err) => {
          console.log(err);
        });

      //Get the sender balance
      await contract.methods
        .getSenderBalance(account)
        .call()
        .then((res) => {
          console.log(account);
          console.log(web3.utils.fromWei(res, "ether"));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      console.log(contract);
      console.log(contract.options.address);
      console.log(contractAddress);
      getContractDetails();
    }
    // eslint-disable-next-line
  }, [web3, account, contract]);


  





 //Function handler on adding balance
  const addBalance = async (e) => {
    e.preventDefault();
    console.log(`${id}`);
    console.log(balanceAdded);
    console.log("add");
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ){

     await contract.methods
       .addBalance(id, web3.utils.toWei(balanceAdded, "ether"), account)
       .send({ from: account, value: web3.utils.toWei(balanceAdded, "ether") })

       .then(async (res) => {

         await contract.methods
           .accounts(id)
           .call()
           .then((res) => {
             setBankingAccountBalance(res.balance);
           })
           .catch((err) => {
             console.log(err);
           });
         console.log(res);
       })
       .catch((err) => {
         console.log(err);
       });
    }
  };









//Function handler on withdrawing balance
  const withdrawBalance = async (e) => {
    e.preventDefault();
    console.log(`${id}`);
    console.log(balanceWithdrawn);
    console.log("withdraw");
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    
    ) 
    
    { 
        console.log(contract.options.address);
       

      await contract.methods
        .withdrawBalance(id,web3.utils.toWei(balanceWithdrawn,'ether'), account
        

        //Here from and to is only for sending gas from our deployed account to the contract to just call the method
        //In the contract the withdrawAmount is transferred from the contract to our specified ethereum account here
        ).send({from:account,to:contract.options.address})
        .then(async(res) => {

           await contract.methods.accounts(id).call().then((res)=>{
             setBankingAccountBalance(res.balance)
           })
           .catch((err)=>{console.log(err)})
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };



  if (!web3) {
    return (
      <div className="default">
        <Loader
          type="TailSpin"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={10000} //10 secs
        />
      </div>
    );
  }
  return (
    <div className="account-details-section">
      <div className="account-details-grid-wrapper">
        <div className="account-card">
          {!loading ? (
            <div className="inner-wrapper">
              <h1><span>Numero du compte :</span> {bankingAccount.serial}</h1>
              <h1><span>Nom du compte :</span> {bankingAccount.name}</h1>
              <h1><span>Balance du compte:</span> {bankingAccountBalance} ETH</h1>
              <h1><span>Localisation du compte:</span> {bankingAccount.location}</h1>
              <h1><span>Compte : cree a </span> {createdDate}</h1>
            </div>
          ) : null}
        </div>

        <div className="add-balance-card">
          <h1>Ajouter une balance a votre compte</h1>
          <form onSubmit={addBalance} className="transact-form">
            <input
              type="number"
              className="form-input-account"
              placeholder="Ajouter montant"
              value={balanceAdded}
              onChange={(e) => {
                setBalanceAdded(e.target.value);
              }}
            />
            <button className="approve-button" type="submit">
              Ajouter
            </button>
          </form>
        </div>

        <div className="withdraw-balance-card">
          <h1>Debiter une balance de votre copte existatnt</h1>
          <form onSubmit={withdrawBalance} className="transact-form">
            <input
              type="number"
              className="form-input-account"
              placeholder="Withdraw amount"
              value={balanceWithdrawn}
              onChange={(e) => {
                setBalanceWithdrawn(e.target.value);
              }}
            />
            <button className="approve-button" type="submit">
              debiter
            </button>
          </form>
        </div>

        <div className="transfer-balance-card">
          <h1>
             TRANSFERER ARGENT
          </h1>
          <button
            className="approve-button1"
            onClick={() => {
              window.location = `/transfer/${id}`;
            }}
          >
            TRANSFERER ARGENT A D'AUTRES COMPTES
          </button>
        </div>

        <div className="loan-transaction-card">
        <h1>
           HISTORIQUE
          </h1>
          <button className="approve-button1"
           
           onClick={()=>{
             window.location.href=`/transactions/${id}`
           }}
          >
          HISTORIQUES DE TRANSACTION
          HISTORIQUES DE TRANSACTION
          </button>
        </div>

       
      </div>
    </div>
  );
};



export default AccountDetails;
