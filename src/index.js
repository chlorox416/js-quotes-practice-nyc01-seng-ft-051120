const quoteList = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')


function renderAllQuotes(quoteArray) {
    quoteArray.forEach(quote => {
        renderQuote(quote, quote.likes.length)
    })
}

function renderQuote(quoteObj,likes) {
    const author = quoteObj.author
    const quote = quoteObj.quote
    const li = createLi(quoteObj.id)
    // let likes 
    // if (quoteObj.likes) {
    //     likes = quoteObj.likes.length
    // } else {
    //     likes = 0
    // }
    // let like = quoteObj.likes ? quoteObj.likes.length : 0
    li.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">
                ${quote}
            </p>
            <footer class="blockquote-footer">
                ${author}
            </footer>
                <br>
            <button class='btn-success'>Likes: <span>${likes}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
                `

    // const p = document.createElement('p')
    // p.className = 'mb-0'
    // p.textContent = quote

    // const footer = document.createElement('footer')
    // footer.className = 'blockquote-footer'
    // footer.textContent = author

    // const blockquote = document.createElement('blockquote')
    // blockquote.className = 'blockquote'

    // const br = document.createElement('br')

    // const likeButton = document.createElement('button')
    // likeButton.className = "btn-success"
    // likeButton.innerHTML = `Likes: <span>${likes}</span>`

    // const deleteButton = document.createElement('button') 
    // deleteButton.className = 'btn-danger'
    // deleteButton.textContent = 'Delete'

    // blockquote.append(p, footer, br, likeButton, deleteButton)
    // li.append(blockquote)
    quoteList.append(li)
}

const createLi = id => {
    let li = document.createElement('li')
    li.className = 'quote-card'
    li.dataset.id = id
    return li
}

function initialize() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(quoteArray => {
        console.log(quoteArray)
        renderAllQuotes(quoteArray)
    })
}

//

const submitHandler = () => {
    quoteForm.addEventListener('submit', e => {
        e.preventDefault()
        // console.log(e.target)
        // const inputQuote = document.querySelector('#new-quote')
        // const newQuote = inputQuote.value
        // const inputAuthor = document.querySelector('#author')
        // const newAuthor = inputAuthor.value
        // console.log(newQuote, newAuthor)
        const quote = e.target.quote.value
        const author = e.target.author.value
        console.log(quote, author)
        postNewAuthor(quote,author)
        e.target.reset()
    })

}


const postNewAuthor = (quote, author) => {
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quote: quote,
            author: author,
            created_at: Date.now()
        })
    })
    .then(resp => resp.json())
    .then(obj => {
        renderQuote(obj, 0)
    })
}

const clickHandler = () => {
    document.addEventListener('click', e => {
        if (e.target.matches('.btn-danger')) {
            const dBtn = e.target
            const quoteCard = dBtn.closest('li')
            deleteQuote(quoteCard)
        } else if (e.target.matches('.btn-success')) {
            // const li = e.target.closest('li')
            // const quoteId = parseInt(li.dataset.id)
            addLike(e)
        }
    })
}


const addLike = event => {
    const li = event.target.closest('li')
    const quoteId = parseInt(li.dataset.id)
    const span = event.target.firstElementChild
    const newLikeTotal = parseInt(span.textContent) + 1

    const data = {
        quoteId: quoteId,
        createdAt: Math.floor(Date.now()/1000)
    }

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch('http://localhost:3000/likes', config)
    .then(resp => resp.json())
    .then(() => {
        span.textContent = newLikeTotal
    })
}


const deleteQuote = quoteCard => {
    const id = quoteCard.dataset.id 
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
    })
    .then(resp => resp.json()).then(beef => quoteCard.remove())
}



clickHandler()
submitHandler()
initialize()


