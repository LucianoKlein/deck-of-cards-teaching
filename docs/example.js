
/* global Deck */

var prefix = Deck.prefix

var transform = prefix('transform')

var translate = Deck.translate

var DECK_X = 0
var BOARD_Y = -140     // 公共牌靠近中线
var DECK_Y = 240


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

  function onTouch() {
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

function startWinning() {
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

function addWinningCard($deck, i, side) {
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
var HAND_COUNT = 8

var handCards = {}
for (var i = 1; i <= HAND_COUNT; i++) {
  handCards['hand' + i] = []
}

// Get current game mode card count
function getGameModeCardCount() {
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
  // 上排（明显上移 + 拉开中间）
  hand1: { x: -520, y: -330 },
  hand2: { x: -180, y: -360 },
  hand3: { x: 180, y: -360 },
  hand4: { x: 520, y: -330 },

  // 下排（明显下移 + 拉开中间）
  hand5: { x: -520, y: 150 },
  hand6: { x: -180, y: 170 },
  hand7: { x: 180, y: 170 },
  hand8: { x: 520, y: 150 }

}


function showHand(handKey, inputElement) {
  var input = inputElement.value.trim().toLowerCase()
  if (!input) return

  var cardCodes = parseCardInput(input)
  if (cardCodes.length === 0) return

  // ✅ 先回收旧牌（只清一次）
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
            card.$el.style.zIndex = ''   // ✅ 关键，只在回收时加
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

  // ✅ 再发新牌
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


for (let i = 1; i <= HAND_COUNT; i++) {
  let handKey = 'hand' + i
  let input = document.getElementById(handKey + 'Input')
  let btn = document.getElementById(handKey + 'Btn')

  if (!btn || !input) continue

  btn.addEventListener('click', function () {
    showHand(handKey, input)
  })
}


// Roll buttons
var $roll1Btn = document.getElementById('roll1Btn')
var $roll2Btn = document.getElementById('roll2Btn')
var $roll3Btn = document.getElementById('roll3Btn')
var $roll4Btn = document.getElementById('roll4Btn')
var $rollBoardBtn = document.getElementById('rollBoardBtn')

// Store board cards
var boardCards = []

function getUsedCardIndices(excludeHandKey) {
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

function getUsedCardIndicesForBoard() {
  var used = []
  // Add all hands' cards
  Object.keys(handCards).forEach(function (handKey) {
    handCards[handKey].forEach(function (card) {
      used.push(card.i)
    })
  })
  return used
}

function getRandomCards(count, excludedIndices) {
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

function cardIndexToCode(cardIndex) {
  var suits = ['s', 'h', 'c', 'd']
  var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
  var suit = Math.floor(cardIndex / 13)
  var rank = cardIndex % 13
  return ranks[rank] + suits[suit]
}

function rollHand(handKey, inputElement) {
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
            card.$el.style.zIndex = ''   // ✅ 关键，只在回收时加
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

function showHandByIndices(handKey, cardIndices) {
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

for (let i = 1; i <= HAND_COUNT; i++) {
  let handKey = 'hand' + i
  let input = document.getElementById(handKey + 'Input')
  let rollBtn = document.getElementById('roll' + i + 'Btn')

  if (!rollBtn || !input) continue

  rollBtn.addEventListener('click', function () {
    rollHand(handKey, input)
  })
}


$rollBoardBtn.addEventListener('click', function () {
  // ✅ 先回收旧公共牌
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
            card.$el.style.zIndex = ''
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

  // ✅ 再发新公共牌
  deck.queue(function (next) {
    var excludedIndices = getUsedCardIndicesForBoard()
    var randomCardIndices = getRandomCards(5, excludedIndices)
    $boardInput.value = randomCardIndices.map(cardIndexToCode).join('')

    var fontSize = 16
    var len = deck.cards.length

    randomCardIndices.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      boardCards.push(card)
      card.animateTo({
        delay: i * 250,
        duration: 250,
        x: Math.round((i - 2) * 80 * fontSize / 16),
        y: BOARD_Y,
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


// Then deal new cards
// deck.queue(function (next) {
//   var excludedIndices = getUsedCardIndicesForBoard()
//   var randomCardIndices = getRandomCards(5, excludedIndices)
//   // Update input field
//   var codes = randomCardIndices.map(cardIndexToCode).join('')
//   $boardInput.value = codes

//   var fontSize = 16
//   var len = deck.cards.length

//   randomCardIndices.forEach(function (cardIndex, i) {
//     var card = deck.cards.find(function (c) {
//       return c.i === cardIndex
//     })
//     if (!card) return

//     boardCards.push(card)

//     var delay = i * 250

//     card.animateTo({
//       delay: delay,
//       duration: 250,
//       x: Math.round((i - (randomCardIndices.length - 1) / 2) * 80 * fontSize / 16),
//       y: Math.round(-180 * fontSize / 16),
//       rot: 0,
//       onStart: function () {
//         card.$el.style.zIndex = len + i
//       },
//       onComplete: function () {
//         card.setSide('front')
//         if (i === randomCardIndices.length - 1) {
//           next()
//         }
//       }
//     })
//   })
// })

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

  // ✅ 回收旧公共牌
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
          onStart: function () {
            card.setSide('back')
            card.$el.style.zIndex = ''
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

  // ✅ 发指定公共牌
  deck.queue(function (next) {
    var fontSize = 16
    var len = deck.cards.length

    cardCodes.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      boardCards.push(card)

      card.animateTo({
        delay: i * 250,
        duration: 250,
        x: Math.round((i - (cardCodes.length - 1) / 2) * 80 * fontSize / 16),
        y: BOARD_Y,
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



function parseCardInput(input) {
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
deck.queue(function (next) {
  deck.shuffle()
  deck.shuffle()
  deck.sort()
  next()
})



// secret message..

var randomDelay = 10000 + 30000 * Math.random()


function printMessage(text) {
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
function updateConditionalRows() {
  var flushYes =
    document.querySelector('input[name="flush"][value="yes"]')?.checked || false

  var straightYes =
    document.querySelector('input[name="straight"][value="yes"]')?.checked || false

  var straightFlushYes =
    document.querySelector('input[name="straightFlush"][value="yes"]')?.checked || false

  // DOM
  var $straightFlushRow = document.getElementById('straightFlushRow')
  var $straightFlushMissingRow = document.getElementById('straightFlushMissingRow')
  var $straightMissingRow = document.getElementById('missingCardsRow')

  // 1️⃣ 是否显示「有没有同花顺」
  if (flushYes && straightYes) {
    $straightFlushRow.style.display = 'flex'
  } else {
    $straightFlushRow.style.display = 'none'
    $straightFlushMissingRow.style.display = 'none'
  }

  // 2️⃣ 是否显示「同花顺缺张」
  if (flushYes && straightYes && straightFlushYes) {
    $straightFlushMissingRow.style.display = 'flex'
  } else {
    $straightFlushMissingRow.style.display = 'none'
  }

  // ✅ 3️⃣ 是否显示「顺子缺张」（新增的规则）
  if (straightYes) {
    $straightMissingRow.style.display = 'flex'
  } else {
    $straightMissingRow.style.display = 'none'
  }
}




// Add event listeners for radio buttons
document.querySelectorAll('#analysisPanelContent input[type="radio"]').forEach(function (radio) {
  radio.addEventListener('change', updateConditionalRows)
})

// Auto-resize textarea
var $straightMissingInput = document.getElementById('straightMissingInput')
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}
function autoResizeMissingCards() {
  autoResizeTextarea($straightMissingInput)
}
$straightMissingInput.addEventListener('input', autoResizeMissingCards)

// Auto-resize board and hand inputs
var textareaInputs = [$boardInput]

for (var i = 1; i <= HAND_COUNT; i++) {
  var el = document.getElementById('hand' + i + 'Input')
  if (el) textareaInputs.push(el)
}
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

function startChipDrag(chip, clientX, clientY) {
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


function analyzeTexture(cardIndices) {
  if (cardIndices.length < 5) return null

  // rank: 0–12, suit: 0–3
  var ranks = cardIndices.map(i => i % 13)
  var suits = cardIndices.map(i => Math.floor(i / 13))

  /* 1️⃣ 有没有对子（公共牌中有两张 rank 相同） */
  var rankCount = {}
  ranks.forEach(r => rankCount[r] = (rankCount[r] || 0) + 1)
  var hasPair = Object.values(rankCount).some(c => c >= 2)

  /* 2️⃣ 有没有同花（三张花色相同即可） */
  var suitCount = {}
  suits.forEach(s => suitCount[s] = (suitCount[s] || 0) + 1)
  var hasFlush = Object.values(suitCount).some(c => c >= 3)

  /* 3️⃣ 能否组成顺子（顺子潜力） */
  var hasStraight = getStraightWindows(cardIndices).length > 0

  /* 4️⃣ 有没有同花顺（三张：顺子 + 同花） */
  var hasStraightFlush = false
  var suitGroups = {}

  cardIndices.forEach(i => {
    var suit = Math.floor(i / 13)
    var rank = i % 13
    if (!suitGroups[suit]) suitGroups[suit] = []
    suitGroups[suit].push(rank)
  })

  Object.values(suitGroups).forEach(ranksInSuit => {
    var r = [...new Set(ranksInSuit)].sort((a, b) => a - b)
    for (let i = 0; i < r.length - 2; i++) {
      if (r[i + 2] - r[i] <= 2) {
        hasStraightFlush = true
      }
    }
  })

  return {
    hasPair,
    hasFlush,
    hasStraight,
    hasStraightFlush
  }
}

function validateRow(key, actualValue) {
  var selected = document.querySelector(`input[name="${key}"]:checked`)
  var resultEl = document.querySelector(`.analysis-result[data-key="${key}"]`)

  if (!resultEl) return

  if (!selected) {
    resultEl.textContent = '未选择'
    resultEl.className = 'analysis-result'
    return
  }

  var userValue = selected.value === 'yes'

  if (userValue === actualValue) {
    resultEl.textContent = '正确'
    resultEl.className = 'analysis-result correct'
  } else {
    resultEl.textContent = '错误'
    resultEl.className = 'analysis-result wrong'
  }
}


document.getElementById('validateTextureBtn').addEventListener('click', function () {
  var input = document.getElementById('boardInput').value.trim().toLowerCase()
  if (!input) return

  var cards = parseCardInput(input)
  if (cards.length < 5) return

  var result = analyzeTexture(cards)

  validateRow('pair', result.hasPair)
  validateRow('flush', result.hasFlush)
  validateRow('straight', result.hasStraight)
  validateRow('straightFlush', result.hasStraightFlush)

  // ✅ 顺子缺张验证（只在用户选择“有顺子”时）
  var straightYes =
    document.querySelector('input[name="straight"][value="yes"]')?.checked

  if (straightYes) {
    const textarea = document.getElementById('straightMissingInput')
    const userText = textarea.value.trim()

    const straightResult = validateStraightMissing(cards, userText)

    const resultEl = document.getElementById('straightMissingResult')

    if (straightResult.ok) {
      textarea.classList.remove('wrong')
      textarea.classList.add('correct')

      resultEl.textContent = '正确'
      resultEl.className = 'analysis-result correct'
    } else {
      textarea.classList.remove('correct')
      textarea.classList.add('wrong')

      resultEl.textContent =
        '错误，漏了：' + straightResult.missing.join(' , ')
      resultEl.className = 'analysis-result wrong'
    }

  }

  // ✅ 同花顺缺张验证
  const sfYes =
    document.querySelector('input[name="straightFlush"][value="yes"]')?.checked

  if (sfYes) {
    const textarea = document.getElementById('sfMissingInput')
    const userText = textarea.value.trim()

    const expected = getExpectedStraightFlushMissing(cards)
    const user = new Set(normalizeUserSFInput(userText))

    const missing = []
    expected.forEach(e => {
      if (!user.has(e.toLowerCase())) missing.push(e)
    })

    const resultEl = document.getElementById('sfMissingResult')

    if (missing.length === 0) {
      textarea.classList.remove('wrong')
      textarea.classList.add('correct')

      resultEl.textContent = '正确'
      resultEl.className = 'analysis-result correct'
    } else {
      textarea.classList.remove('correct')
      textarea.classList.add('wrong')

      resultEl.textContent =
        '错误，漏了：' + missing.join(' , ')
      resultEl.className = 'analysis-result wrong'
    }

  }


})


function setRadio(name, yes) {
  var value = yes ? 'yes' : 'no'
  var el = document.querySelector(`input[name="${name}"][value="${value}"]`)
  if (el) el.checked = true
}

const RANK_CHAR_TO_VALUE = {
  a: 14, k: 13, q: 12, j: 11, t: 10
}

function cardIndexToRankValue(i) {
  return (i % 13) + 1
}

function normalizeBoardRanksWithAce(boardCards) {
  const set = new Set()
  boardCards.forEach(i => {
    const r = cardIndexToRankValue(i)
    if (r === 1) {
      set.add(1)
      set.add(14)
    } else {
      set.add(r)
    }
  })
  return [...set]
}

function getStraightWindows(boardCards) {
  const ranks = normalizeBoardRanksWithAce(boardCards)
  const windows = []

  for (let start = 1; start <= 10; start++) {
    const window = [start, start + 1, start + 2, start + 3, start + 4]
    const hit = window.filter(r => ranks.includes(r))
    if (hit.length >= 3) {
      windows.push({ window, hit })
    }
  }
  return windows
}

function rankToChar(r) {
  if (r === 14 || r === 1) return 'A'
  if (r === 13) return 'K'
  if (r === 12) return 'Q'
  if (r === 11) return 'J'
  if (r === 10) return 'T'
  return String(r)
}

function normalizeCombo(a, b) {
  return [rankToChar(a), rankToChar(b)].sort().join('')
}

function getExpectedStraightMissingCombos(boardCards) {
  const windows = getStraightWindows(boardCards)
  const boardRanks = normalizeBoardRanksWithAce(boardCards)
  const result = new Set()

  windows.forEach(({ window }) => {
    const missing = window.filter(r => !boardRanks.includes(r))

    if (missing.length === 2) {
      result.add(normalizeCombo(missing[0], missing[1]))
    }

    if (missing.length === 1) {
      result.add(`LIVE_${rankToChar(missing[0])}`)
    }
  })

  return result
}

function normalizeUserMissingInput(raw) {
  return raw
    .toUpperCase()              // ✅ 大小写统一
    .split(/\s+/)
    .filter(Boolean)
    .map(token => {
      if (token.startsWith('LIVE')) {
        const num = token.replace(/\D/g, '')
        return `LIVE_${num}`
      }
      return token.split('').sort().join('')
    })
}



function validateStraightMissing(boardCards, userInput) {
  const expected = getExpectedStraightMissingCombos(boardCards)
  const user = new Set(normalizeUserMissingInput(userInput))

  const missing = []
  expected.forEach(e => {
    if (!user.has(e)) missing.push(e)
  })

  return {
    ok: missing.length === 0,
    expected: [...expected],
    missing
  }
}

function cardIndexToRankSuit(i) {
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
  const suits = ['s', 'h', 'c', 'd']
  return ranks[i % 13] + suits[Math.floor(i / 13)]
}

function getFlushSuitGroups(boardCards) {
  const map = {}
  boardCards.forEach(i => {
    const suit = Math.floor(i / 13)
    const rank = (i % 13) + 1
    if (!map[suit]) map[suit] = new Set()
    map[suit].add(rank === 1 ? 14 : rank) // A 高
    map[suit].add(rank)
  })
  return map
}

function getExpectedStraightFlushMissing(boardCards) {
  const suitGroups = getFlushSuitGroups(boardCards)
  const result = new Set()

  Object.entries(suitGroups).forEach(([suit, ranksSet]) => {
    const ranks = [...ranksSet]

    for (let start = 1; start <= 10; start++) {
      const window = [start, start + 1, start + 2, start + 3, start + 4]
      const hit = window.filter(r => ranks.includes(r))

      if (hit.length >= 3 && hit.length <= 4) {
        const missing = window.filter(r => !ranks.includes(r))
        missing.forEach(r => {
          const rankChar = rankToChar(r)
          const suitChar = ['s', 'h', 'c', 'd'][suit]
          result.add(rankChar + suitChar)
        })
      }
    }
  })

  return result
}

function resetAnalysisPanel() {
  // 1️⃣ 清空所有 radio 选择
  document
    .querySelectorAll('#analysisPanelContent input[type="radio"]')
    .forEach(radio => {
      radio.checked = false
    })

  // 2️⃣ 清空所有结果文字
  document
    .querySelectorAll('.analysis-result')
    .forEach(el => {
      el.textContent = ''
      el.className = 'analysis-result'
    })

  // 3️⃣ 清空顺子缺张 textarea
  const straightMissing = document.getElementById('straightMissingInput')
  if (straightMissing) {
    straightMissing.value = ''
    straightMissing.classList.remove('correct', 'wrong')
    straightMissing.style.height = 'auto'
  }

  // 4️⃣ 清空同花顺缺张 textarea
  const sfMissing = document.getElementById('sfMissingInput')
  if (sfMissing) {
    sfMissing.value = ''
    sfMissing.classList.remove('correct', 'wrong')
    sfMissing.style.height = 'auto'
  }

  // 5️⃣ 隐藏条件显示的行
  const straightFlushRow = document.getElementById('straightFlushRow')
  const straightFlushMissingRow = document.getElementById('straightFlushMissingRow')
  const straightMissingRow = document.getElementById('missingCardsRow')

  if (straightFlushRow) straightFlushRow.style.display = 'none'
  if (straightFlushMissingRow) straightFlushMissingRow.style.display = 'none'
  if (straightMissingRow) straightMissingRow.style.display = 'none'
  const straightResult = document.getElementById('straightMissingResult')
  if (straightResult) straightResult.textContent = ''

  const sfResult = document.getElementById('sfMissingResult')
  if (sfResult) sfResult.textContent = ''
  straightResult.className = 'analysis-result'
  sfResult.className = 'analysis-result'
}

document
  .getElementById('resetTextureBtn')
  .addEventListener('click', function () {
    resetAnalysisPanel()
  })



function normalizeUserSFInput(raw) {
  return raw
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(s => s.trim())
}











