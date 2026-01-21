
/* global Deck */

var prefix = Deck.prefix

var transform = prefix('transform')

var translate = Deck.translate

var $container = document.getElementById('container')
var $topbar = document.getElementById('topbar')

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')
var $poker = document.createElement('button')
var $flip = document.createElement('button')
var $board = document.createElement('button')

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'
$poker.textContent = 'Poker'
$flip.textContent = 'Flip'
$board.textContent = 'Board'

var $title = document.createElement('span')
$title.textContent = 'REG Poker Academy 教学系统'
$title.id = 'siteTitle'
$topbar.appendChild($title)

$topbar.appendChild($flip)
$topbar.appendChild($shuffle)
$topbar.appendChild($bysuit)
$topbar.appendChild($fan)
$topbar.appendChild($poker)
$topbar.appendChild($sort)

var $bottombar = document.getElementById('bottombar')
$bottombar.appendChild($board)

var deck = Deck()

// easter eggs start

var acesClicked = []
var kingsClicked = []

deck.cards.forEach(function (card, i) {
  card.enableDragging()
  card.enableFlipping()

  card.$el.addEventListener('mousedown', onTouch)
  card.$el.addEventListener('touchstart', onTouch)

  function onTouch () {
    var card

    if (i % 13 === 0) {
      acesClicked[i] = true
      if (acesClicked.filter(function (ace) {
        return ace
      }).length === 4) {
        document.body.removeChild($topbar)
        deck.$el.style.display = 'none'
        setTimeout(function () {
          startWinning()
        }, 250)
      }
    } else if (i % 13 === 12) {
      if (!kingsClicked) {
        return
      }
      kingsClicked[i] = true
      if (kingsClicked.filter(function (king) {
        return king
      }).length === 4) {
        for (var j = 0; j < 3; j++) {
          card = Deck.Card(52 + j)
          card.mount(deck.$el)
          card.$el.style[transform] = 'scale(0)'
          card.setSide('front')
          card.enableDragging()
          card.enableFlipping()
          deck.cards.push(card)
        }
        deck.sort(true)
        kingsClicked = false
      }
    } else {
      acesClicked = []
      if (kingsClicked) {
        kingsClicked = []
      }
    }
  }
})

function startWinning () {
  var $winningDeck = document.createElement('div')
  $winningDeck.classList.add('deck')

  $winningDeck.style[transform] = translate(Math.random() * window.innerWidth - window.innerWidth / 2 + 'px', Math.random() * window.innerHeight - window.innerHeight / 2 + 'px')

  $container.appendChild($winningDeck)

  var side = Math.floor(Math.random() * 2) ? 'front' : 'back'

  for (var i = 0; i < 55; i++) {
    addWinningCard($winningDeck, i, side)
  }

  setTimeout(startWinning, Math.round(Math.random() * 1000))
}

function addWinningCard ($deck, i, side) {
  var card = Deck.Card(54 - i)
  var delay = (55 - i) * 20
  var animationFrames = Deck.animationFrames
  var ease = Deck.ease

  card.enableFlipping()

  if (side === 'front') {
    card.setSide('front')
  } else {
    card.setSide('back')
  }

  card.mount($deck)
  card.$el.style.display = 'none'

  var xStart = 0
  var yStart = 0
  var xDiff = -500
  var yDiff = 500

  animationFrames(delay, 1000)
    .start(function () {
      card.x = 0
      card.y = 0
      card.$el.style.display = ''
    })
    .progress(function (t) {
      var tx = t
      var ty = ease.cubicIn(t)
      card.x = xStart + xDiff * tx
      card.y = yStart + yDiff * ty
      card.$el.style[transform] = translate(card.x + 'px', card.y + 'px')
    })
    .end(function () {
      card.unmount()
    })
}

// easter eggs end

$shuffle.addEventListener('click', function () {
  deck.shuffle()
  deck.shuffle()
})
$sort.addEventListener('click', function () {
  deck.sort()
})
$bysuit.addEventListener('click', function () {
  deck.sort(true) // sort reversed
  deck.bysuit()
})
$fan.addEventListener('click', function () {
  deck.fan()
})
$flip.addEventListener('click', function () {
  deck.flip()
})
$poker.addEventListener('click', function () {
  deck.queue(function (next) {
    deck.cards.forEach(function (card, i) {
      setTimeout(function () {
        card.setSide('back')
      }, i * 7.5)
    })
    next()
  })
  deck.shuffle()
  deck.shuffle()
  deck.poker()
})

var $boardInput = document.getElementById('boardInput')

// Hand inputs and buttons
var $hand1Input = document.getElementById('hand1Input')
var $hand2Input = document.getElementById('hand2Input')
var $hand3Input = document.getElementById('hand3Input')
var $hand4Input = document.getElementById('hand4Input')
var $hand1Btn = document.getElementById('hand1Btn')
var $hand2Btn = document.getElementById('hand2Btn')
var $hand3Btn = document.getElementById('hand3Btn')
var $hand4Btn = document.getElementById('hand4Btn')
var $flipHandBtn = document.getElementById('flipHandBtn')
var $sidebar = document.getElementById('sidebar')
var $sidebarHandle = document.getElementById('sidebarHandle')
var $sidebarContent = document.getElementById('sidebarContent')
var $sidebarCollapseIcon = document.getElementById('sidebarCollapseIcon')

// Sidebar collapse
$sidebarCollapseIcon.addEventListener('click', function (e) {
  e.stopPropagation()
  if ($sidebarContent.classList.contains('collapsed')) {
    $sidebarContent.classList.remove('collapsed')
    $sidebarCollapseIcon.textContent = '-'
  } else {
    $sidebarContent.classList.add('collapsed')
    $sidebarCollapseIcon.textContent = '+'
  }
})

// Sidebar dragging
var isDragging = false
var dragOffsetX = 0
var dragOffsetY = 0

$sidebarHandle.addEventListener('mousedown', function (e) {
  if (e.target === $sidebarCollapseIcon) return
  isDragging = true
  dragOffsetX = e.clientX - $sidebar.offsetLeft
  dragOffsetY = e.clientY - $sidebar.offsetTop
  e.preventDefault()
})

$sidebarHandle.addEventListener('touchstart', function (e) {
  if (e.target === $sidebarCollapseIcon) return
  isDragging = true
  var touch = e.touches[0]
  dragOffsetX = touch.clientX - $sidebar.offsetLeft
  dragOffsetY = touch.clientY - $sidebar.offsetTop
  e.preventDefault()
})

document.addEventListener('mousemove', function (e) {
  if (!isDragging) return
  $sidebar.style.left = (e.clientX - dragOffsetX) + 'px'
  $sidebar.style.top = (e.clientY - dragOffsetY) + 'px'
})

document.addEventListener('touchmove', function (e) {
  if (!isDragging) return
  var touch = e.touches[0]
  $sidebar.style.left = (touch.clientX - dragOffsetX) + 'px'
  $sidebar.style.top = (touch.clientY - dragOffsetY) + 'px'
})

document.addEventListener('mouseup', function () {
  isDragging = false
})

document.addEventListener('touchend', function () {
  isDragging = false
})

// Store displayed hand cards for flipping
var handCards = {
  hand1: [],
  hand2: [],
  hand3: [],
  hand4: []
}

// Get current game mode card count
function getGameModeCardCount () {
  var selectedMode = document.querySelector('input[name="gameMode"]:checked')
  if (!selectedMode) return 4 // default to Omaha
  switch (selectedMode.value) {
    case 'holdem':
      return 2
    case 'omaha':
      return 4
    case 'bigo':
      return 5
    default:
      return 4
  }
}

// Hand positions (y offset for each hand row)
var handPositions = {
  hand1: { x: -300, y: -180 },
  hand2: { x: -300, y: 50 },
  hand3: { x: 300, y: -180 },
  hand4: { x: 300, y: 50 }
}

function showHand (handKey, inputElement) {
  var input = inputElement.value.trim().toLowerCase()
  if (!input) return

  var cardCodes = parseCardInput(input)
  if (cardCodes.length === 0) return

  // Clear previous hand cards
  handCards[handKey] = []

  deck.queue(function (next) {
    var fontSize = 16
    var len = deck.cards.length
    var pos = handPositions[handKey]

    cardCodes.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      handCards[handKey].push(card)

      var delay = i * 150

      card.animateTo({
        delay: delay,
        duration: 200,
        x: pos.x - i * 20 * fontSize / 16,
        y: pos.y + i * 20 * fontSize / 16,
        rot: 0,
        onStart: function () {
          card.$el.style.zIndex = len + i
          card.setSide('back')
        },
        onComplete: function () {
          if (i === cardCodes.length - 1) {
            next()
          }
        }
      })
    })
  })
}

$hand1Btn.addEventListener('click', function () {
  showHand('hand1', $hand1Input)
})
$hand2Btn.addEventListener('click', function () {
  showHand('hand2', $hand2Input)
})
$hand3Btn.addEventListener('click', function () {
  showHand('hand3', $hand3Input)
})
$hand4Btn.addEventListener('click', function () {
  showHand('hand4', $hand4Input)
})

// Roll buttons
var $roll1Btn = document.getElementById('roll1Btn')
var $roll2Btn = document.getElementById('roll2Btn')
var $roll3Btn = document.getElementById('roll3Btn')
var $roll4Btn = document.getElementById('roll4Btn')
var $rollBoardBtn = document.getElementById('rollBoardBtn')

// Store board cards
var boardCards = []

function getUsedCardIndices (excludeHandKey) {
  var used = []
  // Add board cards
  boardCards.forEach(function (card) {
    used.push(card.i)
  })
  // Add other hands' cards
  Object.keys(handCards).forEach(function (handKey) {
    if (handKey !== excludeHandKey) {
      handCards[handKey].forEach(function (card) {
        used.push(card.i)
      })
    }
  })
  return used
}

function getUsedCardIndicesForBoard () {
  var used = []
  // Add all hands' cards
  Object.keys(handCards).forEach(function (handKey) {
    handCards[handKey].forEach(function (card) {
      used.push(card.i)
    })
  })
  return used
}

function getRandomCards (count, excludedIndices) {
  var available = []
  for (var i = 0; i < 52; i++) {
    if (excludedIndices.indexOf(i) === -1) {
      available.push(i)
    }
  }
  // Shuffle and pick
  var result = []
  for (var j = 0; j < count && available.length > 0; j++) {
    var randIndex = Math.floor(Math.random() * available.length)
    result.push(available[randIndex])
    available.splice(randIndex, 1)
  }
  return result
}

function cardIndexToCode (cardIndex) {
  var suits = ['s', 'h', 'c', 'd']
  var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
  var suit = Math.floor(cardIndex / 13)
  var rank = cardIndex % 13
  return ranks[rank] + suits[suit]
}

function rollHand (handKey, inputElement) {
  // First, return old hand cards to deck
  if (handCards[handKey].length > 0) {
    deck.queue(function (next) {
      var cardsToReturn = handCards[handKey].slice()
      handCards[handKey] = []

      cardsToReturn.forEach(function (card, i) {
        card.animateTo({
          delay: i * 50,
          duration: 200,
          x: 0,
          y: 0,
          rot: 0,
          onStart: function () {
            card.setSide('back')
          },
          onComplete: function () {
            if (i === cardsToReturn.length - 1) {
              next()
            }
          }
        })
      })
    })
  }

  // Then deal new cards
  deck.queue(function (next) {
    var excludedIndices = getUsedCardIndices(handKey)
    var cardCount = getGameModeCardCount()
    var randomCardIndices = getRandomCards(cardCount, excludedIndices)
    // Update input field
    var codes = randomCardIndices.map(cardIndexToCode).join('')
    inputElement.value = codes

    var fontSize = 16
    var len = deck.cards.length
    var pos = handPositions[handKey]

    randomCardIndices.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      handCards[handKey].push(card)

      var delay = i * 150

      card.animateTo({
        delay: delay,
        duration: 200,
        x: pos.x - i * 20 * fontSize / 16,
        y: pos.y + i * 20 * fontSize / 16,
        rot: 0,
        onStart: function () {
          card.$el.style.zIndex = len + i
          card.setSide('back')
        },
        onComplete: function () {
          if (i === randomCardIndices.length - 1) {
            next()
          }
        }
      })
    })
  })
}

function showHandByIndices (handKey, cardIndices) {
  if (cardIndices.length === 0) return

  // Clear previous hand cards
  handCards[handKey] = []

  deck.queue(function (next) {
    var fontSize = 16
    var len = deck.cards.length
    var pos = handPositions[handKey]

    cardIndices.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      handCards[handKey].push(card)

      var delay = i * 150

      card.animateTo({
        delay: delay,
        duration: 200,
        x: pos.x - i * 20 * fontSize / 16,
        y: pos.y + i * 20 * fontSize / 16,
        rot: 0,
        onStart: function () {
          card.$el.style.zIndex = len + i
          card.setSide('back')
        },
        onComplete: function () {
          if (i === cardIndices.length - 1) {
            next()
          }
        }
      })
    })
  })
}

$roll1Btn.addEventListener('click', function () {
  rollHand('hand1', $hand1Input)
})
$roll2Btn.addEventListener('click', function () {
  rollHand('hand2', $hand2Input)
})
$roll3Btn.addEventListener('click', function () {
  rollHand('hand3', $hand3Input)
})
$roll4Btn.addEventListener('click', function () {
  rollHand('hand4', $hand4Input)
})

$rollBoardBtn.addEventListener('click', function () {
  // First, return old board cards to deck
  if (boardCards.length > 0) {
    deck.queue(function (next) {
      var cardsToReturn = boardCards.slice()
      boardCards = []

      cardsToReturn.forEach(function (card, i) {
        card.animateTo({
          delay: i * 50,
          duration: 200,
          x: 0,
          y: 0,
          rot: 0,
          onStart: function () {
            card.setSide('back')
          },
          onComplete: function () {
            if (i === cardsToReturn.length - 1) {
              next()
            }
          }
        })
      })
    })
  }

  // Then deal new cards
  deck.queue(function (next) {
    var excludedIndices = getUsedCardIndicesForBoard()
    var randomCardIndices = getRandomCards(5, excludedIndices)
    // Update input field
    var codes = randomCardIndices.map(cardIndexToCode).join('')
    $boardInput.value = codes

    var fontSize = 16
    var len = deck.cards.length

    randomCardIndices.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      boardCards.push(card)

      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,
        x: Math.round((i - (randomCardIndices.length - 1) / 2) * 80 * fontSize / 16),
        y: Math.round(-180 * fontSize / 16),
        rot: 0,
        onStart: function () {
          card.$el.style.zIndex = len + i
        },
        onComplete: function () {
          card.setSide('front')
          if (i === randomCardIndices.length - 1) {
            next()
          }
        }
      })
    })
  })
})

var handsFlippedToFront = false

$flipHandBtn.addEventListener('click', function () {
  // Flip all hand cards to the same side
  var targetSide = handsFlippedToFront ? 'back' : 'front'
  Object.keys(handCards).forEach(function (handKey) {
    handCards[handKey].forEach(function (card) {
      card.setSide(targetSide)
    })
  })
  handsFlippedToFront = !handsFlippedToFront
})

$board.addEventListener('click', function () {
  var input = $boardInput.value.trim().toLowerCase()
  if (!input) return

  var cardCodes = parseCardInput(input)
  if (cardCodes.length === 0) return

  // Clear previous board cards
  boardCards = []

  // Show the specified cards directly without shuffling
  deck.queue(function (next) {
    var fontSize = 16
    var len = deck.cards.length

    cardCodes.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      boardCards.push(card)

      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,
        x: Math.round((i - (cardCodes.length - 1) / 2) * 80 * fontSize / 16),
        y: Math.round(-180 * fontSize / 16),
        rot: 0,
        onStart: function () {
          card.$el.style.zIndex = len + i
        },
        onComplete: function () {
          card.setSide('front')
          if (i === cardCodes.length - 1) {
            next()
          }
        }
      })
    })
  })
})

function parseCardInput (input) {
  // Parse input like "5c6c7c8c9c" or "AhKsQdJcTh"
  var result = []
  var suitMap = { s: 0, h: 1, c: 2, d: 3 }
  var rankMap = { a: 1, t: 10, j: 11, q: 12, k: 13 }

  var i = 0
  while (i < input.length) {
    var rank
    var suit

    // Parse rank
    if (rankMap[input[i]]) {
      rank = rankMap[input[i]]
      i++
    } else if (input[i] >= '2' && input[i] <= '9') {
      rank = parseInt(input[i])
      i++
    } else {
      i++
      continue
    }

    // Parse suit
    if (i < input.length && suitMap[input[i]] !== undefined) {
      suit = suitMap[input[i]]
      i++
    } else {
      continue
    }

    // Calculate card index: i = suit * 13 + (rank - 1)
    var cardIndex = suit * 13 + (rank - 1)
    result.push(cardIndex)
  }

  return result
}

deck.mount($container)

deck.intro()
deck.sort()

// secret message..

var randomDelay = 10000 + 30000 * Math.random()

setTimeout(function () {
  printMessage('Psst..I want to share a secret with you...')
}, randomDelay)

setTimeout(function () {
  printMessage('...try clicking all kings and nothing in between...')
}, randomDelay + 5000)

setTimeout(function () {
  printMessage('...have fun ;)')
}, randomDelay + 10000)

function printMessage (text) {
  var animationFrames = Deck.animationFrames
  var ease = Deck.ease
  var $message = document.createElement('p')
  $message.classList.add('message')
  $message.textContent = text

  document.body.appendChild($message)

  $message.style[transform] = translate(window.innerWidth + 'px', 0)

  var diffX = window.innerWidth

  animationFrames(1000, 700)
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $message.style[transform] = translate((diffX - diffX * t) + 'px', 0)
    })

  animationFrames(6000, 700)
    .start(function () {
      diffX = window.innerWidth
    })
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $message.style[transform] = translate((-diffX * t) + 'px', 0)
    })
    .end(function () {
      document.body.removeChild($message)
    })
}

// Analysis Panel
var $analysisPanel = document.getElementById('analysisPanel')
var $analysisPanelHandle = document.getElementById('analysisPanelHandle')
var $analysisPanelContent = document.getElementById('analysisPanelContent')
var $collapseIcon = document.getElementById('collapseIcon')
var $straightFlushRow = document.getElementById('straightFlushRow')
var $missingCardsRow = document.getElementById('missingCardsRow')

// Analysis panel dragging
var isAnalysisDragging = false
var analysisDragOffsetX = 0
var analysisDragOffsetY = 0

$analysisPanelHandle.addEventListener('mousedown', function (e) {
  if (e.target === $collapseIcon) return
  isAnalysisDragging = true
  analysisDragOffsetX = e.clientX - $analysisPanel.offsetLeft
  analysisDragOffsetY = e.clientY - $analysisPanel.offsetTop
  e.preventDefault()
})

$analysisPanelHandle.addEventListener('touchstart', function (e) {
  if (e.target === $collapseIcon) return
  isAnalysisDragging = true
  var touch = e.touches[0]
  analysisDragOffsetX = touch.clientX - $analysisPanel.offsetLeft
  analysisDragOffsetY = touch.clientY - $analysisPanel.offsetTop
  e.preventDefault()
})

document.addEventListener('mousemove', function (e) {
  if (!isAnalysisDragging) return
  $analysisPanel.style.left = (e.clientX - analysisDragOffsetX) + 'px'
  $analysisPanel.style.top = (e.clientY - analysisDragOffsetY) + 'px'
  $analysisPanel.style.right = 'auto'
})

document.addEventListener('touchmove', function (e) {
  if (!isAnalysisDragging) return
  var touch = e.touches[0]
  $analysisPanel.style.left = (touch.clientX - analysisDragOffsetX) + 'px'
  $analysisPanel.style.top = (touch.clientY - analysisDragOffsetY) + 'px'
  $analysisPanel.style.right = 'auto'
})

document.addEventListener('mouseup', function () {
  isAnalysisDragging = false
})

document.addEventListener('touchend', function () {
  isAnalysisDragging = false
})

// Collapse/Expand
$collapseIcon.addEventListener('click', function (e) {
  e.stopPropagation()
  if ($analysisPanelContent.classList.contains('collapsed')) {
    $analysisPanelContent.classList.remove('collapsed')
    $collapseIcon.textContent = '-'
  } else {
    $analysisPanelContent.classList.add('collapsed')
    $collapseIcon.textContent = '+'
  }
})

// Conditional row display
function updateConditionalRows () {
  var flushYes = document.querySelector('input[name="flush"][value="yes"]').checked
  var straightYes = document.querySelector('input[name="straight"][value="yes"]').checked

  // Show straight flush row if both straight and flush are "yes"
  if (straightYes && flushYes) {
    $straightFlushRow.style.display = 'flex'
  } else {
    $straightFlushRow.style.display = 'none'
  }

  // Show missing cards row if straight is "yes"
  if (straightYes) {
    $missingCardsRow.style.display = 'flex'
  } else {
    $missingCardsRow.style.display = 'none'
  }
}

// Add event listeners for radio buttons
document.querySelectorAll('#analysisPanelContent input[type="radio"]').forEach(function (radio) {
  radio.addEventListener('change', updateConditionalRows)
})

// Auto-resize textarea
var $missingCardsInput = document.getElementById('missingCardsInput')
function autoResizeTextarea (textarea) {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}
function autoResizeMissingCards () {
  autoResizeTextarea($missingCardsInput)
}
$missingCardsInput.addEventListener('input', autoResizeMissingCards)

// Auto-resize board and hand inputs
var textareaInputs = [
  $boardInput,
  $hand1Input,
  $hand2Input,
  $hand3Input,
  $hand4Input
]
textareaInputs.forEach(function (textarea) {
  textarea.addEventListener('input', function () {
    autoResizeTextarea(textarea)
  })
})

// Chips dragging
var draggingChip = null
var chipOffsetX = 0
var chipOffsetY = 0

document.querySelectorAll('.chip').forEach(function (chip) {
  chip.addEventListener('mousedown', function (e) {
    startChipDrag(chip, e.clientX, e.clientY)
    e.preventDefault()
  })

  chip.addEventListener('touchstart', function (e) {
    var touch = e.touches[0]
    startChipDrag(chip, touch.clientX, touch.clientY)
    e.preventDefault()
  })
})

function startChipDrag (chip, clientX, clientY) {
  draggingChip = chip
  var rect = chip.getBoundingClientRect()
  chipOffsetX = clientX - rect.left
  chipOffsetY = clientY - rect.top

  // Move chip to body for free positioning
  chip.classList.add('dragging')
  chip.style.left = rect.left + 'px'
  chip.style.top = rect.top + 'px'
  document.body.appendChild(chip)
}

document.addEventListener('mousemove', function (e) {
  if (!draggingChip) return
  draggingChip.style.left = (e.clientX - chipOffsetX) + 'px'
  draggingChip.style.top = (e.clientY - chipOffsetY) + 'px'
})

document.addEventListener('touchmove', function (e) {
  if (!draggingChip) return
  var touch = e.touches[0]
  draggingChip.style.left = (touch.clientX - chipOffsetX) + 'px'
  draggingChip.style.top = (touch.clientY - chipOffsetY) + 'px'
})

document.addEventListener('mouseup', function () {
  if (draggingChip) {
    draggingChip = null
  }
})

document.addEventListener('touchend', function () {
  if (draggingChip) {
    draggingChip = null
  }
})
