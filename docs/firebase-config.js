// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyAv-N7GXjCgjZOs64VCee0AJS5MwtLVHSk",
  authDomain: "reg-board-teacher.firebaseapp.com",
  projectId: "reg-board-teacher",
  storageBucket: "reg-board-teacher.firebasestorage.app",
  messagingSenderId: "628608598753",
  appId: "1:628608598753:web:d07ba1b5efb5c6fbaa6da0"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Collection name
const PRESETS_COLLECTION = 'pokerPresets'

// Firestore operations
async function loadPresetsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, PRESETS_COLLECTION))
    const presets = []
    querySnapshot.forEach((doc) => {
      presets.push({ id: doc.id, ...doc.data() })
    })
    return presets
  } catch (error) {
    console.error('Error loading presets from Firestore:', error)
    return []
  }
}

async function savePresetToFirestore(name, state) {
  try {
    const docId = 'preset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    const preset = {
      name: name,
      gameMode: state.gameMode,
      state: state,
      createdAt: new Date().toISOString()
    }
    await setDoc(doc(db, PRESETS_COLLECTION, docId), preset)
    return { id: docId, ...preset }
  } catch (error) {
    console.error('Error saving preset to Firestore:', error)
    throw error
  }
}

async function deletePresetFromFirestore(presetId) {
  try {
    await deleteDoc(doc(db, PRESETS_COLLECTION, presetId))
    return true
  } catch (error) {
    console.error('Error deleting preset from Firestore:', error)
    throw error
  }
}

// Notify main script that Firebase is ready
window.dispatchEvent(new CustomEvent('firebaseReady', {
  detail: {
    loadPresetsFromFirestore,
    savePresetToFirestore,
    deletePresetFromFirestore
  }
}))

console.log('Firebase initialized successfully')

