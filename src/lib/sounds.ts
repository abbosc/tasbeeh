export type ClickSoundType = 'soft' | 'bell' | 'wood' | 'beads' | 'crystal'

// Sound generation using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null
  private currentSoundType: ClickSoundType = 'soft'

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext()
      // Load saved sound preference
      const saved = localStorage.getItem('click_sound')
      if (saved) {
        this.currentSoundType = saved as ClickSoundType
      }
    }
  }

  setSoundType(type: ClickSoundType) {
    this.currentSoundType = type
    localStorage.setItem('click_sound', type)
  }

  getCurrentSoundType() {
    return this.currentSoundType
  }

  // Play a pleasant "click" sound for counter increment
  playClick() {
    if (!this.audioContext) return

    switch (this.currentSoundType) {
      case 'soft':
        this.playSoftClick()
        break
      case 'bell':
        this.playBellClick()
        break
      case 'wood':
        this.playWoodClick()
        break
      case 'beads':
        this.playBeadsClick()
        break
      case 'crystal':
        this.playCrystalClick()
        break
    }
  }

  private playSoftClick() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  private playBellClick() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = 1200
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  private playWoodClick() {
    if (!this.audioContext) return

    const noise = this.audioContext.createBufferSource()
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1
    }

    noise.buffer = buffer

    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400

    const gainNode = this.audioContext.createGain()

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)

    noise.start(this.audioContext.currentTime)
    noise.stop(this.audioContext.currentTime + 0.05)
  }

  private playBeadsClick() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = 600
    oscillator.type = 'triangle'

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.15)

    // Add a second quick click for bead effect
    setTimeout(() => {
      if (!this.audioContext) return
      const osc2 = this.audioContext.createOscillator()
      const gain2 = this.audioContext.createGain()

      osc2.connect(gain2)
      gain2.connect(this.audioContext.destination)

      osc2.frequency.value = 650
      osc2.type = 'triangle'

      gain2.gain.setValueAtTime(0.15, this.audioContext.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

      osc2.start(this.audioContext.currentTime)
      osc2.stop(this.audioContext.currentTime + 0.1)
    }, 30)
  }

  private playCrystalClick() {
    if (!this.audioContext) return

    const frequencies = [1400, 1800]

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      const startTime = this.audioContext!.currentTime + index * 0.02
      gainNode.gain.setValueAtTime(0.25, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.2)
    })
  }

  // Play a celebratory sound for goal completion
  playSuccess() {
    if (!this.audioContext) return

    const frequencies = [523.25, 659.25, 783.99] // C, E, G chord

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      const startTime = this.audioContext!.currentTime + index * 0.1
      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.5)
    })
  }

  // Play a subtle milestone sound (e.g., every 33 counts)
  playMilestone() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = 1000
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }
}

export const soundManager = new SoundManager()

// Haptic feedback for mobile devices
export const vibrate = (pattern: number | number[] = 10) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

// Specific haptic patterns
export const haptics = {
  click: () => vibrate(10),
  success: () => vibrate([50, 100, 50, 100, 100]),
  milestone: () => vibrate([30, 50, 30]),
}
