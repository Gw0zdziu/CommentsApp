const commentsContainer = document.querySelector('.comments-container')
const addCommentContainer = document.querySelector('.add-new-comment')
const commentTemplate = document.querySelector('#new-comment-template').content
const commentReplyTemplate = document.querySelector('#new-comment-reply-template').content
const modalContainer = document.querySelector('.modal-container')

const comment = document.createDocumentFragment()

let dataComments = {}

onload = async () => {
	let localData = localStorage.getItem('comments')
	if (localData) {
		let data = JSON.parse(localData)
		dataComments.comments = data.comments
		dataComments.currentUser = data.currentUser
		createComments(dataComments.comments)
	} else {
		const response = await fetch('./data.json')
		const data = await response.json()
		localStorage.setItem('comments', JSON.stringify(data))
		location.reload()
	}
}

const createComments = (data) => {
	data.forEach((item) => {
		const {replies} = item
		if (item.user.username !== dataComments.currentUser.username) {
			getTemplateComment(commentTemplate, item, false,false)
			if (replies.length > 0){
				const {replies} = item;
				createReplies(replies)
			}
		} else {
			getTemplateComment(commentTemplate, item, true, false)
		}

	})
	commentsContainer.appendChild(comment)
}

const createReplies =  (replies) =>{
	 replies.forEach(reply => {
		if (reply.user.username !== dataComments.currentUser.username) {
			getTemplateComment(commentReplyTemplate, reply, false, true)
		} else {
			getTemplateComment(commentReplyTemplate, reply, true, true)
		}
	})
}

const getTemplateComment = (template, data, viewButtons, reply) => {
	template.querySelector('.new-comment').setAttribute('id', data.id)
	template.querySelector('.image').src = data.user.image.png
	template.querySelector('.user-name').textContent = data.user.username
	template.querySelector('.created-date').textContent = data.createdAt
	if (reply){
		template.querySelector('.sentence-comment').textContent = `@${data.replyingTo} ${data.content}`
	}else {
		template.querySelector('.sentence-comment').textContent = data.content
	}
	if (viewButtons) {
		template.querySelector('.button--reply').style.display = 'none'
		template.querySelector('.button--edit').style.display = 'flex'
		template.querySelector('.button--delete').style.display = 'flex'
	} else {
		template.querySelector('.button--reply').style.display = 'flex'
		template.querySelector('.button--edit').style.display = 'none'
		template.querySelector('.button--delete').style.display = 'none'
	}
	let cloneTemplate = template.cloneNode(true)
	comment.appendChild(cloneTemplate)
}



const addComment = () => {
	const newCommentContainer = document.querySelector('.add-new-comment')
	let textAreaElement = newCommentContainer.querySelector('.textarea')
	let contentTextArea = textAreaElement.value
	let idLastComment = dataComments.comments.at(-1).id
	if (contentTextArea) {
		let contextOwnComment = {
			id: idLastComment + 1,
			content: contentTextArea,
			createdAt: '1 month ago',
			score: 0,
			user: {
				image: {
					png: dataComments.currentUser.image.png,
					webp: dataComments.currentUser.image.webp,
				},
				username: dataComments.currentUser.username,
			},
		}
		dataComments.comments.push(contextOwnComment)
		localStorage.setItem('comments', JSON.stringify(dataComments))
		getTemplateComment(commentTemplate, contextOwnComment, true)
		commentsContainer.appendChild(comment)
		textAreaElement.value = ''
	} else {
		const snackbarInfo = document.querySelector('#snackbar-info')
		snackbarInfo.textContent = 'Add comment content'
		snackbarInfo.className = 'show'
		setTimeout(() => {
			snackbarInfo.className = snackbarInfo.className.replace('show', '')
		}, 3000)
	}
}

const deleteComment = (e) => {
	modalContainer.classList.add('display-modal')
	let elementToDelete = e.parentNode.parentNode
	let idCommentToDelete = elementToDelete.getAttribute('id')
	let deleteCommentButton = modalContainer.querySelector('.modal-confirm-button')
	deleteCommentButton.addEventListener('click', () => {
		elementToDelete.remove()
		dataComments.comments.splice(idCommentToDelete - 1)
		localStorage.setItem('comments', JSON.stringify(dataComments))
		modalContainer.classList.remove('display-modal')
	})
}
const cancelDeleteComment = () => {
	modalContainer.classList.remove('display-modal')
}

const editComment = (e) => {
	const parentEditButton = e.parentNode.parentNode
	const contentComment = parentEditButton.querySelector('.sentence-comment')
	const contentCommentText = contentComment.textContent
	const textareaEdit = parentEditButton.querySelector('.edit-textarea-comment')
	const updateButton = parentEditButton.querySelector('.button--update')
	textareaEdit.value = contentCommentText
	contentComment.classList.add('hide-element')
	textareaEdit.classList.remove('hide-element')
	updateButton.classList.remove('hide-element')
}

const updateComment = (e) => {
	const parentEditButton = e.parentNode
	const textareaEdit = parentEditButton.querySelector('.edit-textarea-comment')
	const updateButton = parentEditButton.querySelector('.button--update')
	const contentComment = parentEditButton.querySelector('.sentence-comment')
	const textareaValue = textareaEdit.value
	if (textareaValue) {
		contentComment.textContent = textareaValue
		contentComment.classList.remove('hide-element')
		textareaEdit.classList.add('hide-element')
		updateButton.classList.add('hide-element')
	} else {
		const snackbarInfo = document.querySelector('#snackbar-info')
		snackbarInfo.textContent = 'The edit field must not be empty'
		snackbarInfo.className = 'show'
		setTimeout(() => {
			snackbarInfo.className = snackbarInfo.className.replace('show', '')
		}, 3000)
	}
}

const replyComment = (e) =>{
	const parentReplyButton = e.parentNode.parentNode
	const idMainComment = parentReplyButton.getAttribute('id')
	const replyClone = addCommentContainer.cloneNode(true)
	replyClone.classList.add('reply')
	const replyButton = replyClone.querySelector('.button--send')
	const textArea = replyClone.querySelector('.textarea')
	const userReplied = parentReplyButton.querySelector('.user-name').textContent
	replyButton.textContent = 'Reply'
	replyButton.removeAttribute('onclick')
	parentReplyButton.after(replyClone)
	replyButton.addEventListener('click', ()=>{
		const text = textArea.value
		let idLastComment = dataComments.comments.at(-1).id
		let contextOwnComment = {
			id: idLastComment + 1,
			content: text,
			createdAt: '1 month ago',
			score: 0,
			replyingTo: userReplied,
			user: {
				image: {
					png: dataComments.currentUser.image.png,
					webp: dataComments.currentUser.image.webp,
				},
				username: dataComments.currentUser.username,
			},
		}
		dataComments.comments[idMainComment-1].replies.push(contextOwnComment)
		localStorage.setItem('comments', JSON.stringify(dataComments))
		getTemplateComment(commentReplyTemplate, contextOwnComment,true,true)
		parentReplyButton.after(comment)
		replyClone.classList.add('hide-element')
	})
}


