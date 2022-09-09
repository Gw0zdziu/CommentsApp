const container = document.querySelector('.container')

let dataComments = {}

onload = async () => {
	let localData = localStorage.getItem('comments')
	if (localData) {
		const data = JSON.parse(localData)
		dataComments.comments = data.comments
		dataComments.currentUser = data.currentUser
		currentUser = dataComments.currentUser
	} else {
		const response = await fetch('./data.json')
		const data = await response.json()
		localStorage.setItem('comments', JSON.stringify(data))
		location.reload
	}
}
