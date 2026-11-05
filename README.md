# comfyui_davcha_seed

A single **Seed** node (`davcha/utils`):

- the seed widget (editable); `-1` picks a new random seed each time the prompt is queued,
- **🎲 Random seed (-1)** sets the widget to `-1`,
- **🌱 New seed** sets a new fixed random seed,
- five history buttons above the widget keep the last 5 queued seeds, the most recent at the bottom. Click one to reuse it.

The history is stored in the node properties, so it is saved with the workflow (and in the workflow embedded in output images).
# comfyui_davcha_seed
