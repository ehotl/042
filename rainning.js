// 빗줄기 배경
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    const randomBetween = (min, max) => {
        return Math.random() * (max - min + 1) + min
    }


    const TUNDER_RATE = 0.001
    let total
    let rains = []
    let drops = []
    let thunder
    let mouse = {x: 0, y:0, isActive: false}

 //  빗줄기클래스

    class rain {
        constructor(x,y,velocity) {
            this.x = x
            this.y = y
            this.velocity = velocity
        }

        draw() {
            const {x, y, velocity } = this
            ctx.beginPath()
            ctx.moveTo(x,y)
            ctx.lineTo(x + velocity.x * 2 ,y + velocity.y * 2)
            ctx.strokeStyle = '#8899a6'
            ctx.lineWidth = 1.5
            ctx.stroke()
        }

        splash() {
            for (let i = 0; i < 3; i++){
                const velocity = {
                    x: -this.velocity.x + randomBetween(-2, 2),
                    y: -this.velocity.y + randomBetween(5, 10)
                }
                drops.push(new Drop(this.x, innerHeight, velocity))
            }
        }

        animate(){
            if (this.y > innerHeight) {
                this.splash()
                this.x = randomBetween(-innerWidth * 0.2, innerWidth * 1.2)
                this.y = -20
            }
            this.velocity.x = mouse.isActive
                ? randomBetween(-1, 1) + (-innerWidth / 2 + mouse.x) / 150
                : randomBetween(-1, 1)

            this.x += this.velocity.x
            this.y += this.velocity.y

            this.draw()
        }
    }

 // 드롭 클래스
 class Drop{
    constructor(x, y, velocity) {
        this.x = x
        this.y = y
        this.velocity = velocity
        this.gravity = 1.5
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = '#8899a6'
        ctx.fill()
    }

    animate() {
        this.velocity.y += this.gravity
        this.x += this.velocity.x
        this.y += this.velocity.y
        
        this.draw()
    }
 }
 
 // 번개 클래스
 class Thunder {
    constructor() {
        this.opacity = 0
    }

    draw() {
        const gradient = ctx.createLinearGradient(0, 0, 0, innerHeight)
        gradient.addColorStop(0, `rgba(66, 84, 99, ${this.opacity})`)
        gradient.addColorStop(1, `rgba(18, 23, 27, ${this.opacity})`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, innerWidth, innerHeight)
    }

    animate() {
        if(this.opacity < 0) return
        this.opacity -= 0.005
        this.draw()
    }
 }

 // 초기화 작업
    function init() {
        canvas.width = innerWidth
        canvas.height = innerHeight

        total = Math.floor(innerWidth * innerHeight / 15000)
        rains = []
        drops = []
        thunder = new Thunder ()

        for (let i = 0; i < total; i++) {
            const x = randomBetween(0, innerWidth)
            const y = randomBetween(0, innerHeight)
            const velocity = {
                // x: randomBetween(-1, 1),
                y: randomBetween(13, 18)
            }
            rains.push(new rain(x,y,velocity))
        }
    }

    // 렌더 함수
    function render() {
        ctx.clearRect(0,0, canvas.width, canvas.height)
        if (Math.random() < TUNDER_RATE ) thunder.opacity = 1
        thunder.animate()
        rains.forEach(rain => rain.animate())
        drops.forEach((Drop, index) => {
            Drop.animate()
            if(Drop.y > innerHeight) drops.splice(index, 1)
        })

        window.requestAnimationFrame(render)
    }

    // 리사이즈 이벤트
    window.addEventListener('resize', () => init())
    canvas.addEventListener('mouseenter', () => mouse.isActive = true)
    canvas.addEventListener('mouseleave', () => mouse.isActive = false)
    canvas.addEventListener('mousemove', e => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    })
    init ()
    render ()