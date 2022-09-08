const containerComments = document.querySelector('.container-comments')
let newCommentTemplate = document.querySelector('.new-comment')
const replyButton = document.querySelector('.button--reply')
const editButton = document.querySelector('.button--edit')
const deleteButton = document.querySelector('.button--delete')
const sendButton = document.querySelector('.button--send')
let textareaAddComment = document.querySelector('.textarea')

let fragment = document.createDocumentFragment

let dataComments = {}

onload = async () => {
	let localData = localStorage.getItem('comments')
	if (localData) {
		const data = JSON.parse(localData)
		dataComments.comments = data.comments
		dataComments.currentUser = data.currentUser
		currentUser = dataComments.currentUser
		displayComments(dataComments.comments)
	} else {
		const response = await fetch('./data.json')
		const data = await response.json()
		localStorage.setItem('comments', JSON.stringify(data))
		location.reload
	}
}

const displayButtons = (buttonView) => {
	if (buttonView) {
		replyButton.classList.add('display-button')
	} else {
		editButton.classList.add('display-button')
		deleteButton.classList.add('display-button')
	}
}

const displayComments = (comments) => {
	comments.map((comment) => {
		if (comment.user.username === dataComments.currentUser.username) {
			displayButtons(false)
			templateComment(newCommentTemplate, comment)
		} else {
			displayButtons(false)
			templateComment(newCommentTemplate, comment)
		}
	})
	containerComments.appendChild(newCommentTemplate)
}

const templateComment = (template, data) => {
	const {
		id,
		content,
		createdAt,
		score,
		user: {
			image: { png },
			username,
		},
	} = data
	template.setAttribute('id', id)
	template.querySelector('.sentence-comment').textContent = content
	template.querySelector('.created-date').innerHTML = createdAt
	template.querySelector('.score').textContent = score
	template.querySelector('.image').src = png
	template.querySelector('.user-name').textContent = username
	newCommentTemplate = template.cloneNode(true)
}

sendButton.addEventListener('click', () => {
	let idLastComment = containerComments.lastElementChild.getAttribute('id')
	console.log(idLastComment)
	const dataTemplateComment = {
		id: ++idLastComment,
		content: textareaAddComment.value,
		createdAt: 'Now',
		score: 0,
		user: {
			image: {
				png: dataComments.currentUser.image.png,
				webp: dataComments.currentUser.image.webp,
			},
			username: dataComments.currentUser.username,
		},
	}
	const clone = newCommentTemplate.cloneNode(true)
	templateComment(clone, dataTemplateComment)
	containerComments.appendChild(clone)
})
