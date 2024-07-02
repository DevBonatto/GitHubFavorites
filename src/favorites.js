import { gitHubUser } from "./GitHubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)

    this.tbody = this.root.querySelector('table tbody')

    this.load()
  }

  load() {
    this.users = JSON.parse(localStorage.getItem('@githut-favorites:')) || []
  }

  save() {
    localStorage.setItem('@githut-favorites:', JSON.stringify(this.users))
  }

  async add(username) {
    try {
      const userExists = this.users.find(user => user.login.toLowerCase() === username.toLowerCase())
      if (userExists) {
        throw new Error('Usuário já existe');
      }  

      const user = await gitHubUser.search(username)
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.users = [user, ...this.users]
      this.update()
      this.save()

    }catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredUsers = this.users.filter(userFiltered => userFiltered.login !== user.login)
    this.users = filteredUsers
    this.update()
    this.save()
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.users.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esse usuário?')
        if(isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })

  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
          <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
            <a href="https://github.com/maykbrito" target="_blank">
              <p>Mayk Brito</p>
              <span>maykbrito</span>
            </a>
          </td>
          <td class="repositories">
            <p>22</p>
          </td>
          <td class="followers">
            <p>22</p>
          </td>
          <td>
            <button class="remove">&times;</button>
          </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }
}