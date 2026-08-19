// Password protection with Firestore
(function() {
  'use strict'

  const SESSION_KEY = 'poker_auth'

  // Check if already authenticated in this session
  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    return // Already authenticated
  }

  // Hide page content
  document.documentElement.style.display = 'none'

  // Simple SHA-256 hash function
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  // Load password hash from Firestore
  async function loadPasswordHash() {
    try {
      const response = await fetch(
        'https://firestore.googleapis.com/v1/projects/reg-board-teacher/databases/(default)/documents/appConfig/password'
      )

      if (!response.ok) {
        console.error('Failed to load password config')
        return null
      }

      const data = await response.json()
      return data.fields?.hash?.stringValue || null
    } catch (error) {
      console.error('Error loading password:', error)
      return null
    }
  }

  // Create password dialog
  function createPasswordDialog() {
    const overlay = document.createElement('div')
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;'

    const dialog = document.createElement('div')
    dialog.style.cssText = 'background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); min-width: 300px;'

    const title = document.createElement('h2')
    title.textContent = '请输入访问密码'
    title.style.cssText = 'margin: 0 0 20px 0; font-family: sans-serif; color: #333;'

    const input = document.createElement('input')
    input.type = 'password'
    input.placeholder = '密码'
    input.style.cssText = 'width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; margin-bottom: 15px;'

    const errorMsg = document.createElement('div')
    errorMsg.style.cssText = 'color: #d44; font-size: 14px; margin-bottom: 10px; min-height: 20px; font-family: sans-serif;'

    const button = document.createElement('button')
    button.textContent = '确认'
    button.style.cssText = 'width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; font-family: sans-serif;'

    button.onmouseover = () => button.style.background = '#45a049'
    button.onmouseout = () => button.style.background = '#4CAF50'

    dialog.appendChild(title)
    dialog.appendChild(input)
    dialog.appendChild(errorMsg)
    dialog.appendChild(button)
    overlay.appendChild(dialog)

    return { overlay, input, button, errorMsg }
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    setTimeout(init, 0)
  }

  async function init() {
    console.log('[AUTH] Starting password check...')

    const correctHash = await loadPasswordHash()
    console.log('[AUTH] Password hash loaded:', correctHash ? 'YES' : 'NO')

    if (!correctHash) {
      alert('无法加载配置，请检查网络连接')
      document.documentElement.style.display = ''
      return
    }

    let attempts = 0
    const maxAttempts = 3

    console.log('[AUTH] Creating password dialog...')
    const { overlay, input, button, errorMsg } = createPasswordDialog()

    // Ensure body exists before appending
    if (!document.body) {
      console.log('[AUTH] Creating body element...')
      document.documentElement.appendChild(document.createElement('body'))
    }
    document.body.appendChild(overlay)
    console.log('[AUTH] Dialog appended to body')

    // Show the html element now that dialog is ready
    document.documentElement.style.display = ''

    // Focus input
    setTimeout(() => input.focus(), 100)

    async function checkPassword() {
      const password = input.value

      if (!password) {
        errorMsg.textContent = '请输入密码'
        return
      }

      // Hash the entered password
      const enteredHash = await sha256(password)

      if (enteredHash === correctHash) {
        // Correct password
        sessionStorage.setItem(SESSION_KEY, 'true')
        overlay.remove()
        document.documentElement.style.display = ''
      } else {
        // Wrong password
        attempts++
        if (attempts >= maxAttempts) {
          errorMsg.textContent = '密码错误次数过多，请刷新页面重试'
          button.disabled = true
          button.style.background = '#ccc'
          button.style.cursor = 'not-allowed'
          input.disabled = true
        } else {
          errorMsg.textContent = '密码错误！剩余尝试次数: ' + (maxAttempts - attempts)
          input.value = ''
          input.focus()
        }
      }
    }

    button.addEventListener('click', checkPassword)
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkPassword()
      }
    })
  }
})()
