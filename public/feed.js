const form = document.querySelector('#createPost');
const ul = document.querySelector('#feed');
form.addEventListener('submit', createPost);
ul.addEventListener('click', showCommentBox);
ul.addEventListener('submit', commentPost);
ul.addEventListener('click',bookmarkThis)
document.querySelector('#searchButton').addEventListener('click',searchDrug)



function createPost(e) {
    e.preventDefault();

    const newForm = new FormData();
    const image = form.querySelector('.picture').files[0];
    const caption = form.querySelector('.caption').value;
    const drug = form.querySelector('.drug').value;
    const feedback = form.querySelector('.feedback').value;
    const timestamp = new Date(Date.now());
    
    const data = {
        'file-to-upload': image,
        caption: caption,
        drug: drug,
        feedback:feedback,
        timestamp: timestamp
    }

    for(property in data)
        newForm.set(property, data[property]);

    fetch('createPost', {
        method: 'post',
        body: newForm
    }).then(() => { window.location.reload() })
}

function showCommentBox(e) {
    if (e.target.className === 'commentBox') {
        e.target.classList.add('hide');
        const li = e.target.closest('.post');
        const commentForm = li.querySelector('.comment');
        commentForm.classList.remove('hide');
    }
    else if (e.target.className === 'cancel') {
        const li = e.target.closest('.post');
        const commentForm = li.querySelector('.comment');
        const commentButton = li.querySelector('.commentBox');
        commentButton.classList.remove('hide');
        commentForm.classList.add('hide');
    }
}

function commentPost(e) {
    e.preventDefault();
    if (e.target.classList.contains('comment')) {
        const comment = e.target.querySelector('.text').value;
        const postId = e.target.closest('.post').querySelector('a');
        fetch('createComment', {
            method: 'post',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                comment: comment,
                postId: postId.getAttribute('href').slice(9),
                timestamp: new Date(Date.now())
            })
        }).then(() => {window.location.reload() });
    }
}

function bookmarkThis(e){
    console.log(e.target)
    if (e.target.classList.contains("fa-save")){
        fetch('bookmark',{
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                postId: e.target.closest('.post').querySelector('a').getAttribute('href').slice(9)
            })
        }).then(() => {window.location.reload() })
    }
}

function searchDrug(){
    const drugName = document.querySelector('#searchQuery').value
    fetch(`search?drug=${drugName}`)
    .then(() => {window.location.href = `/search?drug=${drugName}` })
}

// const list = document.querySelector('#myPosts');
// list.addEventListener('click', deletePost);

// function deletePost(e) {
//   if (e.target.classList.contains('fa-trash')) {
//     const listItem= this.closest('.post')
//     const caption=listItem.querySelector('.caption').innerText
//     const drug=listItem.querySelector('.drug').innerText
//     const feedback=listItem.querySelector('.feedback').innerText
//     const img=listItem.querySelector('a').getAttribute('href')
//     fetch('delPost', {
//       method: 'delete',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         'caption': caption,
//         'drug': drug,
//         'feedback': feedback,
//         'image': img
//       })
//     }).then(() => {
//       window.location.reload()
//     })
//   }
// }