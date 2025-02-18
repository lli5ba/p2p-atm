/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    SOME_CONSTANTS : false,  // some constant


    // Application Constructor
    initialize: function() {
        var nessieID = "a7016d961a352b414ab92a55a07c44cf";
        var appID = 'gzpxlYNEqosH2z2A8s7Dyk1mw7GPzkxpcVdY663F';
        var jsID = 'jPgyT1EMzPabkbcAdbcgrI9rPCeIvFpzRJ9yDZuF';
        var customerIDs = ["55e94a6af8d8770528e60e31", "55e94a6af8d8770528e60e32", "55e94a6af8d8770528e60e33"];
        var accountIDs = ["55e94a6bf8d8770528e61559", "55e94a6bf8d8770528e6155c", "55e94a6bf8d8770528e61561"];
        Parse.initialize(appID, jsID);
        console.log("console log init");
        this.bindEvents();
        this.initFastClick();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    initFastClick : function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        }, false);
    },
    // Phonegap is now ready...

    onDeviceReady: function() {
        console.log("device ready, start making you custom calls!");
        //alert("test");
        initApp();
        var AtmUser = Parse.Object.extend("AtmUser");
        var hcTransaction = Parse.Object.extend("hcTransaction");
        var ncTransaction = Parse.Object.extend("ncTransaction");
        document.getElementById("login").addEventListener("click", initApp, false);
        document.getElementById("submitinfo").addEventListener("click", bankFormSubmit, false);
        document.getElementById("HaveCash").addEventListener("click", haveCash, false);
        document.getElementById("havecashsubmitbutton").addEventListener("click", haveCashSubmit, false);
        document.getElementById("NeedCash").addEventListener("click", needCashCreate, false);
        document.getElementById("ncAmountAccept").addEventListener("click", ncAmountAccept, false);

        var fbInfo;
        var username;
        var fbLoginSuccess = function (userData) {
            fbInfo = userData;
            checkUserBank();
            //document.getElementById('lblFB').innerHTML = fbInfo;
        }

        function initApp() {

            facebookConnectPlugin.getLoginStatus(function (response) {

                if (response.status !== 'connected') {
                    facebookConnectPlugin.login(["public_profile"],
                        fbLoginSuccess,
                        function (response) {
                            alert(JSON.stringify(response))
                        });
                } else {
                    fbInfo = response;
                    checkUserBank();
                }

            }, function (response) {
                alert(JSON.stringify(response))
            });
            //document.getElementById('lblFB').innerHTML = fbInfo;
        }

        function checkUserBank() {
            localStorage.setItem("userID", fbInfo.authResponse.userID);
            localStorage.setItem("name", fbInfo.name);
            setInterval(pollServer, 5000);
            var userQuery = new Parse.Query(AtmUser);
            userQuery.equalTo("userID", fbInfo.authResponse.userID);
            userQuery.find({
                success: function (results) {
                    if (results.length > 0) {
                        username = results[0].get("username");
                        document.getElementById("welcomeheader").innerHTML = "Welcome " + username + "!";
                        $.mobile.changePage('#havecash-needcash', 'slide');

                    } else {
                        $.mobile.changePage('#add-bank-account', 'slide');
                    }
                },
                error: function (error) {
                    alert(error.message);
                }

            });
        }
        function getCustomers(){
            //returns list of customer dictionaries
            $.ajax({
                url: 'api.reimaginebanking.com/atms?key=your_key',
                success: function(results){
                    //do something
                }
            });
        }
        function processTransaction(nc,hc)
        {

        }

        function bankFormSubmit() {
            createUser(document.getElementById("account-number").value, document.getElementById("routing-number").value, document.getElementById("usern").value);
        }

        function createUser(account, routing, username) {
            alert(account + "," + routing);
            var user = new AtmUser();
            user.set('userID', fbInfo.authResponse.userID);
            user.set('account', account);
            user.set('routing', routing);
            user.set('username', usern);
            username = usern;
            document.getElementById("welcomeheader").innerHTML = "Welcome " + username + "!";

            user.save(null, {
                success: function(user){
                },
                error: function (user, error) {
                    alert(error.message);
                }
            });
        }

        function haveCash() {
            $.mobile.changePage('#have_cash', 'slide');
        }


        function haveCashSubmit() {
            var hc = createHcTransaction(document.getElementById("bill_1").value,
                document.getElementById("bill_5").value, document.getElementById("bill_10").value,
                document.getElementById("bill_20").value, document.getElementById("bill_50").value);
            $.mobile.changePage('#havecashview', 'slide');
            getNcTranscationList(hc);


                //http://graph.facebook.com/67563683055/picture?type=square


        }

        function updateMatchList(matches,usertag,idtag){
            var id = "matchlist"+idtag;
            document.getElementById(id).innerHTML='';

            for (var i = 0; i < matches.length; i++) 
            {
                var usern = matches[i].get(usertag);
                var userID = matches[i].get(idtag);
                if(userID !== fbInfo.authResponse.userID)
                {


                if(document.getElementById(id).innerHTML.indexOf(userID) < 0)
                {
                var listelement = "<li class='mlistelement' data-theme='b' data-role='button' id='" + userID + "'><div id='amnt' class='ui-grid-b'><div class ='ui-block-a'><a id='inner:" + userID + "' data-theme='f' data-role='content' class='uname'>" + usern + 
                "</a></div><a data-theme='f' data-role='content'>$"+matches[i].get("amount") + "</a><div class='ui-block-b'></div><div class='ui-block-c'><img src='http://graph.facebook.com/" + userID + "/picture?type=square'/></div></li>";
                //"<img src='http://graph.facebook.com/" + userID + "/picture?type=square'/>
                $(listelement).appendTo("#"+id);
                }
                }

            }
         $("li").click(function(){
            var mid = this.id;
            var hcQuery = new Parse.Query(hcTransaction);
            hcQuery.equalTo("hcID",mid);
            hcQuery.find({
                success: function (results) {
                    if(results.length > 0)
                    {
                        results[0].set("ncID",mid);
                        results[0].set("ncUser",username);
                        results[0].save(null,{success: function(user){},error: function(user,error){alert("Error")}});
                    }else{
                        var ncQuery = new Parse.Query(ncTransaction);
                        ncQuery.equalTo("hcID",mid);
                        ncQuery.find({
                            success: function(results){
                                if(results.length > 0)
                                {
                                    results[0].set("hcID",mid);
                                    results[0].set("hcUser",username);
                                    results[0].save(null,{});
                                }
                            }
                        });
                    }
                }
            });
            });
        }

        function createHcTransaction(bill_1, bill_5, bill_10, bill_20, bill_50) {
            var hc = new hcTransaction();
            hc.set('hcID', fbInfo.authResponse.userID);
            hc.set('ncID', null);
            hc.set('hcUser', username);
            hc.set('ncUser', null);
            hc.set('bill_1', bill_1);
            hc.set('bill_5', bill_5);
            hc.set('bill_10', bill_10);
            hc.set('bill_20', bill_20);
            hc.set('bill_50', bill_50);
            hc.set('amount',bill_1+5*bill_5+10*bill_10+20*bill_20+50*bill_50);
            var hcQuery = new Parse.Query(hcTransaction);
            hcQuery.equalTo("hcID", fbInfo.authResponse.userID);
            var hcBool = true;
            hcQuery.find({
                success: function (results) {

                    for (var x = 0; x < results.length; x++) {
                        if (results[x].get("bill_1") === bill_1 && results[x].get("bill_5") === bill_5 && results[x].get("bill_10") === bill_10 && results[x].get("bill_20") === bill_20 && results[x].get("bill_50") === bill_50) {
                            hcBool = false;
                        } else {
                            results[x].destroy({
                                success: function (obj) {
                                },
                                error: function (obj, error) {
                                    alert(error.message)
                                }
                            });
                        }
                    }
                    if(hcBool)
                    {
                    hc.save(null, {
                            success: function(user){
                            },
                            error: function(user, error){
                                alert(error.message);
                            }
                        });
                    }
                    var ncQuery = new Parse.Query(ncTransaction);
                    ncQuery.equalTo("ncID",fbInfo.authResponse.userID);
                    ncQuery.find({
                        success: function(results){
                            for(var i = 0; i < results.length; i++)
                           {
                             results[i].destroy({success: function(obj){},error: function(obj,error){alert(error.message)}});
                            }
                        },error: function(error){alert(error.message)}
                    });

                },
                error: function (error) {
                    alert(error.message);
                }

            });
            return hc;
        }

        function getHcTransactionList(nc_transaction)
        {
            var hcTransactions = new Parse.Query(hcTransaction);

            hcTransactions.find({
                success: function(results)
                {
                    var matchesFound = [];
                    for(var i = 0; i < results.length; i++){
                        var compatible = checkCompatibility(nc_transaction.get("amount"),results[i].get("bill_1"), results[i].get("bill_5"), results[i].get("bill_10"), results[i].get("bill_20"), results[i].get("bill_50"));
                        if (compatible){
                            matchesFound.push(results[i]);
                        }
                    }
                    updateMatchList(matchesFound,"hcUser","hcID");
                }
            });
        }


        function getNcTranscationList(hc_transaction) {
            var bill_1 = hc_transaction.get("bill_1");
            var bill_5 = hc_transaction.get("bill_5");
            var bill_10 = hc_transaction.get("bill_10");
            var bill_20 = hc_transaction.get("bill_20");
            var bill_50 = hc_transaction.get("bill_50");
            var ncTransactions = new Parse.Query(ncTransaction);

            ncTransactions.find({
                success: function(results) {
                    // results is an array of Parse.Object.
                    var matchesFound = [];
                    for(var i = 0; i < results.length; i++){
                        var amount = results[i].get("amount");
                        var compatible = checkCompatibility(amount,bill_1, bill_5, bill_10, bill_20, bill_50);
                        if (compatible){
                            matchesFound.push(results[i]);
                        }
                    }
                    updateMatchList(matchesFound,"ncUser","ncID");
                },

                error: function(error) {
                    // error is an instance of Parse.Error.
                }
            });
        }

        function checkCompatibility(amount,bill_1, bill_5, bill_10, bill_20, bill_50){
            var compatible = false;
            var stack = [];
            var initAmount = amount;
            for(var i = 0; i < bill_50; i++) {
                stack.push(50);
            }
            for(var i = 0; i < bill_20; i++) {
                stack.push(20);
            }
            for(var i = 0; i < bill_10; i++) {
                stack.push(10);
            }
            for(var i = 0; i < bill_5; i++) {
                stack.push(5);
            }
            for(var i = 0; i < bill_1; i++) {
                stack.push(1);
            }

            while(stack.length > 0) {
                var top = stack.pop();
                if(top <= amount){
                    amount = amount - top;
                }
            }
            if (amount <= 10){
                compatible = true;
            }
            return compatible;
        }

        function needCashCreate() {
            $.mobile.changePage('#needcashamount', 'slide');
        }

        function createncTransaction(amount)
        {
            var transaction = new ncTransaction();
            var amount = document.getElementById("ncslider").value;
            transaction.set("amount", amount);
            transaction.set("ncID", fbInfo.authResponse.userID);
            transaction.set("ncUser", username);
            transaction.set("hcID",null);
            transaction.set("hcUser",null);
            var transactionQuery = new Parse.Query(ncTransaction);
            transactionQuery.equalTo("ncID", fbInfo.authResponse.userID);
            var needNewTransaction = true;

            transactionQuery.find({
                success: function (results) {

                    for (var x = 0; x < results.length; x++) {
                        if (results[x].get("amount") === amount) {
                            needNewTransaction = false;
                        } else {
                            results[x].destroy({
                                success: function (obj) {
                                },
                                error: function (obj, error) {
                                    alert(error.message)
                                }
                            });
                        }
                    }
                    if(needNewTransaction)
                    {
                    transaction.save(null, {
                            success: function(user){
                                
                            },
                            error: function(user, error){
                                alert(error.message);
                            }
                        });
                    }

                    var zhcQuery = new Parse.Query(hcTransaction);
                    zhcQuery.equalTo("hcID",fbInfo.authResponse.userID);
                    zhcQuery.find({
                        success: function(results){
                            for(var i = 0; i < results.length; i++)
                            {
                               results[i].destroy({success: function(obj){},error: function(obj,error){alert("error.message")}});
                            }
                         },error: function(error){alert(error.message)}
                    });

                },
                error: function (error) {
                    alert(error.message);
                }

            });
            return transaction;
        }

        function ncAmountAccept() {

            var trans = createncTransaction();
            $.mobile.changePage('#needcashview', 'slide');
            getHcTransactionList(trans);

        }
        var processingTrans;
        function pollServer()
        {
            var hcQuery = new Parse.Query(hcTransaction);
            hcQuery.equalTo("ncID",fbInfo.authResponse.userID);
            hcQuery.find({
                success: function(results)
                {
                    if(results.length > 0)
                    {
                        processingTrans = results[0];
                        alert("Transaction found!");
                    }
                }
            });
            var ncQuery = new Parse.Query(ncTransaction);
            ncQuery.equalTo("hcID",fbInfo.authResponse.userID);
            ncQuery.find({
                success: function(results)
                {
                    if(results.length > 0)
                    {
                        processingTrans = results[0];
                        alert("Transaction found!");
                    }
                }
            });
        }
    }

};