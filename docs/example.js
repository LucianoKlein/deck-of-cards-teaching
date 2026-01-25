
/* global Deck */

var prefix = Deck.prefix

var transform = prefix('transform')

var translate = Deck.translate

// ============================================
// Initial viewport offset (adjust these values)
// ============================================
var INITIAL_OFFSET_X = 0      // 水平偏移（正数向右，负数向左）
var INITIAL_OFFSET_Y = 50   // 垂直偏移（正数向下，负数向上）

// ============================================
// Card positions (adjust these for layout)
// ============================================
// Board (公共牌) position
var BOARD_X = -2               // 公共牌水平偏移（正数向右，负数向左）
var BOARD_Y = -208            // 公共牌垂直偏移（正数向下，负数向上）

// Board2 (第二组公共牌) position
var BOARD2_X = -6              // Board2水平偏移（正数向右，负数向左）
var BOARD2_Y = -47              // Board2垂直偏移（正数向下，负数向上）

// ============================================
// Chip stacks position - 筹码堆位置（百分比）
// ============================================
var HIGH_CHIPS_RIGHT = 50;       // High筹码距离右边的距离（百分比，如 2 表示 2%）
var HIGH_CHIPS_BOTTOM = 24;      // High筹码距离底部的距离（百分比）
var LOW_CHIPS_RIGHT = 45;     // Low筹码距离右边的距离（百分比）
var LOW_CHIPS_BOTTOM = 24;       // Low筹码距离底部的距离（百分比）

// Deck (牌堆) position - 牌堆位置由container控制，通过INITIAL_OFFSET调整
// 如果需要单独调整deck相对于container的位置，可以修改deck.js

// ============================================
// Hand card spacing - 每手牌内部卡片的间距
// ============================================
var HAND_CARD_SPACING_X = 20  // X方向（水平）卡片间距（数值越大，水平距离越远）
var HAND_CARD_SPACING_Y = 35  // Y方向（垂直）卡片间距（数值越大，垂直距离越远）

// ============================================
// Debug mode - set to true to log hand positions
// ============================================
var DEBUG_MODE = true  // 改成 false 关闭调试输出


var $container = document.getElementById('container')
var $topbar = document.getElementById('topbar')

// Apply chip stacks positions
var $highChipsStack = document.getElementById('highChipsStack')
var $lowChipsStack = document.getElementById('lowChipsStack')

if ($highChipsStack) {
  $highChipsStack.style.right = HIGH_CHIPS_RIGHT + '%'
  $highChipsStack.style.bottom = HIGH_CHIPS_BOTTOM + '%'
}

if ($lowChipsStack) {
  $lowChipsStack.style.right = LOW_CHIPS_RIGHT + '%'
  $lowChipsStack.style.bottom = LOW_CHIPS_BOTTOM + '%'
}

// Create background layer with image
var $backgroundLayer = document.createElement('div')
$backgroundLayer.id = 'background-layer'

var $backgroundImg = document.createElement('img')
$backgroundImg.src = 'background/background.png'
$backgroundImg.alt = 'Background'
$backgroundLayer.appendChild($backgroundImg)

document.body.insertBefore($backgroundLayer, document.body.firstChild)

// Apply initial offset
$container.style.left = 'calc(50% + ' + INITIAL_OFFSET_X + 'px)'
$container.style.top = 'calc(50% + 1.5rem + ' + INITIAL_OFFSET_Y + 'px)'
$backgroundLayer.style[transform] = translate(INITIAL_OFFSET_X + 'px', INITIAL_OFFSET_Y + 'px')

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')
var $poker = document.createElement('button')
var $flip = document.createElement('button')

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'
$poker.textContent = 'Poker'
$flip.textContent = 'Flip'

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

// Get board buttons from HTML
var $board = document.getElementById('boardBtn')
var $board2 = document.getElementById('board2Btn')

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

$shuffle.addEventListener('click', function () {
  clearWinnerHighlights()

  // Flip all cards to back side
  deck.cards.forEach(function (card) {
    card.setSide('back')
  })

  // Reset chips to original positions
  resetChipsPosition()

  deck.shuffle()
  deck.shuffle()
})
$sort.addEventListener('click', function () {
  clearWinnerHighlights()
  deck.sort()
})
$bysuit.addEventListener('click', function () {
  clearWinnerHighlights()
  deck.sort(true) // sort reversed
  deck.bysuit()
})
$fan.addEventListener('click', function () {
  clearWinnerHighlights()
  deck.fan()
})
$flip.addEventListener('click', function () {
  clearWinnerHighlights()
  deck.flip()
})
$poker.addEventListener('click', function () {
  clearWinnerHighlights()
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
var $board2Input = document.getElementById('board2Input')

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
var $validateHandsBtn = document.getElementById('validateHandsBtn')
var $clearMarkingBtn = document.getElementById('clearMarkingBtn')
var $submitBtn = document.getElementById('submitBtn')
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
    case 'fivecard':
      return 5
    case 'a5lowball':
      return 5
    case '27lowball':
      return 5
    case 'badugi':
      return 4
    default:
      return 4
  }
}

// Check if current game mode needs board cards
function needsBoardCards() {
  var selectedMode = document.querySelector('input[name="gameMode"]:checked')
  if (!selectedMode) return true
  return selectedMode.value !== 'fivecard' &&
         selectedMode.value !== 'a5lowball' &&
         selectedMode.value !== '27lowball' &&
         selectedMode.value !== 'badugi'
}

// Enable/disable board controls based on game mode
function updateBoardControls() {
  var needsBoard = needsBoardCards()

  var boardElements = [
    document.getElementById('boardInput'),
    document.getElementById('board2Input'),
    document.getElementById('boardBtn'),
    document.getElementById('board2Btn'),
    document.getElementById('rollBoardBtn'),
    document.getElementById('rollBoard2Btn')
  ]

  boardElements.forEach(function(el) {
    if (el) {
      el.disabled = !needsBoard
      if (!needsBoard) {
        el.style.opacity = '0.5'
        el.style.cursor = 'not-allowed'
      } else {
        el.style.opacity = '1'
        el.style.cursor = ''
      }
    }
  })
}

// Listen for game mode changes
document.querySelectorAll('input[name="gameMode"]').forEach(function(radio) {
  radio.addEventListener('change', updateBoardControls)
})

// Initialize board controls on page load
updateBoardControls()

// Hand positions (y offset for each hand row)
// dx/dy: 叠放方向 (-1 表示向左/上, +1 表示向右/下)
var handPositions = {
  // 上排（明显上移 + 拉开中间）
  hand1: { x: -450, y: 150, dx: 1, dy: -1 },   // 左下到右上
  hand2: { x: -713, y: 79, dx: 1, dy: -1 },    // 左下到右上
  hand3: { x: -680, y: -320, dx: 1, dy: 1 },   // 左上到右下
  hand4: { x: -300, y: -350, dx: -1, dy: 1 },  // 右上到左下

  // 下排（明显下移 + 拉开中间）
  hand5: { x: 339, y: -351, dx: -1, dy: 1 },   // 右上到左下
  hand6: { x: 780, y: -210, dx: -1, dy: 1 },   // 右上到左下
  hand7: { x: 695, y: 51, dx: -1, dy: -1 },    // 右下到左上
  hand8: { x: 457, y: 154, dx: -1, dy: -1 }    // 右下到左上

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

      // Mark card with hand key for debugging
      card.handKey = handKey

      var delay = i * 150

      card.animateTo({
        delay: delay,
        duration: 200,
        x: pos.x + (pos.dx || -1) * i * HAND_CARD_SPACING_X * fontSize / 16,
        y: pos.y + (pos.dy || 1) * i * HAND_CARD_SPACING_Y * fontSize / 16,
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
    clearWinnerHighlights()
    showHand(handKey, input)
  })
}


// Roll buttons
var $roll1Btn = document.getElementById('roll1Btn')
var $roll2Btn = document.getElementById('roll2Btn')
var $roll3Btn = document.getElementById('roll3Btn')
var $roll4Btn = document.getElementById('roll4Btn')
var $rollBoardBtn = document.getElementById('rollBoardBtn')
var $rollBoard2Btn = document.getElementById('rollBoard2Btn')

// Store board cards
var boardCards = []
var board2Cards = []

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
  // Add board cards
  boardCards.forEach(function (card) {
    used.push(card.i)
  })
  // Add board2 cards
  board2Cards.forEach(function (card) {
    used.push(card.i)
  })
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

      // Mark card with hand key for debugging
      card.handKey = handKey

      var delay = i * 150

      card.animateTo({
        delay: delay,
        duration: 200,
        x: pos.x + (pos.dx || -1) * i * HAND_CARD_SPACING_X * fontSize / 16,
        y: pos.y + (pos.dy || 1) * i * HAND_CARD_SPACING_Y * fontSize / 16,
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

      // Mark card with hand key for debugging
      card.handKey = handKey

      var delay = i * 150

      card.animateTo({
        delay: delay,
        duration: 200,
        x: pos.x + (pos.dx || -1) * i * HAND_CARD_SPACING_X * fontSize / 16,
        y: pos.y + (pos.dy || 1) * i * HAND_CARD_SPACING_Y * fontSize / 16,
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
    clearWinnerHighlights()
    rollHand(handKey, input)
  })
}


$rollBoardBtn.addEventListener('click', function () {
  clearWinnerHighlights()

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

      // Mark card as board card for debugging
      card.isBoardCard = true
      card.boardIndex = i

      card.animateTo({
        delay: i * 250,
        duration: 250,
        x: BOARD_X + Math.round((i - 2) * 80 * fontSize / 16),
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

// Roll Board2 button
$rollBoard2Btn.addEventListener('click', function () {
  clearWinnerHighlights()

  // 先回收旧公共牌
  if (board2Cards.length > 0) {
    deck.queue(function (next) {
      var cardsToReturn = board2Cards.slice()
      board2Cards = []

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

  // 再发新公共牌
  deck.queue(function (next) {
    var excludedIndices = getUsedCardIndicesForBoard()
    var randomCardIndices = getRandomCards(5, excludedIndices)
    $board2Input.value = randomCardIndices.map(cardIndexToCode).join('')

    var fontSize = 16
    var len = deck.cards.length

    randomCardIndices.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      board2Cards.push(card)

      // Mark card as board2 card for debugging
      card.isBoard2Card = true
      card.board2Index = i

      card.animateTo({
        delay: i * 250,
        duration: 250,
        x: BOARD2_X + Math.round((i - 2) * 80 * fontSize / 16),
        y: BOARD2_Y,
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
  clearWinnerHighlights()

  // Flip all hand cards to the same side
  var targetSide = handsFlippedToFront ? 'back' : 'front'
  Object.keys(handCards).forEach(function (handKey) {
    handCards[handKey].forEach(function (card) {
      card.setSide(targetSide)
    })
  })
  handsFlippedToFront = !handsFlippedToFront
})

// Clear Marking Button - Clear all winner highlights
$clearMarkingBtn.addEventListener('click', function () {
  clearWinnerHighlights()
})

// SUBMIT Button - Check if chip is placed correctly
$submitBtn.addEventListener('click', function () {
  var gameMode = document.querySelector('input[name="gameMode"]:checked')
  if (!gameMode) {
    alert('Please select a game mode')
    return
  }

  var isFiveCardDraw = gameMode.value === 'fivecard'
  var isA5Lowball = gameMode.value === 'a5lowball'
  var is27Lowball = gameMode.value === '27lowball'
  var isBadugi = gameMode.value === 'badugi'
  var boardCardsPS = []

  // Get board cards only if needed
  if (!isFiveCardDraw && !isA5Lowball && !is27Lowball && !isBadugi) {
    var boardInput = $boardInput.value.trim().toLowerCase()
    if (!boardInput) {
      alert('Please set Board1 cards first')
      return
    }

    var boardCardIndices = parseCardInput(boardInput)
    if (boardCardIndices.length < 5) {
      alert('Board1 must have 5 cards')
      return
    }

    // Convert card indices to poker solver format
    boardCardsPS = boardCardIndices.map(function (i) {
      return cardIndexToPokerSolverFormat(i)
    })
  }

  var winners = []
  var bestRank = null
  var bestLowball = null

  // Evaluate each hand
  for (var i = 1; i <= HAND_COUNT; i++) {
    var handKey = 'hand' + i
    var handInput = document.getElementById(handKey + 'Input').value.trim().toLowerCase()

    if (!handInput) continue

    var handCardIndices = parseCardInput(handInput)
    if (handCardIndices.length === 0) continue

    var handCardsPS = handCardIndices.map(function (idx) {
      return cardIndexToPokerSolverFormat(idx)
    })

    if (isA5Lowball) {
      // A-5 Lowball: evaluate lowball hand
      if (handCardIndices.length !== 5) continue
      var lowballResult = evaluateA5Lowball(handCardsPS)

      if (!lowballResult) continue

      if (!bestLowball) {
        bestLowball = lowballResult
        winners = [handKey]
      } else {
        var comparison = compareA5Lowball(lowballResult, bestLowball)
        if (comparison < 0) {
          // New best low hand
          bestLowball = lowballResult
          winners = [handKey]
        } else if (comparison === 0) {
          // Tie
          winners.push(handKey)
        }
      }
    } else if (is27Lowball) {
      // 2-7 Lowball: evaluate lowball hand
      if (handCardIndices.length !== 5) continue
      var lowball27Result = evaluate27Lowball(handCardsPS)

      if (!lowball27Result) continue

      if (!bestLowball) {
        bestLowball = lowball27Result
        winners = [handKey]
      } else {
        var comparison27 = compare27Lowball(lowball27Result, bestLowball)
        if (comparison27 < 0) {
          // New best low hand
          bestLowball = lowball27Result
          winners = [handKey]
        } else if (comparison27 === 0) {
          // Tie
          winners.push(handKey)
        }
      }
    } else if (isBadugi) {
      // Badugi: evaluate badugi hand
      if (handCardIndices.length !== 4) continue
      var badugiResult = evaluateBadugi(handCardsPS)

      if (!badugiResult) continue

      if (!bestLowball) {
        bestLowball = badugiResult
        winners = [handKey]
      } else {
        var comparisonBadugi = compareBadugi(badugiResult, bestLowball)
        if (comparisonBadugi < 0) {
          // New best badugi
          bestLowball = badugiResult
          winners = [handKey]
        } else if (comparisonBadugi === 0) {
          // Tie
          winners.push(handKey)
        }
      }
    } else {
      // High hand games
      var handResult

      if (isFiveCardDraw) {
        // 5 Card Draw: use only the 5 cards in hand
        if (handCardIndices.length !== 5) continue
        handResult = Hand.solve(handCardsPS)
      } else if (gameMode.value === 'holdem') {
        if (handCardIndices.length !== 2) continue
        var allCards = handCardsPS.concat(boardCardsPS)
        handResult = Hand.solve(allCards)
      } else if (gameMode.value === 'omaha') {
        if (handCardIndices.length !== 4) continue
        handResult = solveOmahaHand(handCardsPS, boardCardsPS)
      } else if (gameMode.value === 'bigo') {
        if (handCardIndices.length !== 5) continue
        handResult = solveOmahaHand(handCardsPS, boardCardsPS)
      }

      if (!handResult) continue

      if (!bestRank || handResult.rank > bestRank.rank) {
        bestRank = handResult
        winners = [handKey]
      } else if (handResult.rank === bestRank.rank) {
        var comparison = Hand.winners([bestRank, handResult])
        if (comparison.length === 2) {
          winners.push(handKey)
        } else if (comparison[0] === handResult) {
          bestRank = handResult
          winners = [handKey]
        }
      }
    }
  }

  if (winners.length === 0) {
    alert('No valid hands to compare')
    return
  }

  // Check if correct chip is placed on the winning hand
  var chipPlaced = false

  if (isA5Lowball || is27Lowball || isBadugi) {
    chipPlaced = checkLowChipPlacement(winners)
  } else {
    chipPlaced = checkHighChipPlacement(winners)
  }

  if (chipPlaced) {
    showCorrectFeedback()
  } else {
    showIncorrectFeedback()
  }
})

// Helper function to check if High Chip is placed on winning hand
function checkHighChipPlacement(winners) {
  // Get all High chips
  var highChips = document.querySelectorAll('.chip-high')

  // Check each winner hand
  for (var w = 0; w < winners.length; w++) {
    var handKey = winners[w]
    var cards = handCards[handKey]

    if (!cards || cards.length === 0) continue

    // Get bounding box of all cards in this hand
    var minX = Infinity, minY = Infinity
    var maxX = -Infinity, maxY = -Infinity

    cards.forEach(function(card) {
      var rect = card.$el.getBoundingClientRect()
      minX = Math.min(minX, rect.left)
      minY = Math.min(minY, rect.top)
      maxX = Math.max(maxX, rect.right)
      maxY = Math.max(maxY, rect.bottom)
    })

    // Check if any High chip is within or near this hand's area
    for (var i = 0; i < highChips.length; i++) {
      var chipRect = highChips[i].getBoundingClientRect()
      var chipCenterX = chipRect.left + chipRect.width / 2
      var chipCenterY = chipRect.top + chipRect.height / 2

      // Expand the hand area by 100px in all directions for tolerance
      var margin = 100
      if (chipCenterX >= minX - margin && chipCenterX <= maxX + margin &&
          chipCenterY >= minY - margin && chipCenterY <= maxY + margin) {
        return true
      }
    }
  }

  return false
}

// Helper function to check if Low Chip is placed on winning hand
function checkLowChipPlacement(winners) {
  // Get all Low chips
  var lowChips = document.querySelectorAll('.chip-low')

  // Check each winner hand
  for (var w = 0; w < winners.length; w++) {
    var handKey = winners[w]
    var cards = handCards[handKey]

    if (!cards || cards.length === 0) continue

    // Get bounding box of all cards in this hand
    var minX = Infinity, minY = Infinity
    var maxX = -Infinity, maxY = -Infinity

    cards.forEach(function(card) {
      var rect = card.$el.getBoundingClientRect()
      minX = Math.min(minX, rect.left)
      minY = Math.min(minY, rect.top)
      maxX = Math.max(maxX, rect.right)
      maxY = Math.max(maxY, rect.bottom)
    })

    // Check if any Low chip is within or near this hand's area
    for (var i = 0; i < lowChips.length; i++) {
      var chipRect = lowChips[i].getBoundingClientRect()
      var chipCenterX = chipRect.left + chipRect.width / 2
      var chipCenterY = chipRect.top + chipRect.height / 2

      // Expand the hand area by 100px in all directions for tolerance
      var margin = 100
      if (chipCenterX >= minX - margin && chipCenterX <= maxX + margin &&
          chipCenterY >= minY - margin && chipCenterY <= maxY + margin) {
        return true
      }
    }
  }

  return false
}

// Show correct feedback with fireworks
function showCorrectFeedback() {
  var overlay = document.getElementById('feedbackOverlay')
  var icon = document.getElementById('feedbackIcon')
  var text = document.getElementById('feedbackText')

  icon.textContent = '🎉'
  text.textContent = 'Correct!'
  text.style.color = '#4CAF50'

  overlay.classList.add('show')

  // Create fireworks
  createFireworks()

  // Hide after 2 seconds
  setTimeout(function() {
    overlay.classList.remove('show')
    overlay.classList.add('hide')
    setTimeout(function() {
      overlay.classList.remove('hide')
    }, 300)
  }, 2000)
}

// Show incorrect feedback with sad face
function showIncorrectFeedback() {
  var overlay = document.getElementById('feedbackOverlay')
  var icon = document.getElementById('feedbackIcon')
  var text = document.getElementById('feedbackText')

  icon.textContent = '😢'
  text.textContent = 'Incorrect!'
  text.style.color = '#f44336'

  overlay.classList.add('show')

  // Hide after 2 seconds
  setTimeout(function() {
    overlay.classList.remove('show')
    overlay.classList.add('hide')
    setTimeout(function() {
      overlay.classList.remove('hide')
    }, 300)
  }, 2000)
}

// Create fireworks effect
function createFireworks() {
  var overlay = document.getElementById('feedbackOverlay')
  var colors = ['#FF1744', '#F50057', '#D500F9', '#651FFF', '#3D5AFE', '#2979FF', '#00B0FF', '#00E5FF']

  // Create multiple firework bursts
  for (var burst = 0; burst < 5; burst++) {
    setTimeout(function() {
      var centerX = Math.random() * window.innerWidth
      var centerY = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.1

      // Create particles for each burst
      for (var i = 0; i < 30; i++) {
        var particle = document.createElement('div')
        particle.className = 'firework'
        particle.style.left = centerX + 'px'
        particle.style.top = centerY + 'px'
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]

        var angle = (Math.PI * 2 * i) / 30
        var velocity = 100 + Math.random() * 100
        var tx = Math.cos(angle) * velocity
        var ty = Math.sin(angle) * velocity

        particle.style.setProperty('--tx', tx + 'px')
        particle.style.setProperty('--ty', ty + 'px')

        overlay.appendChild(particle)

        // Remove particle after animation
        setTimeout(function(p) {
          return function() {
            if (p.parentNode) {
              p.parentNode.removeChild(p)
            }
          }
        }(particle), 1000)
      }
    }, burst * 200)
  }
}

// Helper function to clear winner highlights
function clearWinnerHighlights() {
  deck.cards.forEach(function (card) {
    card.$el.classList.remove('winner-card')
  })
  if (currentHighBadge) {
    document.body.removeChild(currentHighBadge)
    currentHighBadge = null
  }
  if (currentLowBadge) {
    document.body.removeChild(currentLowBadge)
    currentLowBadge = null
  }
}

// Validate Hands Button - Find the winning hand
var currentHighBadge = null
var currentLowBadge = null

$validateHandsBtn.addEventListener('click', function () {
  // Remove previous winner highlights and badges
  clearWinnerHighlights()

  var gameMode = document.querySelector('input[name="gameMode"]:checked')
  if (!gameMode) {
    alert('Please select a game mode')
    return
  }

  var isFiveCardDraw = gameMode.value === 'fivecard'
  var isA5Lowball = gameMode.value === 'a5lowball'
  var is27Lowball = gameMode.value === '27lowball'
  var isBadugi = gameMode.value === 'badugi'
  var boardCardsPS = []

  // Get board cards only if needed
  if (!isFiveCardDraw && !isA5Lowball && !is27Lowball && !isBadugi) {
    var boardInput = $boardInput.value.trim().toLowerCase()
    if (!boardInput) {
      alert('Please set Board1 cards first')
      return
    }

    var boardCardIndices = parseCardInput(boardInput)
    if (boardCardIndices.length < 5) {
      alert('Board1 must have 5 cards')
      return
    }

    // Convert card indices to poker solver format
    boardCardsPS = boardCardIndices.map(function (i) {
      return cardIndexToPokerSolverFormat(i)
    })
  }

  var winners = []
  var bestRank = null
  var bestLowball = null

  // Evaluate each hand
  for (var i = 1; i <= HAND_COUNT; i++) {
    var handKey = 'hand' + i
    var handInput = document.getElementById(handKey + 'Input').value.trim().toLowerCase()

    if (!handInput) continue

    var handCardIndices = parseCardInput(handInput)
    if (handCardIndices.length === 0) continue

    var handCardsPS = handCardIndices.map(function (i) {
      return cardIndexToPokerSolverFormat(i)
    })

    if (isA5Lowball) {
      // A-5 Lowball: evaluate lowball hand
      if (handCardIndices.length !== 5) continue
      var lowballResult = evaluateA5Lowball(handCardsPS)

      if (!lowballResult) continue

      if (!bestLowball) {
        bestLowball = lowballResult
        winners = [handKey]
      } else {
        var comparison = compareA5Lowball(lowballResult, bestLowball)
        if (comparison < 0) {
          // New best low hand
          bestLowball = lowballResult
          winners = [handKey]
        } else if (comparison === 0) {
          // Tie
          winners.push(handKey)
        }
      }
    } else if (is27Lowball) {
      // 2-7 Lowball: evaluate lowball hand
      if (handCardIndices.length !== 5) continue
      var lowball27Result = evaluate27Lowball(handCardsPS)

      if (!lowball27Result) continue

      if (!bestLowball) {
        bestLowball = lowball27Result
        winners = [handKey]
      } else {
        var comparison27 = compare27Lowball(lowball27Result, bestLowball)
        if (comparison27 < 0) {
          // New best low hand
          bestLowball = lowball27Result
          winners = [handKey]
        } else if (comparison27 === 0) {
          // Tie
          winners.push(handKey)
        }
      }
    } else if (isBadugi) {
      // Badugi: evaluate badugi hand
      if (handCardIndices.length !== 4) continue
      var badugiResult = evaluateBadugi(handCardsPS)

      if (!badugiResult) continue

      if (!bestLowball) {
        bestLowball = badugiResult
        winners = [handKey]
      } else {
        var comparisonBadugi = compareBadugi(badugiResult, bestLowball)
        if (comparisonBadugi < 0) {
          // New best badugi
          bestLowball = badugiResult
          winners = [handKey]
        } else if (comparisonBadugi === 0) {
          // Tie
          winners.push(handKey)
        }
      }
    } else {
      // High hand games
      var handResult

      if (isFiveCardDraw) {
        // 5 Card Draw: use only the 5 cards in hand
        if (handCardIndices.length !== 5) continue
        handResult = Hand.solve(handCardsPS)
      } else if (gameMode.value === 'holdem') {
        // Hold'em: use all hand cards + all board cards
        if (handCardIndices.length !== 2) continue
        var allCards = handCardsPS.concat(boardCardsPS)
        handResult = Hand.solve(allCards)
      } else if (gameMode.value === 'omaha') {
        // Omaha: must use exactly 2 from hand + exactly 3 from board
        if (handCardIndices.length !== 4) continue
        handResult = solveOmahaHand(handCardsPS, boardCardsPS)
      } else if (gameMode.value === 'bigo') {
        // Big O: must use exactly 2 from hand + exactly 3 from board
        if (handCardIndices.length !== 5) continue
        handResult = solveOmahaHand(handCardsPS, boardCardsPS)
      }

      if (!handResult) continue

      if (!bestRank || handResult.rank > bestRank.rank) {
        bestRank = handResult
        winners = [handKey]
      } else if (handResult.rank === bestRank.rank) {
        // Compare hands of same rank
        var comparison = Hand.winners([bestRank, handResult])
        if (comparison.length === 2) {
          // Tie
          winners.push(handKey)
        } else if (comparison[0] === handResult) {
          // New winner
          bestRank = handResult
          winners = [handKey]
        }
      }
    }
  }

  if (winners.length === 0) {
    alert('No valid hands to compare')
    return
  }

  // Highlight winner cards on the table
  winners.forEach(function (handKey) {
    var cards = handCards[handKey]
    if (cards && cards.length > 0) {
      cards.forEach(function (card) {
        card.$el.classList.add('winner-card')
      })

      // Add badge next to the first winner's hand
      if (handKey === winners[0]) {
        // Calculate center position of the hand
        var firstCard = cards[0]
        var lastCard = cards[cards.length - 1]

        var rect1 = firstCard.$el.getBoundingClientRect()
        var rect2 = lastCard.$el.getBoundingClientRect()

        var centerX = (rect1.left + rect2.right) / 2
        var centerY = (rect1.top + rect2.bottom) / 2

        var badge = document.createElement('div')

        if (isA5Lowball || is27Lowball || isBadugi) {
          badge.className = 'low-badge'
          badge.textContent = 'LOW'
          badge.style.left = (centerX - 25) + 'px'
          badge.style.top = (centerY - 25) + 'px'
          document.body.appendChild(badge)
          currentLowBadge = badge
        } else {
          badge.className = 'high-badge'
          badge.textContent = 'HIGH'
          badge.style.left = (centerX - 25) + 'px'
          badge.style.top = (centerY - 25) + 'px'
          document.body.appendChild(badge)
          currentHighBadge = badge
        }
      }
    }
  })

  // Show result in console
  var winnerText = winners.length > 1 ? 'Tie between ' + winners.join(', ') : winners[0] + ' wins'
  if (isA5Lowball || is27Lowball) {
    console.log(winnerText + ' (Best Low)')
  } else if (isBadugi) {
    console.log(winnerText + ' (' + bestLowball.cardCount + '-card Badugi)')
  } else {
    console.log(winnerText + ' with ' + bestRank.descr)
  }
})

// Helper function to convert card index to poker solver format
function cardIndexToPokerSolverFormat(cardIndex) {
  var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
  var suits = ['s', 'h', 'c', 'd']
  var rank = cardIndex % 13
  var suit = Math.floor(cardIndex / 13)
  return ranks[rank] + suits[suit]
}

// Helper function to solve Omaha hands (must use exactly 2 from hand + 3 from board)
function solveOmahaHand(handCards, boardCards) {
  var bestHand = null

  // Try all combinations of 2 cards from hand
  for (var i = 0; i < handCards.length - 1; i++) {
    for (var j = i + 1; j < handCards.length; j++) {
      var twoFromHand = [handCards[i], handCards[j]]

      // Try all combinations of 3 cards from board
      for (var a = 0; a < boardCards.length - 2; a++) {
        for (var b = a + 1; b < boardCards.length - 1; b++) {
          for (var c = b + 1; c < boardCards.length; c++) {
            var threeFromBoard = [boardCards[a], boardCards[b], boardCards[c]]
            var fiveCards = twoFromHand.concat(threeFromBoard)
            var hand = Hand.solve(fiveCards)

            if (!bestHand || hand.rank > bestHand.rank) {
              bestHand = hand
            } else if (hand.rank === bestHand.rank) {
              var comparison = Hand.winners([bestHand, hand])
              if (comparison[0] === hand) {
                bestHand = hand
              }
            }
          }
        }
      }
    }
  }

  return bestHand
}

// A-5 Lowball hand evaluation
// Returns a score where LOWER is BETTER
function evaluateA5Lowball(handCardsPS) {
  if (handCardsPS.length !== 5) return null

  // Convert cards to rank values (A=1, 2-9=face, T=10, J=11, Q=12, K=13)
  var ranks = handCardsPS.map(function(card) {
    var rankChar = card[0]
    if (rankChar === 'A') return 1
    if (rankChar === 'T') return 10
    if (rankChar === 'J') return 11
    if (rankChar === 'Q') return 12
    if (rankChar === 'K') return 13
    return parseInt(rankChar)
  })

  // Count rank frequencies
  var rankCount = {}
  ranks.forEach(function(r) {
    rankCount[r] = (rankCount[r] || 0) + 1
  })

  var counts = Object.values(rankCount).sort(function(a, b) { return b - a })

  // Determine hand type (pairs are bad in lowball)
  var handType = 0
  if (counts[0] === 4) {
    handType = 7 // Four of a kind (worst)
  } else if (counts[0] === 3 && counts[1] === 2) {
    handType = 6 // Full house
  } else if (counts[0] === 3) {
    handType = 4 // Three of a kind
  } else if (counts[0] === 2 && counts[1] === 2) {
    handType = 3 // Two pair
  } else if (counts[0] === 2) {
    handType = 2 // One pair
  } else {
    handType = 0 // High card (best category)
  }

  // Sort ranks from high to low
  var sortedRanks = ranks.slice().sort(function(a, b) { return b - a })

  return {
    handType: handType,
    ranks: sortedRanks,
    score: calculateA5LowballScore(handType, sortedRanks)
  }
}

// Calculate numeric score for A-5 Lowball (lower is better)
function calculateA5LowballScore(handType, sortedRanks) {
  // handType * 10000000000 (10 billion) + rank comparisons
  // This ensures handType always dominates over rank values
  var score = handType * 10000000000

  // Add ranks (multiplied by position weight)
  for (var i = 0; i < sortedRanks.length; i++) {
    score += sortedRanks[i] * Math.pow(100, 4 - i)
  }

  return score
}

// Compare two A-5 Lowball hands
// Returns -1 if hand1 is better (lower), 1 if hand2 is better, 0 if tie
function compareA5Lowball(hand1, hand2) {
  if (hand1.score < hand2.score) return -1
  if (hand1.score > hand2.score) return 1
  return 0
}

// 2-7 Lowball hand evaluation
// Returns a score where LOWER is BETTER
function evaluate27Lowball(handCardsPS) {
  if (handCardsPS.length !== 5) return null

  // Convert cards to rank values (A=14, 2-9=face, T=10, J=11, Q=12, K=13)
  var ranks = handCardsPS.map(function(card) {
    var rankChar = card[0]
    if (rankChar === 'A') return 14 // A is HIGH in 2-7
    if (rankChar === 'T') return 10
    if (rankChar === 'J') return 11
    if (rankChar === 'Q') return 12
    if (rankChar === 'K') return 13
    return parseInt(rankChar)
  })

  // Get suits
  var suits = handCardsPS.map(function(card) {
    return card[1]
  })

  // Count rank frequencies
  var rankCount = {}
  ranks.forEach(function(r) {
    rankCount[r] = (rankCount[r] || 0) + 1
  })

  var counts = Object.values(rankCount).sort(function(a, b) { return b - a })

  // Check for flush
  var isFlush = suits.every(function(s) { return s === suits[0] })

  // Check for straight
  var sortedRanks = ranks.slice().sort(function(a, b) { return a - b })
  var isStraight = true
  for (var i = 0; i < sortedRanks.length - 1; i++) {
    if (sortedRanks[i + 1] - sortedRanks[i] !== 1) {
      isStraight = false
      break
    }
  }

  // Determine hand type (higher is worse in 2-7 Lowball)
  var handType = 0
  if (counts[0] === 4) {
    handType = 7 // Four of a kind (worst)
  } else if (counts[0] === 3 && counts[1] === 2) {
    handType = 6 // Full house
  } else if (isFlush) {
    handType = 5 // Flush (bad in 2-7)
  } else if (isStraight) {
    handType = 4 // Straight (bad in 2-7)
  } else if (counts[0] === 3) {
    handType = 3 // Three of a kind
  } else if (counts[0] === 2 && counts[1] === 2) {
    handType = 2 // Two pair
  } else if (counts[0] === 2) {
    handType = 1 // One pair
  } else {
    handType = 0 // High card (best category)
  }

  // Sort ranks from high to low for comparison
  var sortedRanksDesc = ranks.slice().sort(function(a, b) { return b - a })

  return {
    handType: handType,
    ranks: sortedRanksDesc,
    score: calculate27LowballScore(handType, sortedRanksDesc)
  }
}

// Calculate numeric score for 2-7 Lowball (lower is better)
function calculate27LowballScore(handType, sortedRanks) {
  // handType * 10000000000 (10 billion) + rank comparisons
  // This ensures handType always dominates over rank values
  var score = handType * 10000000000

  // Add ranks (multiplied by position weight)
  for (var i = 0; i < sortedRanks.length; i++) {
    score += sortedRanks[i] * Math.pow(100, 4 - i)
  }

  return score
}

// Compare two 2-7 Lowball hands
// Returns -1 if hand1 is better (lower), 1 if hand2 is better, 0 if tie
function compare27Lowball(hand1, hand2) {
  if (hand1.score < hand2.score) return -1
  if (hand1.score > hand2.score) return 1
  return 0
}

// Badugi hand evaluation
// Returns the best badugi hand (most unique suits + lowest ranks)
function evaluateBadugi(handCardsPS) {
  if (handCardsPS.length !== 4) return null

  // Convert cards to rank and suit
  var cards = handCardsPS.map(function(card) {
    var rankChar = card[0]
    var suit = card[1]
    var rank

    if (rankChar === 'A') rank = 1  // A is lowest in Badugi
    else if (rankChar === 'T') rank = 10
    else if (rankChar === 'J') rank = 11
    else if (rankChar === 'Q') rank = 12
    else if (rankChar === 'K') rank = 13
    else rank = parseInt(rankChar)

    return { rank: rank, suit: suit }
  })

  // Find best badugi combination
  // We want maximum unique suits with minimum ranks
  var bestHand = findBestBadugi(cards)

  return bestHand
}

// Find the best badugi combination from 4 cards
function findBestBadugi(cards) {
  // Try all possible combinations, from 4 cards down to 1
  for (var count = 4; count >= 1; count--) {
    var combinations = getCombinations(cards, count)
    var validBadugis = []

    combinations.forEach(function(combo) {
      if (isValidBadugi(combo)) {
        validBadugis.push(combo)
      }
    })

    if (validBadugis.length > 0) {
      // Find the lowest hand among valid badugis
      var best = validBadugis[0]
      for (var i = 1; i < validBadugis.length; i++) {
        if (isBadugiLower(validBadugis[i], best)) {
          best = validBadugis[i]
        }
      }

      // Debug logging
      if (DEBUG_MODE) {
        console.log(count + '-card badugi found:')
        console.log('Valid combinations:', validBadugis.map(function(b) {
          return b.map(function(c) { return c.rank + c.suit }).join(' ')
        }))
        console.log('Best:', best.map(function(c) { return c.rank + c.suit }).join(' '))
      }

      // Sort ranks from high to low for comparison
      var ranks = best.map(function(c) { return c.rank }).sort(function(a, b) { return b - a })

      return {
        cardCount: count,
        ranks: ranks,
        score: calculateBadugiScore(count, ranks)
      }
    }
  }

  return null
}

// Check if a combination is a valid badugi (no duplicate suits, no duplicate ranks)
function isValidBadugi(cards) {
  var suits = cards.map(function(c) { return c.suit })
  var ranks = cards.map(function(c) { return c.rank })

  // Check for duplicate suits
  var uniqueSuits = new Set(suits)
  if (uniqueSuits.size !== cards.length) return false

  // Check for duplicate ranks
  var uniqueRanks = new Set(ranks)
  if (uniqueRanks.size !== cards.length) return false

  return true
}

// Check if badugi1 is lower (better) than badugi2
function isBadugiLower(badugi1, badugi2) {
  // Compare ranks from high to low
  var ranks1 = badugi1.map(function(c) { return c.rank }).sort(function(a, b) { return b - a })
  var ranks2 = badugi2.map(function(c) { return c.rank }).sort(function(a, b) { return b - a })

  for (var i = 0; i < Math.min(ranks1.length, ranks2.length); i++) {
    if (ranks1[i] < ranks2[i]) {
      if (DEBUG_MODE) {
        console.log('  Comparing:', ranks1.join('-'), 'vs', ranks2.join('-'), '→', ranks1.join('-'), 'is better (lower)')
      }
      return true
    }
    if (ranks1[i] > ranks2[i]) {
      if (DEBUG_MODE) {
        console.log('  Comparing:', ranks1.join('-'), 'vs', ranks2.join('-'), '→', ranks2.join('-'), 'is better (lower)')
      }
      return false
    }
  }

  return false
}

// Get all combinations of size k from array
function getCombinations(arr, k) {
  if (k === 0) return [[]]
  if (k > arr.length) return []
  if (k === arr.length) return [arr]

  var result = []

  // Include first element
  var withFirst = getCombinations(arr.slice(1), k - 1)
  withFirst.forEach(function(combo) {
    result.push([arr[0]].concat(combo))
  })

  // Exclude first element
  var withoutFirst = getCombinations(arr.slice(1), k)
  result = result.concat(withoutFirst)

  return result
}

// Calculate numeric score for Badugi (lower is better)
function calculateBadugiScore(cardCount, sortedRanks) {
  // Invert cardCount so 4-card badugi has lowest score
  // (4-card = 0, 3-card = 1, 2-card = 2, 1-card = 3)
  var countScore = (4 - cardCount) * 10000000000

  // Add ranks (multiplied by position weight)
  for (var i = 0; i < sortedRanks.length; i++) {
    countScore += sortedRanks[i] * Math.pow(100, 3 - i)
  }

  return countScore
}

// Compare two Badugi hands
// Returns -1 if hand1 is better (lower), 1 if hand2 is better, 0 if tie
function compareBadugi(hand1, hand2) {
  // First compare by card count (more is better, so lower inverted score is better)
  if (hand1.cardCount > hand2.cardCount) return -1
  if (hand1.cardCount < hand2.cardCount) return 1

  // Same card count, compare ranks from high to low
  for (var i = 0; i < hand1.ranks.length; i++) {
    if (hand1.ranks[i] < hand2.ranks[i]) return -1
    if (hand1.ranks[i] > hand2.ranks[i]) return 1
  }

  // Tie
  return 0
}

$board.addEventListener('click', function () {
  clearWinnerHighlights()

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

      // Mark card as board card for debugging
      card.isBoardCard = true
      card.boardIndex = i

      card.animateTo({
        delay: i * 250,
        duration: 250,
        x: BOARD_X + Math.round((i - (cardCodes.length - 1) / 2) * 80 * fontSize / 16),
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


$board2.addEventListener('click', function () {
  clearWinnerHighlights()

  var input = $board2Input.value.trim().toLowerCase()
  if (!input) return

  var cardCodes = parseCardInput(input)
  if (cardCodes.length === 0) return

  // 回收旧公共牌
  if (board2Cards.length > 0) {
    deck.queue(function (next) {
      var cardsToReturn = board2Cards.slice()
      board2Cards = []

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

  // 发指定公共牌
  deck.queue(function (next) {
    var fontSize = 16
    var len = deck.cards.length

    cardCodes.forEach(function (cardIndex, i) {
      var card = deck.cards.find(function (c) {
        return c.i === cardIndex
      })
      if (!card) return

      board2Cards.push(card)

      // Mark card as board2 card for debugging
      card.isBoard2Card = true
      card.board2Index = i

      card.animateTo({
        delay: i * 250,
        duration: 250,
        x: BOARD2_X + Math.round((i - (cardCodes.length - 1) / 2) * 80 * fontSize / 16),
        y: BOARD2_Y,
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

// Conditional row display - Board1
function updateConditionalRowsBoard1() {
  var flushYes =
    document.querySelector('input[name="board1-flush"][value="yes"]')?.checked || false

  var straightYes =
    document.querySelector('input[name="board1-straight"][value="yes"]')?.checked || false

  var straightFlushYes =
    document.querySelector('input[name="board1-straightFlush"][value="yes"]')?.checked || false

  // DOM
  var $straightFlushRow = document.getElementById('board1-straightFlushRow')
  var $straightFlushMissingRow = document.getElementById('board1-straightFlushMissingRow')
  var $straightMissingRow = document.getElementById('board1-missingCardsRow')

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

// Conditional row display - Board2
function updateConditionalRowsBoard2() {
  var flushYes =
    document.querySelector('input[name="board2-flush"][value="yes"]')?.checked || false

  var straightYes =
    document.querySelector('input[name="board2-straight"][value="yes"]')?.checked || false

  var straightFlushYes =
    document.querySelector('input[name="board2-straightFlush"][value="yes"]')?.checked || false

  // DOM
  var $straightFlushRow = document.getElementById('board2-straightFlushRow')
  var $straightFlushMissingRow = document.getElementById('board2-straightFlushMissingRow')
  var $straightMissingRow = document.getElementById('board2-missingCardsRow')

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
  var name = radio.getAttribute('name')
  if (name && name.startsWith('board1-')) {
    radio.addEventListener('change', updateConditionalRowsBoard1)
  } else if (name && name.startsWith('board2-')) {
    radio.addEventListener('change', updateConditionalRowsBoard2)
  }
})

// Auto-resize textarea
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

// Auto-resize analysis textareas
var $board1StraightMissingInput = document.getElementById('board1-straightMissingInput')
var $board2StraightMissingInput = document.getElementById('board2-straightMissingInput')
var $board1SfMissingInput = document.getElementById('board1-sfMissingInput')
var $board2SfMissingInput = document.getElementById('board2-sfMissingInput')

if ($board1StraightMissingInput) {
  $board1StraightMissingInput.addEventListener('input', function() {
    autoResizeTextarea($board1StraightMissingInput)
  })
}
if ($board2StraightMissingInput) {
  $board2StraightMissingInput.addEventListener('input', function() {
    autoResizeTextarea($board2StraightMissingInput)
  })
}
if ($board1SfMissingInput) {
  $board1SfMissingInput.addEventListener('input', function() {
    autoResizeTextarea($board1SfMissingInput)
  })
}
if ($board2SfMissingInput) {
  $board2SfMissingInput.addEventListener('input', function() {
    autoResizeTextarea($board2SfMissingInput)
  })
}

// Auto-resize board and hand inputs
var textareaInputs = [$boardInput, $board2Input]

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

// Function to reset all chips to their original positions
function resetChipsPosition() {
  var highChipsStack = document.getElementById('highChipsStack')
  var lowChipsStack = document.getElementById('lowChipsStack')

  // Reset all high chips
  document.querySelectorAll('.chip-high').forEach(function(chip) {
    chip.classList.remove('dragging')
    chip.style.left = ''
    chip.style.top = ''
    if (chip.parentNode !== highChipsStack) {
      highChipsStack.appendChild(chip)
    }
  })

  // Reset all low chips
  document.querySelectorAll('.chip-low').forEach(function(chip) {
    chip.classList.remove('dragging')
    chip.style.left = ''
    chip.style.top = ''
    if (chip.parentNode !== lowChipsStack) {
      lowChipsStack.appendChild(chip)
    }
  })
}

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


// Board1 validation
document.getElementById('board1-validateTextureBtn').addEventListener('click', function () {
  var input = document.getElementById('boardInput').value.trim().toLowerCase()
  if (!input) return

  var cards = parseCardInput(input)
  if (cards.length < 5) return

  var result = analyzeTexture(cards)

  validateRow('board1-pair', result.hasPair)
  validateRow('board1-flush', result.hasFlush)
  validateRow('board1-straight', result.hasStraight)
  validateRow('board1-straightFlush', result.hasStraightFlush)

  // ✅ 顺子缺张验证（只在用户选择"有顺子"时）
  var straightYes =
    document.querySelector('input[name="board1-straight"][value="yes"]')?.checked

  if (straightYes) {
    const textarea = document.getElementById('board1-straightMissingInput')
    const userText = textarea.value.trim()

    const straightResult = validateStraightMissing(cards, userText)

    const resultEl = document.getElementById('board1-straightMissingResult')

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
    document.querySelector('input[name="board1-straightFlush"][value="yes"]')?.checked

  if (sfYes) {
    const textarea = document.getElementById('board1-sfMissingInput')
    const userText = textarea.value.trim()

    const expected = getExpectedStraightFlushMissing(cards)
    const user = new Set(normalizeUserSFInput(userText))

    const missing = []
    expected.forEach(e => {
      if (!user.has(e.toLowerCase())) missing.push(e)
    })

    const resultEl = document.getElementById('board1-sfMissingResult')

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

// Board2 validation
document.getElementById('board2-validateTextureBtn').addEventListener('click', function () {
  var input = document.getElementById('board2Input').value.trim().toLowerCase()
  if (!input) return

  var cards = parseCardInput(input)
  if (cards.length < 5) return

  var result = analyzeTexture(cards)

  validateRow('board2-pair', result.hasPair)
  validateRow('board2-flush', result.hasFlush)
  validateRow('board2-straight', result.hasStraight)
  validateRow('board2-straightFlush', result.hasStraightFlush)

  // ✅ 顺子缺张验证（只在用户选择"有顺子"时）
  var straightYes =
    document.querySelector('input[name="board2-straight"][value="yes"]')?.checked

  if (straightYes) {
    const textarea = document.getElementById('board2-straightMissingInput')
    const userText = textarea.value.trim()

    const straightResult = validateStraightMissing(cards, userText)

    const resultEl = document.getElementById('board2-straightMissingResult')

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
    document.querySelector('input[name="board2-straightFlush"][value="yes"]')?.checked

  if (sfYes) {
    const textarea = document.getElementById('board2-sfMissingInput')
    const userText = textarea.value.trim()

    const expected = getExpectedStraightFlushMissing(cards)
    const user = new Set(normalizeUserSFInput(userText))

    const missing = []
    expected.forEach(e => {
      if (!user.has(e.toLowerCase())) missing.push(e)
    })

    const resultEl = document.getElementById('board2-sfMissingResult')

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

// Reset Board1 Analysis
function resetBoard1Analysis() {
  // 1️⃣ 清空 Board1 radio 选择
  document
    .querySelectorAll('#analysisPanelContent input[type="radio"][name^="board1-"]')
    .forEach(radio => {
      radio.checked = false
    })

  // 2️⃣ 清空 Board1 结果文字
  document
    .querySelectorAll('.analysis-result[data-key^="board1-"]')
    .forEach(el => {
      el.textContent = ''
      el.className = 'analysis-result'
    })

  // 3️⃣ 清空 Board1 顺子缺张 textarea
  const board1StraightMissing = document.getElementById('board1-straightMissingInput')
  if (board1StraightMissing) {
    board1StraightMissing.value = ''
    board1StraightMissing.classList.remove('correct', 'wrong')
    board1StraightMissing.style.height = 'auto'
  }

  // 4️⃣ 清空 Board1 同花顺缺张 textarea
  const board1SfMissing = document.getElementById('board1-sfMissingInput')
  if (board1SfMissing) {
    board1SfMissing.value = ''
    board1SfMissing.classList.remove('correct', 'wrong')
    board1SfMissing.style.height = 'auto'
  }

  // 5️⃣ 隐藏 Board1 条件显示的行
  const board1StraightFlushRow = document.getElementById('board1-straightFlushRow')
  const board1StraightFlushMissingRow = document.getElementById('board1-straightFlushMissingRow')
  const board1StraightMissingRow = document.getElementById('board1-missingCardsRow')

  if (board1StraightFlushRow) board1StraightFlushRow.style.display = 'none'
  if (board1StraightFlushMissingRow) board1StraightFlushMissingRow.style.display = 'none'
  if (board1StraightMissingRow) board1StraightMissingRow.style.display = 'none'

  const board1StraightResult = document.getElementById('board1-straightMissingResult')
  if (board1StraightResult) {
    board1StraightResult.textContent = ''
    board1StraightResult.className = 'analysis-result'
  }

  const board1SfResult = document.getElementById('board1-sfMissingResult')
  if (board1SfResult) {
    board1SfResult.textContent = ''
    board1SfResult.className = 'analysis-result'
  }
}

// Reset Board2 Analysis
function resetBoard2Analysis() {
  // 1️⃣ 清空 Board2 radio 选择
  document
    .querySelectorAll('#analysisPanelContent input[type="radio"][name^="board2-"]')
    .forEach(radio => {
      radio.checked = false
    })

  // 2️⃣ 清空 Board2 结果文字
  document
    .querySelectorAll('.analysis-result[data-key^="board2-"]')
    .forEach(el => {
      el.textContent = ''
      el.className = 'analysis-result'
    })

  // 3️⃣ 清空 Board2 顺子缺张 textarea
  const board2StraightMissing = document.getElementById('board2-straightMissingInput')
  if (board2StraightMissing) {
    board2StraightMissing.value = ''
    board2StraightMissing.classList.remove('correct', 'wrong')
    board2StraightMissing.style.height = 'auto'
  }

  // 4️⃣ 清空 Board2 同花顺缺张 textarea
  const board2SfMissing = document.getElementById('board2-sfMissingInput')
  if (board2SfMissing) {
    board2SfMissing.value = ''
    board2SfMissing.classList.remove('correct', 'wrong')
    board2SfMissing.style.height = 'auto'
  }

  // 5️⃣ 隐藏 Board2 条件显示的行
  const board2StraightFlushRow = document.getElementById('board2-straightFlushRow')
  const board2StraightFlushMissingRow = document.getElementById('board2-straightFlushMissingRow')
  const board2StraightMissingRow = document.getElementById('board2-missingCardsRow')

  if (board2StraightFlushRow) board2StraightFlushRow.style.display = 'none'
  if (board2StraightFlushMissingRow) board2StraightFlushMissingRow.style.display = 'none'
  if (board2StraightMissingRow) board2StraightMissingRow.style.display = 'none'

  const board2StraightResult = document.getElementById('board2-straightMissingResult')
  if (board2StraightResult) {
    board2StraightResult.textContent = ''
    board2StraightResult.className = 'analysis-result'
  }

  const board2SfResult = document.getElementById('board2-sfMissingResult')
  if (board2SfResult) {
    board2SfResult.textContent = ''
    board2SfResult.className = 'analysis-result'
  }
}

document
  .getElementById('board1-resetTextureBtn')
  .addEventListener('click', function () {
    resetBoard1Analysis()
  })

document
  .getElementById('board2-resetTextureBtn')
  .addEventListener('click', function () {
    resetBoard2Analysis()
  })



function normalizeUserSFInput(raw) {
  return raw
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(s => s.trim())
}

// ============================================
// Debug: Log hand card positions after dragging
// ============================================
if (DEBUG_MODE) {
  // Track if we're dragging a hand card or board card
  var draggedCard = null
  var isDraggingCard = false

  document.addEventListener('mousedown', function(e) {
    var clickedCard = getCardFromElement(e.target)
    if (clickedCard && (clickedCard.handKey || clickedCard.isBoardCard || clickedCard.isBoard2Card)) {
      draggedCard = clickedCard
      isDraggingCard = true
    }
  }, true)

  document.addEventListener('mouseup', function(e) {
    if (isDraggingCard && draggedCard) {
      // Use setTimeout to ensure the card position is updated
      setTimeout(function() {
        var card = draggedCard

        if (card.handKey) {
          // Hand card
          console.log('═══════════════════════════════════')
          console.log('Hand Card Moved: ' + card.handKey)
          console.log('Position: { x: ' + Math.round(card.x) + ', y: ' + Math.round(card.y) + ' }')
          console.log('Copy this to handPositions:')
          console.log(card.handKey + ': { x: ' + Math.round(card.x) + ', y: ' + Math.round(card.y) + ' },')
          console.log('═══════════════════════════════════')
        } else if (card.isBoardCard) {
          // Board card
          var fontSize = 16
          var cardSpacing = Math.round((card.boardIndex - 2) * 80 * fontSize / 16)
          var boardX = Math.round(card.x - cardSpacing)
          var boardY = Math.round(card.y)

          console.log('═══════════════════════════════════')
          console.log('Board Card Moved (index: ' + card.boardIndex + ')')
          console.log('Card Position: { x: ' + Math.round(card.x) + ', y: ' + Math.round(card.y) + ' }')
          console.log('Calculated Board Position:')
          console.log('var BOARD_X = ' + boardX)
          console.log('var BOARD_Y = ' + boardY)
          console.log('═══════════════════════════════════')
        } else if (card.isBoard2Card) {
          // Board2 card
          var fontSize = 16
          var cardSpacing = Math.round((card.board2Index - 2) * 80 * fontSize / 16)
          var board2X = Math.round(card.x - cardSpacing)
          var board2Y = Math.round(card.y)

          console.log('═══════════════════════════════════')
          console.log('Board2 Card Moved (index: ' + card.board2Index + ')')
          console.log('Card Position: { x: ' + Math.round(card.x) + ', y: ' + Math.round(card.y) + ' }')
          console.log('Calculated Board2 Position:')
          console.log('var BOARD2_X = ' + board2X)
          console.log('var BOARD2_Y = ' + board2Y)
          console.log('═══════════════════════════════════')
        }

        draggedCard = null
        isDraggingCard = false
      }, 50)
    } else {
      draggedCard = null
      isDraggingCard = false
    }
  })
}

// ============================================
// Multi-select and batch move functionality
// ============================================

var selectedCards = []
var isSelecting = false
var selectionStartX = 0
var selectionStartY = 0
var $selectionBox = null

// Pan viewport functionality
var isSpacePressed = false
var isPanning = false
var panStartX = 0
var panStartY = 0
var containerOffsetX = INITIAL_OFFSET_X  // 使用初始偏移
var containerOffsetY = INITIAL_OFFSET_Y  // 使用初始偏移
var wasPanning = false  // Track if we were just panning

// Selection requires Ctrl key
var isCtrlPressed = false

// Listen for space key
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && !isSpacePressed) {
    isSpacePressed = true
    document.body.classList.add('space-pressed')
    e.preventDefault()
  }

  // Listen for Ctrl key
  if ((e.ctrlKey || e.metaKey) && !isCtrlPressed) {
    isCtrlPressed = true
    document.body.classList.add('ctrl-pressed')
  }
})

document.addEventListener('keyup', function(e) {
  if (e.code === 'Space') {
    isSpacePressed = false
    wasPanning = isPanning
    isPanning = false
    document.body.classList.remove('space-pressed')
    document.body.classList.remove('panning')

    // Clear wasPanning flag after a short delay
    setTimeout(function() {
      wasPanning = false
    }, 100)
  }

  // Listen for Ctrl key release
  if (!e.ctrlKey && !e.metaKey) {
    isCtrlPressed = false
    document.body.classList.remove('ctrl-pressed')

    // Cancel selection if Ctrl is released during selection
    if (isSelecting) {
      isSelecting = false
      hideSelectionBox()
    }
  }
})

// Create selection box element
function createSelectionBox() {
  var box = document.createElement('div')
  box.id = 'selectionBox'
  document.body.appendChild(box)
  return box
}

$selectionBox = createSelectionBox()

// Check if element is a card or inside a card
function isCardElement(element) {
  if (!element) return false
  if (element.classList && element.classList.contains('card')) return true
  if (element.parentElement) return isCardElement(element.parentElement)
  return false
}

// Check if clicking on UI elements
function isUIElement(element) {
  if (!element) return false
  var uiIds = ['topbar', 'bottombar', 'sidebar', 'analysisPanel', 'chipsContainer']
  for (var i = 0; i < uiIds.length; i++) {
    if (element.id === uiIds[i] || (element.parentElement && element.parentElement.id === uiIds[i])) {
      return true
    }
  }
  if (element.parentElement) return isUIElement(element.parentElement)
  return false
}

// Get card from element
function getCardFromElement(element) {
  if (!element) return null
  for (var i = 0; i < deck.cards.length; i++) {
    if (deck.cards[i].$el === element || deck.cards[i].$el.contains(element)) {
      return deck.cards[i]
    }
  }
  return null
}

// Check if card intersects with selection box
function isCardInSelection(card, selBox) {
  var cardRect = card.$el.getBoundingClientRect()
  var boxRect = selBox.getBoundingClientRect()

  return !(cardRect.right < boxRect.left ||
           cardRect.left > boxRect.right ||
           cardRect.bottom < boxRect.top ||
           cardRect.top > boxRect.bottom)
}

// Clear selection
function clearSelection() {
  selectedCards.forEach(function(card) {
    card.$el.classList.remove('selected')
  })
  selectedCards = []
}

// Add card to selection
function addToSelection(card) {
  if (selectedCards.indexOf(card) === -1) {
    selectedCards.push(card)
    card.$el.classList.add('selected')
  }
}

// Update selection box display
function updateSelectionBox(currentX, currentY) {
  var left = Math.min(selectionStartX, currentX)
  var top = Math.min(selectionStartY, currentY)
  var width = Math.abs(currentX - selectionStartX)
  var height = Math.abs(currentY - selectionStartY)

  $selectionBox.style.left = left + 'px'
  $selectionBox.style.top = top + 'px'
  $selectionBox.style.width = width + 'px'
  $selectionBox.style.height = height + 'px'
  $selectionBox.style.display = 'block'
}

// Hide selection box
function hideSelectionBox() {
  $selectionBox.style.display = 'none'
}

// Variables for batch dragging
var isBatchDragging = false
var batchDragStartX = 0
var batchDragStartY = 0
var batchDragOffsets = []

// Handle mousedown on document
document.addEventListener('mousedown', function(e) {
  // Block if we just finished panning
  if (wasPanning) {
    e.preventDefault()
    e.stopPropagation()
    return
  }

  // Priority 1: Space key panning
  if (isSpacePressed) {
    isPanning = true
    panStartX = e.clientX
    panStartY = e.clientY
    document.body.classList.add('panning')
    e.preventDefault()
    e.stopPropagation()
    return
  }

  // Ignore if clicking on UI elements
  if (isUIElement(e.target)) {
    return
  }

  var clickedCard = getCardFromElement(e.target)

  // If clicked on a selected card, start batch dragging
  if (clickedCard && selectedCards.indexOf(clickedCard) !== -1) {
    e.preventDefault()
    e.stopPropagation()

    isBatchDragging = true
    batchDragStartX = e.clientX
    batchDragStartY = e.clientY

    // Temporarily disable dragging for selected cards
    selectedCards.forEach(function(card) {
      card.disableDragging()
    })

    // Store offsets for all selected cards
    batchDragOffsets = selectedCards.map(function(card) {
      return {
        card: card,
        startX: card.x,
        startY: card.y
      }
    })

    return
  }

  // If clicked on a card (not selected), let the card handle it normally
  if (clickedCard) {
    clearSelection()
    return
  }

  // Only start selection if Ctrl key is pressed
  if (isCtrlPressed || e.ctrlKey || e.metaKey) {
    clearSelection()
    isSelecting = true
    selectionStartX = e.clientX
    selectionStartY = e.clientY
    updateSelectionBox(e.clientX, e.clientY)
    e.preventDefault()
  }
}, true)

// Handle mouse move
document.addEventListener('mousemove', function(e) {
  // Priority 1: Pan viewport
  if (isPanning) {
    var deltaX = e.clientX - panStartX
    var deltaY = e.clientY - panStartY

    var newX = containerOffsetX + deltaX
    var newY = containerOffsetY + deltaY

    $container.style.left = 'calc(50% + ' + newX + 'px)'
    $container.style.top = 'calc(50% + 1.5rem + ' + newY + 'px)'

    // Move background layer as well
    var transformProp = prefix('transform')
    $backgroundLayer.style[transformProp] = translate(newX + 'px', newY + 'px')

    e.preventDefault()
    e.stopPropagation()
    return
  }

  if (isSelecting) {
    updateSelectionBox(e.clientX, e.clientY)

    // Update selected cards
    var tempSelected = []
    deck.cards.forEach(function(card) {
      if (isCardInSelection(card, $selectionBox)) {
        tempSelected.push(card)
      }
    })

    // Update selection
    clearSelection()
    tempSelected.forEach(function(card) {
      addToSelection(card)
    })
  } else if (isBatchDragging) {
    e.preventDefault()
    e.stopPropagation()

    var deltaX = e.clientX - batchDragStartX
    var deltaY = e.clientY - batchDragStartY

    // Move all selected cards
    batchDragOffsets.forEach(function(item) {
      var newX = item.startX + deltaX
      var newY = item.startY + deltaY

      var transformProp = prefix('transform')
      item.card.$el.style[transformProp] = translate(newX + 'px', newY + 'px') +
        (item.card.rot ? ' rotate(' + item.card.rot + 'deg)' : '')
    })
  }
})

// Handle mouse up
document.addEventListener('mouseup', function(e) {
  if (isPanning) {
    var deltaX = e.clientX - panStartX
    var deltaY = e.clientY - panStartY

    containerOffsetX = containerOffsetX + deltaX
    containerOffsetY = containerOffsetY + deltaY

    // Update background layer final position
    var transformProp = prefix('transform')
    $backgroundLayer.style[transformProp] = translate(containerOffsetX + 'px', containerOffsetY + 'px')

    isPanning = false
    document.body.classList.remove('panning')
    e.preventDefault()
    e.stopPropagation()
    return
  }

  if (isSelecting) {
    isSelecting = false
    hideSelectionBox()
  } else if (isBatchDragging) {
    // Update final positions
    var deltaX = e.clientX - batchDragStartX
    var deltaY = e.clientY - batchDragStartY

    batchDragOffsets.forEach(function(item) {
      item.card.x = item.startX + deltaX
      item.card.y = item.startY + deltaY
    })

    // Re-enable dragging for selected cards
    selectedCards.forEach(function(card) {
      card.enableDragging()
    })

    // Debug: Log positions of moved cards
    if (DEBUG_MODE) {
      var movedHandCards = batchDragOffsets.filter(function(item) {
        return item.card.handKey
      })

      var movedBoardCards = batchDragOffsets.filter(function(item) {
        return item.card.isBoardCard
      })

      var movedBoard2Cards = batchDragOffsets.filter(function(item) {
        return item.card.isBoard2Card
      })

      if (movedHandCards.length > 0 || movedBoardCards.length > 0 || movedBoard2Cards.length > 0) {
        console.log('═══════════════════════════════════')

        if (movedHandCards.length > 0) {
          console.log('Batch Move: ' + movedHandCards.length + ' hand card(s) moved')
          movedHandCards.forEach(function(item) {
            var card = item.card
            console.log(card.handKey + ': { x: ' + Math.round(card.x) + ', y: ' + Math.round(card.y) + ' },')
          })
        }

        if (movedBoardCards.length > 0) {
          console.log('Batch Move: ' + movedBoardCards.length + ' board card(s) moved')
          // Calculate average board position from first card
          if (movedBoardCards.length > 0) {
            var firstCard = movedBoardCards[0].card
            var fontSize = 16
            var cardSpacing = Math.round((firstCard.boardIndex - 2) * 80 * fontSize / 16)
            var boardX = Math.round(firstCard.x - cardSpacing)
            var boardY = Math.round(firstCard.y)
            console.log('Calculated Board Position:')
            console.log('var BOARD_X = ' + boardX)
            console.log('var BOARD_Y = ' + boardY)
          }
        }

        if (movedBoard2Cards.length > 0) {
          console.log('Batch Move: ' + movedBoard2Cards.length + ' board2 card(s) moved')
          // Calculate average board2 position from first card
          if (movedBoard2Cards.length > 0) {
            var firstCard = movedBoard2Cards[0].card
            var fontSize = 16
            var cardSpacing = Math.round((firstCard.board2Index - 2) * 80 * fontSize / 16)
            var board2X = Math.round(firstCard.x - cardSpacing)
            var board2Y = Math.round(firstCard.y)
            console.log('Calculated Board2 Position:')
            console.log('var BOARD2_X = ' + board2X)
            console.log('var BOARD2_Y = ' + board2Y)
          }
        }

        console.log('═══════════════════════════════════')
      }
    }

    isBatchDragging = false
    batchDragOffsets = []
  }
})

// Prevent clicks when panning just finished
document.addEventListener('click', function(e) {
  if (wasPanning || isPanning || isSpacePressed) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}, true)

// Touch support for mobile
document.addEventListener('touchstart', function(e) {
  // Ignore if clicking on UI elements
  if (isUIElement(e.target)) {
    return
  }

  var touch = e.touches[0]
  var touchedCard = getCardFromElement(e.target)

  // If touched a selected card, start batch dragging
  if (touchedCard && selectedCards.indexOf(touchedCard) !== -1) {
    e.preventDefault()
    e.stopPropagation()

    isBatchDragging = true
    batchDragStartX = touch.clientX
    batchDragStartY = touch.clientY

    // Temporarily disable dragging for selected cards
    selectedCards.forEach(function(card) {
      card.disableDragging()
    })

    batchDragOffsets = selectedCards.map(function(card) {
      return {
        card: card,
        startX: card.x,
        startY: card.y
      }
    })

    return
  }

  // If touched a card (not selected), let the card handle it normally
  if (touchedCard) {
    clearSelection()
    return
  }

  // Note: Touch devices don't support Ctrl key, so selection box is disabled on touch
  // If you need selection on mobile, consider implementing a long-press gesture
}, true)

document.addEventListener('touchmove', function(e) {
  if (e.touches.length === 0) return
  var touch = e.touches[0]

  if (isSelecting) {
    e.preventDefault()
    updateSelectionBox(touch.clientX, touch.clientY)

    var tempSelected = []
    deck.cards.forEach(function(card) {
      if (isCardInSelection(card, $selectionBox)) {
        tempSelected.push(card)
      }
    })

    clearSelection()
    tempSelected.forEach(function(card) {
      addToSelection(card)
    })
  } else if (isBatchDragging) {
    e.preventDefault()
    e.stopPropagation()

    var deltaX = touch.clientX - batchDragStartX
    var deltaY = touch.clientY - batchDragStartY

    batchDragOffsets.forEach(function(item) {
      var newX = item.startX + deltaX
      var newY = item.startY + deltaY

      var transformProp = prefix('transform')
      item.card.$el.style[transformProp] = translate(newX + 'px', newY + 'px') +
        (item.card.rot ? ' rotate(' + item.card.rot + 'deg)' : '')
    })
  }
})

document.addEventListener('touchend', function(e) {
  if (isSelecting) {
    isSelecting = false
    hideSelectionBox()
  } else if (isBatchDragging) {
    if (e.changedTouches.length === 0) return
    var touch = e.changedTouches[0]

    var deltaX = touch.clientX - batchDragStartX
    var deltaY = touch.clientY - batchDragStartY

    batchDragOffsets.forEach(function(item) {
      item.card.x = item.startX + deltaX
      item.card.y = item.startY + deltaY
    })

    // Re-enable dragging for selected cards
    selectedCards.forEach(function(card) {
      card.enableDragging()
    })

    isBatchDragging = false
    batchDragOffsets = []
  }
})









