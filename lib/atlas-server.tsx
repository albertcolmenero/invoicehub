import { AtlasNextServerClient } from "@runonatlas/private-next/server";
import { auth } from "@clerk/nextjs/server";

export const atlasServerClient = new AtlasNextServerClient(
  async () => {
    const { userId } = await auth();

    return userId;
  }
  ,
  {
    baseClientOptions: {
      _atlasHost: "https://dev.platform.runonatlas.com", // THIS LINE!!!!!!!!!
    },
    prettyPrint: true,
    verboseLevel: "debug",
  }
);