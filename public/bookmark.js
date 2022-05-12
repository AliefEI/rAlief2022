const ul = document.querySelector('#myBookmark')
//ul.addEventListener('click', showCommentBox);
//const saver= document.querySelector('.fa-save')
ul.addEventListener('click', toSave)
// ul.addEventListener('click', deletePost)
ul.addEventListener('click', updateBookmark)

function toSave(e){
    e.preventDefault();
    if(e.target.className==='fa-save'){ 
      const image = form.querySelector('.picture').files[0]
      const caption = form.querySelector('.caption').value
      const drug = form.querySelector('.drug').value;
      const feedback = form.querySelector('.feedback').value;
    if (e.target.classList.contains('comment')) {
        fetch('createComment', {
            method: 'post',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                comment: comment,
            })
        }).then(() => {window.location.reload() });
    }}
}

// function deletePost(e) {
//   if (e.target.classList.contains('fa-trash')) {
//     var postId = e.target.closest('.post').querySelector('a').getAttribute('href').slice(9);
//     fetch('delPost', {
//       method: 'delete',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         id: postId
//       })
//     }).then(() => {
//       window.location.reload()
//     })
//   }
// }

function updateBookmark(e){
  if (e.target.classList.contains('fa-trash')) {
    var postId = e.target.closest('.post').querySelector('a').getAttribute('href').slice(9);
    fetch('updateSaved', {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: postId
      })
    }).then(() => {
      window.location.reload()
    })
  }
}
