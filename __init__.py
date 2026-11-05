from comfy_api.latest import io, ComfyExtension

WEB_DIRECTORY = './web'


class DavchaSeed(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="DavchaSeed",
            display_name="Seed",
            category="davcha/utils",
            description="Seed with history. -1 picks a random seed at queue time.",
            inputs=[
                io.Int.Input("seed", default=-1, min=-1, max=0xffffffffffffffff, control_after_generate=False),
            ],
            outputs=[io.Int.Output(display_name="seed")],
        )

    @classmethod
    def execute(cls, seed):
        return io.NodeOutput(seed)


class DavchaSeedExtension(ComfyExtension):
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [DavchaSeed]


async def comfy_entrypoint() -> DavchaSeedExtension:
    return DavchaSeedExtension()
