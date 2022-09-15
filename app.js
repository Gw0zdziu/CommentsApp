const container = document.querySelector('.comments')
const commentTemplate = document.querySelector('#new-comment-template').content
const commentReplyTemplate = document.querySelector('#new-comment-reply-template').content
const buttonSend = document.querySelector('.button--send')
const modalContainer = document.querySelector('.modal-container')

const comment = document.createDocumentFragment()

let dataComments = {}

onload = async () => {
	let localData = localStorage.getItem('comments')
	if (localData) {
		const data = JSON.parse(localData)
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
			getTemplateComment(commentTemplate, item, false)
		} else {
			getTemplateComment(commentTemplate, item, true)
		}
	})
	container.appendChild(comment)
}

const getTemplateComment = (template, data, viewButtons) => {
	template.querySelector('.new-comment').setAttribute('id', data.id)
	template.querySelector('.score').textContent = data.score
	template.querySelector('.image').src = data.user.image.png
	template.querySelector('.user-name').textContent = data.user.username
	template.querySelector('.created-date').textContent = data.createdAt
	template.querySelector('.sentence-comment').textContent = data.content
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

const addCommment = () => {
	let textAreaElement = document.querySelector('.textarea')
	let contentTextArea = textAreaElement.value
	if (contentTextArea) {
		let contextOwnComment = {
			id: 1,
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
		getTemplateComment(commentTemplate, contextOwnComment, true)
		container.appendChild(comment)
		textAreaElement.value = ''
	} else {
		textAreaElement.setAttribute('placeholder', 'Insert content comment')
	}
}

const deleteComment = (event) => {
	modalContainer.classList.add('display-modal')
	let deleteCommentButtton = modalContainer.querySelector('.modal-confirm-button')
	deleteCommentButtton.addEventListener('click', () => {
		event.parentNode.parentNode.remove()
		modalContainer.classList.remove('display-modal')
	})
}
const cancelDeleteComment = () => {
	modalContainer.classList.remove('display-modal')
}
