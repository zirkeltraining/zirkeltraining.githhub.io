function showStatistics(selection) {
    clear()
    const statByType = calcByType(selection)
    getContainer().appendChild(createStatTable('by Type', 'Looks like the selection is empty.', statByType))
}

function clear() {
    const elements = getContainer().getElementsByClassName('stat-list__table')
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).remove()
    }
}

function getContainer() {
    return document.getElementById('stat-container')
}

function createStatTable(title, emptyText, data) {
    const statView = document.createElement('div')
    statView.className = 'stat-list__table'

    const titleView = document.createElement('div')
    titleView.className = 'stat-list__title'
    titleView.innerHTML = `<span>${title}</span>`
    statView.appendChild(titleView)

    if (data.size === 0) {
        const emptyView = document.createElement('div')
        emptyView.className = 'stat-list__empty'
        emptyView.innerText = emptyText
        statView.appendChild(emptyView)
    } else {
        data.forEach((value, key) => {
            let itemView = document.createElement('div')
            itemView.className = 'stat-list__item'
            itemView.innerHTML =
                `<span class="stat-list__item-name">${key.toLowerCase()}</span>` +
                `<span class="stat-list__item-value">${value}</span>`
            statView.appendChild(itemView)
        })
    }
    return statView
}

function calcByType(widgets) {
    return countBy(widgets, (a) => a.type)
}

function countBy(list, keyGetter) {
    const map = new Map()
    list.forEach((item) => {
        const key = keyGetter(item)
        const count = map.get(key)
        map.set(key, !count ? 1 : count + 1)
    })
    return new Map([...map.entries()].sort((a, b) => b[1] - a[1]))
}

function showAllCards() {
    console.log("getting Cards")
    //await a=miro.board.widgets.get({type:'CARD', title:'<p>s</p>'})
    cards = miro.board.widgets.get({type:'CARD'})
    console.log (cards)
}

function showAllUsers() {


    miro.isAuthorized().then( (isAuthorized) => {
        if (isAuthorized) {
          console.log('Web plugin authorized');
        } else {
          console.log('Unauthorized');
        }
      })

// Get OAuth token for current user to make requests REST API
miro.getToken().then( (token) =>{
    console.log('oAuth token', token);
  })
// Opens auth popup.
// To prevent the browser from blocking this popup, only call miro.authorize from a click handler on your domain.
// Method returns a token you can use to make requests REST API on behalf of the current user.
 
   // miro.authorize({"response_type":"token"}).then( (result) =>{
    //    console.log('oAuth authorize', result);
    //  })


    fetch("https://api.miro.com/v1/teams/3074457352877196176/user-connections?limit=10&offset=0", {
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });
}

miro.onReady(() => {
    miro.addListener('SELECTION_UPDATED', (e) => {
        showStatistics(e.data)
    })
    miro.board.selection.get().then(showStatistics)
})