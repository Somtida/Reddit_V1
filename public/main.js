'use strict';

$(document).ready(init);

function init(){
  getAllPosts();
  $('.newPostForm').submit(createPost);
  $('.postBoxes').on('click','.deleteText', deleteText);
  $('.postBoxes').on('click','.upVote', upVote);
  $('.postBoxes').on('click','.downVote', downVote);
}

function downVote(){
  let data = $(this).closest('.postInfo').data();

  let idd = data.id;
  let sscore = data.score;

  $.ajax({
    method:'PUT',
    url: `/posts/${idd}/downVote`,
    success: post => {
      console.log("downVote");
      // getAllPosts();
      console.log("sscore: ",sscore);
      $(this).closest('.postInfo').data('score',parseInt(sscore)-1);
      console.log("score: ", sscore-1);
      $(this).closest('.postInfo').find('.voteScore').text(parseInt(sscore)-1);
    },
    error: err =>{
      console.log("err: ",err);
    }

  })
}

function upVote(){
  let data = $(this).closest('.postInfo').data();
  let idd = data.id;
  let sscore = data.score;
  $.ajax({
    method:'PUT',
    url: `/posts/${idd}/upVote`,
    success: post => {
      console.log("upVoted");
      console.log("sscore: ",sscore);
      // getAllPosts();
      $(this).closest('.postInfo').data('score',parseInt(sscore)+1);
      console.log("score: ", sscore+1);
      $(this).closest('.postInfo').find('.voteScore').text(parseInt(sscore)+1);
    },
    error: err =>{
      console.log("err: ",err);
    }

  })
}

function deleteText(){
  let idd = $(this).closest('.postInfo').data('id');
  console.log("idd: ",idd);

  $.ajax({
    method:'DELETE',
    url: '/posts',
    data: {
      id: idd
    },
    success: function(post){
      console.log("upVoted");
      // getAllPosts();
      $(this).closest('.postInfo').remove();
    }
  })

}

function getAllPosts(){
  $.get('/posts')
  .done(posts => {
    console.log("posts: ",posts);

    let $divs = buildAllPosts(posts);
    $('.postBoxes').empty().append($divs);
  })
  .fail(err => {
    console.log('err')
  })
}

function buildAllPosts(posts){
  let $divs = posts.map(post=>{
    let $div = $('.postTamplate').clone();
    $div.removeClass('postTamplate');
    $div.addClass('postInfo').addClass('panel').addClass('panel-primary');
    $div.data('id',post.id);
    $div.find('.postId').text(post.id);
    let calendar = moment(post.createdAt).calendar();
    $div.find('.postAt').text(calendar);
    $div.data('score',post.score);
    $div.find('.voteScore').text(post.score);
    $div.find('.textContent').text(post.text)
    return $div;
  });
  return $divs;
}

function createPost(event){
  event.preventDefault();
  let text = $('.text').val();

  $.post('/posts',{text:text})
    .done(post => {
      console.log("post: ",post);
      let $post = postElement(post);
      $('.postBoxes').append($post);
    })
    .fail(err=>{
      console.log('err')
    })

}

function postElement(post){
  console.log("post: ",post);
  let $div = $('.postTamplate').clone();
  $div.removeClass('postTamplate');
  $div.addClass('postInfo').addClass('panel').addClass('panel-primary');
  $div.data('id',post.id);
  $div.find('.postId').text(post.id);
  $div.find('.postAt').text(post.createdAt);
  $div.data('score',post.score);
  $div.find('.voteScore').text(post.score);
  $div.find('.textContent').text(post.text)
  return $div;



}
