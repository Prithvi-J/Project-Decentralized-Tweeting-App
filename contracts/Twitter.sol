// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Twitter {
  uint public tweetCount = 0;

  struct Tweet {
    uint id;
    string content;
  }

  constructor() public{
    // createTweet('Example Tweet Intialized');
  }

  mapping(uint => Tweet) public tasks;

  event TaskCreated(
    uint id,
    string content 
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  function createTweet(string memory _content) public {
    tweetCount++;
    tasks[tweetCount] = Tweet(tweetCount, _content);
    emit TaskCreated(tweetCount, _content);
  }

  // function toggleCompleted(uint _id) public {
  //   Tweet memory _task = tasks[_id];
  //   _task.completed = !_task.completed;
  //   tasks[_id] = _task;
  //   emit TaskCompleted(_id, _task.completed);
  // }
}