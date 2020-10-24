import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { Button } from '@material-ui/core';
import styles from "assets/jss/material-kit-react/views/home.js";
import { toastAlert }  from "../helper/toastAlert";
import { Link } from "react-router-dom";
import TronWeb from "tronweb";
import config  from "../config/config";
import ABI  from "../ABI/ABI.json";
import FacebookLogin from 'react-facebook-login';
const dashboardRoutes = [];
const useStyles = makeStyles(styles);
var contractAddress = config.conractAddress;
var contractAddress = config.conractAddress;
var baseUrl = config.baseUrl;


export default function Join(props) {

  const [referaddress, setReferaddress] = React.useState('');
  const [sponser, setSponsors]       = React.useState('');
  const [windowTron, setwindowTron] = React.useState('');
  const [totalDeposited, set_totalDeposited] = React.useState('0');
  const [poolBalance, set__poolBalance] = React.useState('0');
  const [totalWithdraw, set_totalWithdraw] = React.useState('0');
  const [depositAmount, set__depositAmount] = React.useState('0');
  const [deposit_amount, set__deposit_amount] = React.useState('0');
  
  const [addressError, setAddressError] = useState(null);

window.addEventListener('message', function (e) {
    try{
      if (e.data.message && e.data.message.action == "tabReply") {
        console.log("tabReply event", e.data.message)
        if (e.data.message.data.data.node.chain == '_'){
            console.log("tronLink currently selects the main chain")
        }else{
            console.log("tronLink currently selects the side chain")
        }
      }

      if (e.data.message && e.data.message.action == "setAccount") {
         console.log('setAccount')
        var loginName = e.data.message.data.name;
        var getName = localStorage.getItem('qas4567d');
        var encodedString = window.btoa( loginName );
        var decodedString = window.atob( getName ); 

        if(getName && getName !=null){
          if(decodedString !=loginName){
            console.log('wallet connectionn',loginName)
            setTimeout(function() {
              setwindowTron(window.tronWeb);
               contractInfo();
              toastAlert('success',"Wallet connected successfully",'tronwallet');
              localStorage.removeItem("qas4567d");
              localStorage.setItem('qas4567d', encodedString);
            },1000);
          }
        }else{
         localStorage.setItem('qas4567d', encodedString); 
        }
      }
      if (e.data.message && e.data.message.action == "setNode") {
          console.log("setNode event", e.data.message)
          if (e.data.message.data.node.chain == '_'){
              console.log("tronLink currently selects the main chain")
          }else{
              console.log("tronLink currently selects the side chain")
          }

      }
    }catch(e){
      console.log('wallet error',e)
    }
  });

  useEffect(()  => {
//console.log('@@@@@@@@@@@@@@@@@@@@@@@@')
setTimeout(function(){
   contractInfo();
   userInfo();
 },1000)
   total_users();
   users();
   pool_balance();

  });

  function tronWebconnect(){

    if(windowTron && windowTron.defaultAddress && windowTron.defaultAddress.base58){
      return windowTron;
    }else if(window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58){
      return window.tronWeb;
    }else{
      return false;
    }
    
  }

  async function contractInfo(){
  //  console.log('contractinfo')
    var tronWebconn = tronWebconnect();

    if(tronWebconn && tronWebconn.defaultAddress && tronWebconn.defaultAddress.base58) {
    var tronweb = tronWebconn;
    var currAddr = tronWebconn.defaultAddress.base58;
    var contract = await tronweb.contract(ABI).at(contractAddress);
    var getvalue = await contract.contractInfo().call();
    var total_deposited = await tronweb.toDecimal(getvalue._total_deposited._hex);
    var total_withdraw = await tronweb.toDecimal(getvalue.total_withdraw);

     if(total_withdraw > 0){
          total_withdraw = total_withdraw/1000000;
        }
     set_totalWithdraw(total_withdraw);

     if(total_deposited > 0){
          total_deposited = total_deposited/1000000;
        }
     set_totalDeposited(total_deposited);

  }else{
    console.log('currentUserid not working')
  }
  }  

  async function total_users(){

  }

  async function userInfo(){
    console.log('userInfo')

    var tronWebconn = tronWebconnect();

    if(tronWebconn && tronWebconn.defaultAddress && tronWebconn.defaultAddress.base58) {

    var tronweb = tronWebconn;
    var currAddr = tronWebconn.defaultAddress.base58;
    var contract = await tronweb.contract(ABI).at(contractAddress);
    var getvalue = await contract.userInfo(currAddr).call();
    console.log(getvalue,'userInfo!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    var userinfo_deposit_amount = await tronweb.toDecimal(getvalue.deposit_amount._hex);
      if(userinfo_deposit_amount > 0){
          userinfo_deposit_amount = userinfo_deposit_amount/1000000;
        }
     set__deposit_amount(userinfo_deposit_amount);
  

  }else{
    console.log('currentUserid not working')
  } 
  }

  async function users(){
   
  }

  async function pool_balance(){
    var tronWebconn = tronWebconnect();

    if(tronWebconn && tronWebconn.defaultAddress && tronWebconn.defaultAddress.base58) {

    var tronweb = tronWebconn;
    var currAddr = tronWebconn.defaultAddress.base58;
    var contract = await tronweb.contract(ABI).at(contractAddress);
    var getvalue = await contract.pool_balance().call();
    var _pool_balance = await tronweb.toDecimal(getvalue._hex);
    if(_pool_balance > 0){
          _pool_balance = _pool_balance/1000000;
        }
    set__poolBalance(_pool_balance);
  

  }else{
    console.log('currentUserid not working')
  } 
  }

  

   function validation(){
    var formval =true;
    setAddressError(null);
    var tronWeb = window.tronWeb;
    var validAddr = tronWeb.isAddress(referaddress);
    if (referaddress == "") {
      formval =false;
      setAddressError('Referal id is required');
      
    }else if(!validAddr){

      formval =false;
      setAddressError('Invalid Referal id');

    }
    return formval;

  }

  async function reset(){
     toastAlert('success',"Rest successfully");
    document.getElementById("create-course-form").reset();
     
  }


  async function Join(){


    var tronweb = tronWebconnect();
    if(tronweb){
    
      console.log('contractAddress',contractAddress)
    var contract = await tronweb.contract(ABI).at(contractAddress);
    var currAddr = tronweb.defaultAddress.base58;
    console.log('current tron address',window.tronWeb.defaultAddress.base58)
    console.log('referaddress',referaddress);
    console.log(sponser,'topsponsors1')

     var result = await contract.deposit(referaddress).send({
              feeLimit:1000000000,
              callValue:sponser,
              shouldPollResponse:false
            });
        if (result!='') {
           toastAlert('success',"Join Successfully",'Join')
        }else{
          toastAlert('error',"Join Failed",'Join')
        }
            
            console.log('Successfully~~~~~~~~',result)
              
          }else{
                  toastAlert('error',"Please login your tronLink",'tronsignup')
          }
  }

  


  const classes = useStyles();
  const { ...rest } = props;

  
  return (
    <div>
      <div className="float_layer_div">
        <img src={require("../assets/images/layer_01.png")} alt="Icon" className="float_layer_01"/>
        <img src={require("../assets/images/layer_02.png")} alt="Icon" className="float_layer_02"/>
        <img src={require("../assets/images/layer_03.png")} alt="Icon" className="float_layer_03"/>
        <img src={require("../assets/images/layer_04.png")} alt="Icon" className="float_layer_04"/>
      </div>
      <Header className="header"
        color="transparent"
        routes={dashboardRoutes}
        brand={<img src={require("../assets/images/logo.png")} alt="Logo"/>}
        fixed
        changeColorOnScroll={{
          height: 50,
          color: "dark",
        }}
        {...rest}
      />
      
      <div className="page-header header-filter pt-5">
        <div className={classes.container}>
          <GridContainer className="mt-5">
            <GridItem sm={12} md={12} lg={8} className="text-center mt-5 m-auto">
              <h1>Join Strictly Mine</h1>
              <h4>Your TRX Wallet Address:</h4>
              <Link to="/" target="_blank" className="wallet_address">TQSw5N1n9upKWAS1wk1tEQ7uiqZgWjrb7T</Link>
              <div className="choose_trx_panel">
                <div className="choose_trx">
                  <h2>Top Sponsors</h2>
                  <form className="choose_trx_form" id="create-course-form">
                    <GridContainer>
                      <GridItem xs={12} sm={6} md={4}>
                        <div className="choose_trx_radio">
                          <input id="radio-1" name="radio" type="radio" value="500000000"  onChange={e => setSponsors(e.target.value)}/>
                          <label htmlFor="radio-1"  className="radio-label">500 TRX</label>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4}>
                        <div className="choose_trx_radio">
                          <input id="radio-2" name="radio" type="radio" value="1000000000" onChange={e => setSponsors(e.target.value)}/>
                          <label  htmlFor="radio-2"   className="radio-label">1000 TRX</label>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4}>
                        <div className="choose_trx_radio">
                          <input id="radio-3" name="radio" type="radio" value="10000000000" onChange={e => setSponsors(e.target.value)} / >
                          <label htmlFor="radio-3"   className="radio-label">10000 TRX</label>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4}>
                        <div className="choose_trx_radio">
                          <input id="radio-4" name="radio" type="radio" value="25000000000" onChange={e => setSponsors(e.target.value)}/>
                          <label  htmlFor="radio-4"   className="radio-label">25000 TRX</label>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4}>
                        <div className="choose_trx_radio">
                          <input id="radio-5" name="radio" type="radio" value="50000000000" onChange={e => setSponsors(e.target.value)}/>
                          <label htmlFor="radio-5"   className="radio-label">50000 TRX</label>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4}>
                        <div className="choose_trx_radio">
                          <input id="radio-6" name="radio" type="radio" value="100000000000" onChange={e => setSponsors(e.target.value)}/>
                          <label  htmlFor="radio-6"   className="radio-label">100000 TRX</label>
                        </div>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <input type="text" onChange={e => setReferaddress(e.target.value)}  className="trx_value"></input>
                      </GridItem>
                    </GridContainer>
                  </form>
                </div>
                <div className="choose_trx_btn_panel">
                  <Button className="choose_trx_btn" onClick={()=>{reset()}} >Reset</Button>
                  <Button className="choose_trx_btn" onClick={()=>{Join()}}>Join Now</Button>
                </div>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </div>

      <div className="main">
        {/* Features Section */}
        <div className="features_section">
          <div className="container"> 
            <div className="section text-center">
              <div className="features mt-5">
                <GridContainer>
                  <GridItem sm={6} md={6} lg={3}>
                    <div className="feature_panel">
                      <div className="feature_box">
                        <h2>Smart Contact Info</h2>
                        <div className="feature_panel_inner">
                          <div className="contract_address feature_box_details">
                            <label>Smart contract address</label>
                            <Link to="/" target="_blank">TUSAmtPo56...S5UqPNyrCou</Link>
                          </div>
                          <div className="feature_box_details">
                            <label>Total TRX Deposits All Time</label>
                            <p>{totalDeposited} TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Smart contract balance</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Amount withdrawn by members</label>
                            <p>{totalWithdraw} TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Amount in the daily pool</label>
                            <p>{poolBalance} TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Draw Daily Pool Through</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Max vol of TRX from top referrer</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="contract_address feature_box_details">
                            <label>Referred by</label>
                            <Link to="/" target="_blank">TUSAmtPo56...S5UqPNyrCou</Link>
                          </div>
                        </div>
                      </div>
                      <div className="feature_btn_panel">
                        <Button className="choose_trx_btn feature_btn">view contract</Button>
                      </div>
                    </div>
                  </GridItem>
                  <GridItem sm={6} md={6} lg={3}>
                    <div className="feature_panel">
                      <div className="feature_box">
                        <h2>Personal Statistic</h2>
                        <div className="feature_panel_inner">
                          <div className="feature_box_details">
                            <label>Next income countdown</label>
                            <p>00:00:00</p>
                          </div>
                          <div className="feature_box_details">
                            <label>365% income limit remain</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Daily income 1.5%</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Direct referral income</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Matching bonus</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>TOP Sponsor rewards</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Income withdrawn to wallet</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Unwithdrawn income</label>
                            <p>0 TRX</p>
                          </div>
                        </div>
                      </div>
                      <div className="feature_btn_panel">
                        <Button className="choose_trx_btn feature_btn">Withdraw</Button>
                      </div>
                    </div>
                  </GridItem>
                  <GridItem sm={6} md={6} lg={3}>
                    <div className="feature_panel">
                      <div className="feature_box">
                        <h2>Statistics</h2>
                        <div className="feature_panel_inner">
                          <div className="feature_box_details">
                            <label>Total amount of received TRX</label>
                            <p>0 TRX</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Total amount of deposited TRX</label>
                            <p>{deposit_amount}TRX</p>
                          </div>
                        </div>
                      </div>
                      <div className="feature_btn_panel">
                        <Button className="choose_trx_btn feature_btn">Income Notifier</Button>
                      </div>
                    </div>
                  </GridItem>
                  <GridItem sm={6} md={6} lg={3}>
                    <div className="feature_panel">
                      <div className="feature_box">
                        <h2>Organization</h2>
                        <div className="feature_panel_inner">
                          <div className="feature_box_details">
                            <label>Invitation link</label>
                            <p>-</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Personal invited partners</label>
                            <p>0</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Total number of partners</label>
                            <p>0</p>
                          </div>
                          <div className="feature_box_details">
                            <label>Total community participants</label>
                            <p>0</p>
                          </div>
                        </div>
                      </div>
                      <div className="feature_btn_panel">
                        <Button className="choose_trx_btn feature_btn">Official Channel</Button>
                      </div>
                    </div>
                  </GridItem>
                </GridContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="section">
            <div className="d-flex align-items-center justify-content-between footer_inner">
              <div className="smart_contract_add">
                <label>Smart-contract-address:</label>
                <Link to="/" target="_blank">TUSAmtPo56k1CHYJ8hzisbWS5UqPNyrCou</Link>
              </div>
              <ul className="social_icons">
                <li><Link to="/" target="_blank"><i className="fab fa-telegram-plane"></i></Link></li>
                <li><Link to="/" target="_blank"><i className="fab fa-facebook-f"></i></Link></li>
                <li><Link to="/" target="_blank"><i className="fab fa-twitter"></i></Link></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
