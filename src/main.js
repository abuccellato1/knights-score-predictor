import './style.css'

class KnightsScoreApp {
  constructor() {
    this.players = []
    this.gameHistory = []
    this.currentRound = 1
    this.init()
  }

  init() {
    this.render()
    this.attachEventListeners()
  }

  // Simple SVG icons as strings
  getIcon(name, size = 24, className = '') {
    const icons = {
      crown: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
      plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M5 12h14"/><path d="m12 5 0 14"/></svg>`,
      minus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M5 12h14"/></svg>`,
      rotateCcw: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
      trophy: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 13 20.24 13 22"/><path d="M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 11 20.24 11 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
      users: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3.3-3.3a4.8 4.8 0 0 0 0-6.4 4.8 4.8 0 0 0-6.4 0 4.8 4.8 0 0 0 0 6.4A4.8 4.8 0 0 0 22 21z"/></svg>`
    }
    return icons[name] || ''
  }

  addPlayer() {
    const playerCount = this.players.length + 1
    const newPlayer = {
      id: Date.now(),
      name: `Knight ${playerCount}`,
      score: 0,
      isEditing: false
    }
    this.players.push(newPlayer)
    this.render()
  }

  removePlayer(playerId) {
    this.players = this.players.filter(player => player.id !== playerId)
    this.render()
  }

  updateScore(playerId, change) {
    const player = this.players.find(p => p.id === playerId)
    if (player) {
      player.score = Math.max(0, player.score + change)
      this.render()
    }
  }

  editPlayerName(playerId) {
    const player = this.players.find(p => p.id === playerId)
    if (player) {
      player.isEditing = true
      this.render()
      // Focus the input after render
      setTimeout(() => {
        const input = document.querySelector(`#name-input-${playerId}`)
        if (input) {
          input.focus()
          input.select()
        }
      }, 0)
    }
  }

  savePlayerName(playerId, newName) {
    const player = this.players.find(p => p.id === playerId)
    if (player) {
      player.name = newName.trim() || `Knight ${this.players.indexOf(player) + 1}`
      player.isEditing = false
      this.render()
    }
  }

  resetScores() {
    if (confirm('Are you sure you want to reset all scores?')) {
      this.players.forEach(player => player.score = 0)
      this.currentRound = 1
      this.render()
    }
  }

  newGame() {
    if (confirm('Start a new game? This will clear all players and scores.')) {
      this.players = []
      this.currentRound = 1
      this.render()
    }
  }

  getWinner() {
    if (this.players.length === 0) return null
    return this.players.reduce((winner, player) => 
      player.score > winner.score ? player : winner
    )
  }

  getSortedPlayers() {
    return [...this.players].sort((a, b) => b.score - a.score)
  }

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      const { target } = e
      
      if (target.matches('[data-action="add-player"]')) {
        this.addPlayer()
      }
      
      if (target.matches('[data-action="remove-player"]')) {
        const playerId = parseInt(target.dataset.playerId)
        this.removePlayer(playerId)
      }
      
      if (target.matches('[data-action="increase-score"]')) {
        const playerId = parseInt(target.dataset.playerId)
        this.updateScore(playerId, 1)
      }
      
      if (target.matches('[data-action="decrease-score"]')) {
        const playerId = parseInt(target.dataset.playerId)
        this.updateScore(playerId, -1)
      }
      
      if (target.matches('[data-action="edit-name"]')) {
        const playerId = parseInt(target.dataset.playerId)
        this.editPlayerName(playerId)
      }
      
      if (target.matches('[data-action="reset-scores"]')) {
        this.resetScores()
      }
      
      if (target.matches('[data-action="new-game"]')) {
        this.newGame()
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('[data-name-input]')) {
        const playerId = parseInt(e.target.dataset.playerId)
        this.savePlayerName(playerId, e.target.value)
      }
      
      if (e.key === 'Escape' && e.target.matches('[data-name-input]')) {
        const playerId = parseInt(e.target.dataset.playerId)
        const player = this.players.find(p => p.id === playerId)
        if (player) {
          player.isEditing = false
          this.render()
        }
      }
    })

    document.addEventListener('blur', (e) => {
      if (e.target.matches('[data-name-input]')) {
        const playerId = parseInt(e.target.dataset.playerId)
        this.savePlayerName(playerId, e.target.value)
      }
    })
  }

  render() {
    const winner = this.getWinner()
    const sortedPlayers = this.getSortedPlayers()
    
    document.querySelector('#app').innerHTML = `
      <div class="app">
        <header class="header">
          <div class="header-content">
            <div class="title-section">
              ${this.getIcon('crown', 32, 'crown-icon')}
              <h1>Knights Score Tracker</h1>
            </div>
            <div class="game-controls">
              <button class="btn btn-secondary" data-action="reset-scores">
                ${this.getIcon('rotateCcw', 18)}
                Reset Scores
              </button>
              <button class="btn btn-secondary" data-action="new-game">
                ${this.getIcon('users', 18)}
                New Game
              </button>
            </div>
          </div>
        </header>

        <main class="main">
          ${this.players.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">${this.getIcon('crown', 64)}</div>
              <h2>Ready to Begin?</h2>
              <p>Add your first knight to start tracking scores</p>
              <button class="btn btn-primary btn-large" data-action="add-player">
                ${this.getIcon('plus', 20)}
                Add First Knight
              </button>
            </div>
          ` : `
            <div class="game-area">
              ${winner && winner.score > 0 ? `
                <div class="winner-banner">
                  ${this.getIcon('trophy', 24)}
                  <span><strong>${winner.name}</strong> is leading with ${winner.score} points!</span>
                </div>
              ` : ''}
              
              <div class="players-grid">
                ${sortedPlayers.map((player, index) => `
                  <div class="player-card ${index === 0 && player.score > 0 ? 'leading' : ''}">
                    <div class="player-header">
                      <div class="player-rank">#${index + 1}</div>
                      <button class="remove-btn" data-action="remove-player" data-player-id="${player.id}" title="Remove player">×</button>
                    </div>
                    
                    <div class="player-name-section">
                      ${player.isEditing ? `
                        <input 
                          type="text" 
                          class="name-input" 
                          id="name-input-${player.id}"
                          data-name-input 
                          data-player-id="${player.id}" 
                          value="${player.name}"
                          placeholder="Enter name..."
                        />
                      ` : `
                        <h3 class="player-name" data-action="edit-name" data-player-id="${player.id}" title="Click to edit name">
                          ${player.name}
                        </h3>
                      `}
                    </div>
                    
                    <div class="score-section">
                      <div class="score-display">${player.score}</div>
                      <div class="score-controls">
                        <button class="score-btn decrease" data-action="decrease-score" data-player-id="${player.id}">
                          ${this.getIcon('minus', 16)}
                        </button>
                        <button class="score-btn increase" data-action="increase-score" data-player-id="${player.id}">
                          ${this.getIcon('plus', 16)}
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div class="add-player-section">
                <button class="btn btn-primary" data-action="add-player">
                  ${this.getIcon('plus', 18)}
                  Add Knight
                </button>
              </div>
            </div>
          `}
        </main>
      </div>
    `
  }
}

// Initialize the app
new KnightsScoreApp()