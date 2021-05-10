const notRendered = document.getElementById('pre-rendered');

const callbackTimer = (startSec, endSec) => {
    let sec = startSec;
    const myInterval = setInterval(() => {
        notRendered.innerText = `Loading... (${sec}s)`;
        sec++;
        if (sec > endSec || !app.connected) {
            clearInterval(myInterval);
            notRendered.innerHTML = 'Cannot connect to server. Try later';
        }
    }, 1000)
};


const MembersAPI = (() => {
    const url = 'http://localhost:3000/';
    const path = 'employees/';

    const getAllMembers = () => {
        return fetch(url + path)
            .then(response => response.json())
    }
    const addMember = ({ id, first_name, last_name, email }) => {
        return fetch(url + path, {
            method: 'POST',
            body: JSON.stringify({
                id,
                first_name,
                last_name,
                email,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => console.log('Added member:', json));
    }

    const removeMember = (id) => {
        return fetch((url + path + id), {
            method: 'DELETE',
        })
            .then(response => response.json())
    }


    return {
        getAllMembers,
        addMember,
        removeMember,
    }
})();




class Model {
    constructor() {
        // the state of the model
        this.members = [
            { id: 0, first_name: 'N/A', last_name: 'N/A', email: 'N/A' }
        ];
    }
    get numOfMembers() {
        return this._numOfMembers;
    }
    set numOfMembers(num) {
        this._numOfMembers = num;
    }
    set initMembers(membersData) {
        this.members = membersData;
        this.numOfMembers = this.members.length;
        console.log(`number of members: ${this.numOfMembers}`)
    }


    getAllMembers = MembersAPI.getAllMembers;
    removeMember = (id) => {
        const newMembers = MembersAPI.removeMember(id);
        return newMembers;
    }
    addMember({ first_name, last_name, email }) {
        const newMember = {
            id: this.members.length > 0 ? this.members[this.numOfMembers - 1].id + 1 : 1,
            first_name: first_name,
            last_name: last_name,
            email: email
        }
        const newMembers = MembersAPI.addMember(newMember);
        return newMembers;
    }
    editMember(id, { first_name, last_name, email }) {
        this.members.forEach(member => {
            if (member.id === id) {
                member.first_name = first_name;
                member.last_name = last_name;
                member.email = email;
            }
        });
    }

}



class View {
    constructor() {
        console.log('View constructor')
        this.membersApp = this.getElement('#members-app');
        this.inputContainer = this.getElement('.input-container');
        this.inputSearch = this.getElement('#input-search');
        this.btnsRemove = 'not implemented';
        this.btnSearch = this.getElement('#btn-search');
        this.resultContainer = this.getElement('.result-container');
        this.results = this.getElement('.results');
    

        // form section
        this.formContainer = this.getElement('.form-container');
        this.formAddMember = document.getElementById('form-addMember');
        this.firstName = document.getElementById('firstName');
        this.lastName = document.getElementById('lastName');
        this.email = document.getElementById('email');
        this.btnSubmit = this.getElement('.btn-submit');
        
        this.memberElements = 'not implemented';
        this.queryMessage = 'no message has been set';

        

    }
    getElement(selector, isSelectAll) {
        const element = isSelectAll ? document.querySelectorAll(selector) : document.querySelector(selector);
        return element;
    }

    render(selector, htmlTemp) {
        this.getElement(selector).innerHTML = htmlTemp;
    }
    get inputText() {
        return this.inputSearch.value;
    }

    set inputText(text) {
        this.inputSearch.value = text;
    }
    resetInputText() {
        this.inputSearch.value = '';
    }
    showMessage(display) {
        const messageElement = document.querySelector('.message');
        messageElement.innerText = this.queryMessage;
        display ? messageElement.style.display = 'unset' : messageElement.style.display = 'none';
    }

    initMembersDOM(membersArray) {
        let showMessage = false;

        console.log('init members DOM');
        let template = `<li class="message"></li>`;
        if (!membersArray.length) {
            this.queryMessage = 'Server has no member';
            showMessage = true;
        }
        else {
            membersArray.forEach(member => {
                template += `
                        <li class="result-list" id="member${member.id}">${member.first_name} ${member.last_name}</li>
                        <button class="btn-remove" id="${member.id}">remove</button>
                    `
            })
        }
        this.render('.results', template);
        
        this.memberElements = this.getElement('.result-list', 'selectAll');
        this.showMessage(showMessage);
        this.btnsRemove = this.getElement('.btn-remove', 'selectAll');
    }


    sendUserData() {
        if (this.firstName.checkValidity() 
        && this.lastName.checkValidity() 
        && this.email.checkValidity()) {
            return {
                first_name : this.firstName.value[0].toUpperCase() + this.firstName.value.slice(1),
                last_name: this.lastName.value[0].toUpperCase() + this.lastName.value.slice(1),
                email: this.email.value.toLowerCase()
            }
        }
        return false;
    }

}



class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.searchTerm = '';
        this.connected = true;
    }



    init() {
        const notRendered = document.getElementById('pre-rendered');
        callbackTimer(1, 30);

        this.searchTerm = '';
        console.log('init() runs');

        this.model.getAllMembers()
            .then(membersData => {
                this.model.initMembers = membersData;
                // default view
                this.view.initMembersDOM(this.model.members, this.model.testFunction);
                this.addListenerRemove();
                this.addListenerInput();
                this.addListenerAdd();
                
            })
            .catch(() => {
                this.connected = false;
            });

    }
    addListenerAdd() {
        this.view.btnSubmit.addEventListener('click', (event) => {
            // event.preventDefault();
            const newUserData = this.view.sendUserData();
            console.log(newUserData);
            if (newUserData) {
                this.model.addMember(newUserData);
                console.log('hi')
            }
            console.log('Invalid user data');
                
        })
    }

    addListenerRemove() {
        this.view.btnsRemove.forEach(btn => {
            btn.addEventListener('click', (event) => {
                this.removeMember(event.target.id);
            });
        });
    }
    addListenerInput() {
        this.view.inputSearch.addEventListener('keyup', (event) => {
            this.searchTerm = event.target.value;
            const memberElements = this.view.memberElements;

            let id;
            let showMessage = true;
            let noResult = true;
            let memberFound = 0;

            if (!this.searchTerm) {
                memberElements.forEach(element => {
                    element.style.display = 'unset';
                    id = element.id.substring(6);
                    document.getElementById(id).style.display = 'unset';
                    showMessage = false;
                    noResult = false;
                    this.view.queryMessage = 'Loading...';
                });
            } else {
                for (let element of memberElements) {
                    if (element.innerText.toLowerCase().includes(this.searchTerm.toLowerCase())) {
                        element.style.display = 'unset';
                        id = element.id.substring(6);
                        document.getElementById(id).style.display = 'unset';
                        noResult = false;
                        memberFound++;
                    } else {
                        element.style.display = 'none';
                        id = element.id.substring(6);
                        document.getElementById(id).style.display = 'none';
                    }
                }
            }
            
            memberFound > 1 ? 
                noResult ? this.view.queryMessage = 'No member found' : this.view.queryMessage = `${memberFound} members found`
                :noResult ? this.view.queryMessage = 'No member found' : this.view.queryMessage = `${memberFound} member found`;
            this.view.showMessage(showMessage);
        });
    }



    removeMember(id) {
        this.model.removeMember(id)
            .then(newData => {
                this.init();
            })
    }

    updateMember() {


    }
    resetInputfield() {
        this.view.firstName = '';
        this.view.lastName = '';
        this.email = '';
    }

}

const app = new Controller(new Model(), new View());
app.init();