//Selecting elements
const menuBtn = document.getElementById('menu');
const nav = document.querySelector('nav')
const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const error = document.querySelector('#error');
const copyBtn = document.querySelectorAll('.copy-btn');
const form = document.querySelector('.form')
const links = [];

//Show nav
function showNav() {
    menuBtn.name = menuBtn.name === "menu-outline" ? "close-outline" : "menu-outline";
    nav.classList.toggle('hidden');
    nav.classList.toggle('top-[-400]');
}

//Link validation
function validateUrl(aLink) {
    let validator = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if (!validator.test(aLink)) {
        error.classList.remove('hidden');
        urlInput.classList.add('border-2', 'border-red', 'placeholder:text-red');
        error.textContent = aLink.length === 0 ? 'Input is empty' : 'Please add a valid link';
    } else {
        error.classList.add('hidden');
        urlInput.classList.remove('border-2', 'border-red', 'placeholder:text-red');
    }
}

function isExist(link) {
    const localStorageLinks = JSON.parse(localStorage.getItem('links'));
    return links.some(l => l.orginalLink === link.orginalLink)
        || localStorageLinks?.some(l => l.orginalLink === link.orginalLink);
}


//Copy to clipboard
const requestClipboardPermisions = async () => {
    const result = await navigator.permissions.query({ name: "clipboard-write" });
    return result.state == "granted" || result.state == "prompt" ? true : false;
};

shortenList.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
        const link = e.target.previousElementSibling.firstElementChild.textContent;
        console.log(link);
        const button = e.target;
        const otherBtns = shortenList.querySelectorAll('.copy-btn');
        otherBtns.forEach(element => {
            if (element.innerText === 'Copied!') {
                element.classList.remove('bg-violet-base');
                element.classList.add('bg-cyan');
                element.innerHTML = 'Copy';
            }
        });
        navigator.clipboard.writeText(link).then(res => {
            button.classList.add('bg-violet-base');
            button.classList.remove('bg-cyan');
            button.innerHTML = 'Copied!';
        }).catch(err => {
            console.log(err);
        })
    }
});

//Render shorten links
function shortenLinkRender(link) {
    const html = `
    <li class="bg-white rounded-lg w-full flex flex-col gap-2 py-4 md:flex-row md:justify-between md:items-center min-w-0">
          <span class="text-ellipsis whitespace-nowrap overflow-hidden pr-4 md:w-1/3">
            <span class="orginal-link text-violet-dark px-4 md:px-0 md:pl-4">${link.orginalLink}</span>
          </span>
          <hr class="md:appearance-none border-none h-[0.5px] bg-slate-300">
          <span class="text-ellipsis whitespace-nowrap overflow-hidden pr-4 md:w-2/3">
            <span data-link="${link.shortLink}" class="short-link.shortLink text-cyan px-4 md:text-right">${link.shortLink}</span>
          </span>
          <button class="copy-btn mx-4 md:mx-0 md:mr-4 py-2 bg-cyan text-white rounded md:w-32 hover:opacity-70 duration-500" data-link="${link}">Copy</button>
    </li>`;
    shortenList.insertAdjacentHTML('beforeend', html);
    urlInput.value = '';

}


//Fetch shorten url
async function shortenUrl(e) {
    e.preventDefault();
    const url = urlInput.value.trim();
    console.log(url.length);
    validateUrl(url);
    try {
        const request = await fetch(`https://api.shrtco.de/v2/shorten/?url=${url}`);
        const data = await request.json();

        const link = {
            'orginalLink': data.result.original_link.trim(),
            'shortLink': data.result.full_short_link,
        }

        if (isExist(link)) {
            error.classList.remove('hidden');
            urlInput.classList.add('border-2', 'border-red', 'placeholder:text-red');
            error.textContent = 'Link already exist';
            throw new Error('Link already exist');
        }

        links.push(link);

        shortenLinkRender(link);
        localStorage.setItem('links', JSON.stringify(links));
    } catch (error) {
        console.error(error);
    }
}



function init() {
    const links = JSON.parse(localStorage.getItem('links'));
    if (links) {
        links.forEach(link => {
            shortenLinkRender(link);
        });
    }
    menuBtn.addEventListener('click', showNav);
    form.addEventListener('submit', shortenUrl);
}

init();