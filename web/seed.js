import { app } from "/scripts/app.js"

const HISTORY = 5
const RANDOM = -1
const MUTED = 2
const BYPASSED = 4

function randomSeed() {
    return Math.floor(Math.random() * 2 ** 50)
}

app.registerExtension({
    name: "comfyui_davcha_seed",
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "DavchaSeed") return

        const onNodeCreated = nodeType.prototype.onNodeCreated
        nodeType.prototype.onNodeCreated = function () {
            onNodeCreated?.apply(this, arguments)
            this.properties.seed_history ??= []
            const seedWidget = this.widgets.find((w) => w.name === "seed")

            const button = (name, label, callback) => {
                const w = this.addWidget("button", name, null, callback, { serialize: false })
                w.serialize = false
                w.label = label
                return w
            }

            // Slot i shows history[i - offset] so the most recent seed sits in the last slot,
            // right above the seed widget.
            const slotSeed = (i) => {
                const history = this.properties.seed_history
                return history[i - (HISTORY - history.length)]
            }
            const slots = []
            for (let i = 0; i < HISTORY; i++) {
                slots.push(button(`history_${i}`, "", () => {
                    const seed = slotSeed(i)
                    if (seed !== undefined) seedWidget.value = seed
                    this.setDirtyCanvas(true)
                }))
            }
            this.updateSeedHistory = () => {
                slots.forEach((w, i) => {
                    const seed = slotSeed(i)
                    w.label = seed === undefined ? "—" : `↺ ${seed}`
                    w.disabled = seed === undefined
                })
                this.setDirtyCanvas(true)
            }
            this.widgets.splice(this.widgets.indexOf(slots[0]), HISTORY)
            this.widgets.unshift(...slots)

            button("random_seed", "🎲 Random seed (-1)", () => { seedWidget.value = RANDOM })
            button("new_seed", "🌱 New seed", () => { seedWidget.value = randomSeed() })

            let queued = null
            seedWidget.beforeQueued = () => {
                if (this.mode === MUTED || this.mode === BYPASSED) return
                queued = seedWidget.value === RANDOM ? randomSeed() : seedWidget.value
                const history = this.properties.seed_history.filter((s) => s !== queued)
                history.push(queued)
                this.properties.seed_history = history.slice(-HISTORY)
                this.updateSeedHistory()
            }
            seedWidget.serializeValue = () => seedWidget.value === RANDOM && queued !== null ? queued : seedWidget.value

            this.updateSeedHistory()
        }

        const onConfigure = nodeType.prototype.onConfigure
        nodeType.prototype.onConfigure = function () {
            onConfigure?.apply(this, arguments)
            this.updateSeedHistory()
        }
    },
})
