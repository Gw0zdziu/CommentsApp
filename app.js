const containerComments = document.querySelector('.container-comments')
const newCommentTemplate = document.querySelector('.new-comment')
const replyButton = document.querySelector('.button--reply')
const editButton = document.querySelector('.button--edit')
const deleteButton = document.querySelector('.button--delete')

const fragment = document.createDocumentFragment()
let dataComments = {}

const loadData = async ()=>{
    let localData = localStorage.getItem('comments')
    if(localData){
        const data = JSON.parse(localData)  
        dataComments.comments = data.comments
        dataComments.currentUser = data.currentUser
        currentUser = dataComments.currentUser;    
        displayComments(dataComments.comments)
    } else{
        const response = await fetch('./data.json')
        const data = await response.json()
        localStorage.setItem('comments', JSON.stringify(data))
        location.reload
    }
}

const displayButtons = (buttonView)=>{
    if(buttonView){
        editButton.classList.toggle('display-button')
        deleteButton.classList.toggle('display-button')
    }else{
        replyButton.classList.toggle('display-button')
    }
}

const displayComments =  (comments)=>{
    console.log(comments);
    comments.map(comment => {
        if(comment.user.username === dataComments.currentUser.username){
             
            templateComment(newCommentTemplate, comment, comment.id)
        }else{
            displayButtons(false)
            templateComment(newCommentTemplate, comment, comment.id)
        }
    })
    containerComments.appendChild(fragment)
}


const templateComment = (template, data, id)=>{
        template.querySelector('.sentence-comment').textContent = data.content
        template.querySelector('.created-date').innerHTML = data.createdAt
        template.querySelector('.score').textContent = data.score
        template.querySelector('.image').src = data.user.image.png
        template.querySelector('.user-name').textContent = data.user.username
        template.querySelector('.image').textContent = data.user.image.png
        let clone = template.cloneNode(true)
        fragment.appendChild(clone)
}

loadData()

































