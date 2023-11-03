App = {
  contracts: {},
  loading: false,

  load: async () => {
    await App.loadWeb3();
    await App.loadAccounts();
    await App.loadContract();
    await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        console.log("Loaded....")
        try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */});
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    });
  },

  loadAccounts: async () => {
    // connect to all the accounts, we want index 0 since, its the first account
    // the account we are connected to
    App.account = await ethereum.request({ method: 'eth_accounts' });
    console.log(App.account);
  },

  loadContract: async () => {
    // create a JS version of the contracts
    const twitter = await $.getJSON('Twitter.json')
    App.contracts.Twitter = TruffleContract(twitter)
    App.contracts.Twitter.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    // console.log(twitter);

    // Hydrate the smart contract with values from the blockchain
    App.twitter = await App.contracts.Twitter.deployed()
  },

  render: async () => {
    if (App.loading) {
      return;
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },


  renderTasks: async () => {
    // load all the tasks from the blockchain
    const tweetCount = await App.twitter.tweetCount();
    console.log(tweetCount);
    const $tackTemplate = $(".taskTemplate");

    // render each of the tasks
    for (var i = tweetCount; i >=1; i--){
      const task = await App.twitter.tasks(i);
      const task_id = task[0].toNumber();
      const task_content1 = task[1];
      // console.log(task_content);
      const timestamp=task_content1.slice(0,25);
      const accaddr=task_content1.slice(24,66)
      const task_content=task_content1.slice(66,);
      console.log(timestamp);
      console.log(accaddr);
      // console.log(App.account[0]);
      
  
      const $newTaskTemplate = $tackTemplate.clone()
      // console.log($newTaskTemplate);
      $newTaskTemplate.find('.tcontent').html(task_content)
      $newTaskTemplate.find('.tweetername').html(accaddr)
      $newTaskTemplate.find('.tweettime').html(timestamp)      

      // Put the task in the correct list
    
      $('#taskList').append($newTaskTemplate)
      

      $newTaskTemplate.show()
    }

  },


  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $('#loader');
    const content = $('#content');
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },


  createTweet: async () => {
    App.setLoading(true);
    const content1 = $('#newTask').val();
    const timestamp=new Date().toISOString();
    const accaddr=App.account[0]; 
    const content=timestamp+accaddr+content1;
    await App.twitter.createTweet(content, { from: App.account[0] });
    window.location.reload();
  },


  // toggleCompleted: async (e) => {
  //   App.setLoading(true)
  //   const taskId = e.target.name
  //   await App.twitter.toggleCompleted(taskId, { from: App.account[0] });
  //   window.location.reload()
  // },



}

$(() => {
  $(window).load(() => {
    App.load();
  })
})