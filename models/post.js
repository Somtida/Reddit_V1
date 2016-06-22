'use strict';

const db = require('../config/db')
const moment = require('moment');
const uuid = require('uuid');

db.run(`create table if not exists posts(
  id TEXT,
  createdAt TEXT,
  text TEXT,
  score INT
)`);

exports.getAll = () => {
  return new Promise((resolve, reject)=>{
    db.all('select * from posts', function(err, posts){
      if(err){
        reject(err);
      }else{
        resolve(posts);
      }
    });
  });
}

exports.create = postObj => {
  return new Promise((resolve, reject)=>{
    db.run('insert into posts values (?, ?, ?, ?)',
      uuid(),
      moment().toISOString(),
      postObj.text,
      0,
      function(err){
        if(err) return reject(err);
        db.get('select * from posts order by createdAt desc limit 1', function(err, post){
          if(err) return reject(err);
          resolve(post);
        });

      }
    );
  });
}

exports.delete = post => {
  console.log("idd: ",post.id);
  return new Promise((resolve, reject)=>{
    db.run(`delete from posts where id = "${post.id}"`,function(err,post){
      if(err) return console.log("err: ",err);
    });
  })
}

exports.upVote = id =>{
  console.log("id: ",id);
  return new Promise((resolve, reject)=>{
    db.run(`update posts set score = score + 1  where id = "${id}"`,function(err,result){
      if(err) return reject(err);
      resolve();
    });
  })
}

exports.downVote = id =>{
  console.log("id: ",id);
  return new Promise((resolve, reject)=>{
    db.run(`update posts set score = score - 1 where id = "${id}"`,function(err,result){
      if(err) return reject(err);
      resolve();
    });
  })
}
