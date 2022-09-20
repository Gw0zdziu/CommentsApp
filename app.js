const commentsContainer = document.querySelector('.comments-container')
const addCommentContainer = document.querySelector('.add-new-comment-container')
const commentTemplate = document.querySelector('#new-comment-template').content
const commentReplyTemplate = document.querySelector('#new-comment-reply-template').content
const buttonSend = document.querySelector('.button--send')
const modalContainer = document.querySelector('.modal-container')

const comment = document.createDocumentFragment()

let dataComments = {}

onload = async () => {
	let localData = localStorage.getItem('comments')
	let currentUser;
	if (localData) {
		let data = JSON.parse(localData)
		dataComments.comments = data.comments
		dataComments.currentUser = data.currentUser
		currentUser = dataComments.currentUser
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

		if (item.user.username !== dataComments.currentUser.username) {
			getTemplateComment(commentTemplate, item, false,false)
		} else {
			getTemplateComment(commentTemplate, item, true, false)
		}
		if (item.replies.length > 0){
			createReplies(item.replies)
		}
	})
	commentsContainer.appendChild(comment)
}

const createReplies = (replies) =>{
	const commentContainer = commentTemplate.querySelector('.comment-container')
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
	template.querySelector('.score').textContent = data.score
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

